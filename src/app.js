const fs = require('fs'),
      ytdl = require('ytdl-core'),
      ffmpeg = require('fluent-ffmpeg'),
      url = require('url'),
      io = require('socket.io')(),
      songs = require('./data/songs.json'),
      google = require('googleapis'),
      youtube = google.youtube('v3'),
      config = require('./config/config.json'),
      API_KEY = require('./config/youtube.json').api_key,
      _ = require('lodash'),
      utils = require('./utils');

class ConcurrentExecutor {
    constructor(action, concurrency) {
        this.action = action;
        this.concurrency = concurrency;
        this.queue = [];
        this.concurrentExecutors = 0;
        this.canRunMore = true;
    }

    queueTask(task) {
        this.queue.push(task);
        this._tryToRun();
    }

    queueTasks(tasks) {
        this.queue = this.queue.concat(tasks);
        this._tryToRun();
    }

    _tryToRun() {
        if(this.canRunMore) {
            this._runExecutors();
        } 
    }

    _runExecutors() {
        this.canRunMore = false;
        for(let i = this.concurrentExecutors; i < this.concurrency; i++) {
            this.concurrentExecutors++;
            this._runExecutor();
        }
    }

    _runExecutor() {
        if(this.queue.length > 0) {
            const task = this.queue.shift();
            this.action(task).then(() => this._runExecutor());
        } else {
            this.concurrentExecutors--;
            this.canRunMore = true;
        }
    }
}

class Downloader {
    constructor(songs={}, concurrency=4) {
        this.songs = songs;
        this.executor = new ConcurrentExecutor((videoId) => this._downloadSong(videoId), concurrency);
        this.splitter = new Splitter(songs);

        this.executor.queueTasks(Object.keys(this.songs));
    }

    queueDownload(song) {
        this.executor.queueTask(song);
    }

    _downloadSong(videoId) {
        return new Promise((resolve, reject) => {
            const url = 'http://www.youtube.com/watch?v=' + videoId;
            const fileName = utils.getFileName(this.songs[videoId].title);
            if(fs.existsSync(fileName)) {
                this.splitter.splitAlbum(videoId);
                return resolve();
            }

            console.log(this.songs[videoId].title + ' is being downloaded');
            const stream = ytdl(url);
            const proc = new ffmpeg({source: stream});
            proc.on('process', console.log);
            proc.on('end', () => {
                this.splitter.splitAlbum(videoId);
                console.log('done!');
                resolve();
            });

            proc.outputOption('-metadata', `title=${this.songs[videoId].title.split('-')[1]}`)
                .outputOption('-metadata', `artist=${this.songs[videoId].title.split('-')[0]}`);

            proc.saveToFile(fileName);
        })
    }
}

class Splitter {
    constructor(songs={}, concurrency=3) {
        this.songs = songs;
        this.executor = new ConcurrentExecutor((song) => this._splitSong(song), concurrency);
    }

    splitAlbum(videoId) {
        return new Promise((resolve) => {
            this._getSongList(videoId).then((songList) => {
                if(songList.length > 1) {
                    songList = songList.map(({ start, name }, i, songs) => {
                        const res = { albumName: this.songs[videoId].title, songName: name, start };
                        if(i !== songs.length - 1) {
                            res.duration = songs[i + 1].start - start;
                        }

                        return res;
                    });

                    this.executor.queueTasks(songList);
                }

                resolve();
            });
        });
    }

    _splitSong({ albumName, songName, start, duration }) {
        return new Promise((resolve) => {
            const artist = albumName.split('-')[0].trim();

            if(fs.existsSync(config.download_folder + utils.sanatizeFileName(artist + ' - ' + songName + '.mp3'))) {
                return resolve();
            }

            console.log(`splitting ${songName} from ${albumName}`);
            const songProc = new ffmpeg({source: fs.createReadStream(utils.getFileName(albumName))});
            songProc.on('end', () => resolve());

            if(start !== 0) {
                songProc.seek(start);
            }

            if(duration) {
                songProc.duration(duration);
            }

            songProc
                .outputOption('-metadata', `title=${songName}`)
                .outputOption('-metadata', `artist=${artist}`)
                .outputOption('-metadata', `album=${albumName.split('-')[1]}`);

            songProc.saveToFile(config.download_folder + utils.sanatizeFileName(artist + ' - ' + songName + '.mp3'));
        });
    }

    _getSongList(videoId) {
        return new Promise((resolve) => {
            if(this.songs[videoId].songs) {
                return this.songs[videoId].songs;
            }

            youtube.videos.list({
                part: 'contentDetails',
                auth: API_KEY,
                id: videoId
            }, (err, snippet) => {
                if(utils.getDuration(snippet.items[0].contentDetails.duration) < config.min_duration_to_split) {
                   return resolve([]); 
                }
                
                youtube.videos.list({
                    part: 'snippet',
                    auth: API_KEY,
                    id: videoId
                }, (err, snippet) => {
                    let songList = this._parseSongList(snippet.items[0].snippet.description);
                    if(songList.length > 1) {
                        this.songs[videoId].songs = songList;
                        return resolve(songList);
                    }
                    
                    youtube.commentThreads.list({
                        part: 'snippet',
                        auth: API_KEY,
                        videoId: videoId,
                        order: 'relevance',
                        textFormat: 'plainText',
                        maxResults: 100
                    }, (err, comments) => {
                        for(const comment of comments.items) {
                            let songList = this._parseSongList(comment.snippet.topLevelComment.snippet.textDisplay);
                            if(songList.length > 1) {
                                this.songs[videoId].songs = songList;
                                return resolve(songList);
                            }
                        }

                        return resolve([]);
                    })
                })
            })
        });
    }

    _parseSongList(text) {
        const tests = [
            {
                re: /^(?:(.+?)([0-9]+:[0-9]+)[\s-]+((?:[0-9]+:)?[0-9]+:[0-9]+))[^a-zA-Z0-9]*$/m,
                parseMatch: (match) => ({start: match[2], name: match[1]})
            }, {
                re: /^(?:(.+?)((?:[0-9]+:)?[0-9]+:[0-9]+))[^a-zA-Z0-9]*$/m,
                parseMatch: (match) => ({start: match[2], name: match[1]})
            }, {
                re: /^(?:((?:[0-9]+:)?[0-9]+:[0-9]+)(.+?))[^a-zA-Z0-9]*$/m,
                parseMatch: (match) => ({start: match[1], name: match[2]})
            }
        ];

        const songs = [];
        for(const test of tests) {
            let match;
            while(match = test.re.exec(text)) {
                const song = this._formatSongMatch(test.parseMatch(match));
                songs.push(song);
                text = text.replace(test.re, '');
            }
        }
        return _.drop(songs, _.findIndex(songs, { start: _.min(_.map(songs, (song) => song.start)) }));
    }

    _formatSongMatch({ start, name }) {
        const newName = name.replace(/[-\s\[,\.]*$/, '').replace(/^[-\s]*[IVXivx0-9]+[-\s]*[\.\)]?/, '').trim();
        const startParts = start.split(':').reverse();
        const multiples = [1, 60, 3600];
        let time = startParts.reduce((x, y, i) => (+x) + y * multiples[i]);

        return { start: time, name: (newName === '' ? name : newName) };
    }
}

downloader = new Downloader(songs, config.concurrency);

io.on('connection', (socket) => {
    console.log('connected!');
    socket.on('song', (tab) => {
        const videoId = url.parse(tab.url, true).query['v'];
        if(videoId) {
            songs[videoId] = { title: tab.title.replace(' - YouTube', '') };
            fs.writeFileSync('./songs.json', JSON.stringify(songs));
            downloader.queueDownload(videoId);
        }
    });
});

io.listen(8000);