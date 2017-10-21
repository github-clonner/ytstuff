import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { getFileName, ConcurrentExecutor } from '../utils';
import downloadFromYoutube from './youtube';

function downloadSong(song) {
	return new Promise((resolve, reject) => {
		try {
			console.log(song);
			const fileName = getFileName(song);
			if (fs.existsSync(fileName)) {
				return resolve();
			}

			const stream = downloaders[song.type](song);
			const proc = new ffmpeg({source: stream});

			proc.on('end', () => {
				console.log('done!');
				resolve();
			}).on('error', function(err) {
				console.log('An error occurred: ' + err.message);
			});

			proc.outputOption('-metadata', `title=${song.songName}`)
				.outputOption('-metadata', `artist=${song.artistName}`);

			proc.saveToFile(fileName);

		} catch(e) {
			console.log(e);
		}
	});
}

const DOWNLOAD_CONCURRENCY = 4;
const executor = new ConcurrentExecutor(downloadSong, DOWNLOAD_CONCURRENCY);
const downloaders = {
	YOUTUBE_SONG: downloadFromYoutube
};

export default function download(song) {
	executor.queueTask(song);
}