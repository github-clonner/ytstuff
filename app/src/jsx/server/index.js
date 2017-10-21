import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import store from '../store';
import url from 'url';
import { changePluginState } from '../actions/plugin';
import fetch from '../fetchers';
import { PLUGIN_CONNECTED, LIST_START } from '../actions/constants';
import { YOUTUBE_SONG } from '../fetchers/constants';
import { fetchSong } from '../actions/songs';
import download from '../downloaders';

export default function startServer() {
	const app = express();
	const server = http.createServer(app);
	const io = socketio(server);

	app.use('/resources', express.static('../downloads'));

	io.on('connection', (socket) => {
		console.log('connected');
		store.dispatch(changePluginState(PLUGIN_CONNECTED));
		socket.on('song', (tab) => {
			const videoId = url.parse(tab.url, true).query.v;
			store.dispatch(fetchSong({ id: videoId, type: YOUTUBE_SONG }, LIST_START)).then(song => download(song));
		});
		/*socket.on('song', (tab) => {
			const videoId = url.parse(tab.url, true).query['v'];
			if(videoId) {
				songs[videoId] = { title: tab.title.replace(' - YouTube', '') };
				fs.writeFileSync('./songs.json', JSON.stringify(songs));
				downloader.queueDownload(videoId);
			}
		});*/
	});

	server.listen(8000);
}