import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import { getFileName, ConcurrentExecutor } from '../utils';
import downloadFromYoutube from './youtube';
import moment from 'moment';
import store from '../store';
import { LIST_END } from '../actions/constants';
import { addSong } from '../actions/songs';

function downloadSong(song) {
	return new Promise((resolve, reject) => {
		const fileName = getFileName(song);
		/*if (fs.existsSync(fileName)) {
			return resolve();
		}*/

		const stream = downloaders[song.type](song);
		const proc = new ffmpeg({source: stream});

		proc.on('end', () => {
			resolve();
		}).on('progress', progress => {
			song = Object.assign({}, song, { downloadedPercent: moment.duration(progress.timemark).asMilliseconds() / (song.duration * 1000) });
			store.dispatch(addSong(song, LIST_END));
		});

		proc.outputOption('-metadata', `title=${song.songName}`)
			.outputOption('-metadata', `artist=${song.artistName}`);

		proc.saveToFile(fileName);

	});
}

const DOWNLOAD_CONCURRENCY = 4;
const executor = new ConcurrentExecutor(downloadSong, DOWNLOAD_CONCURRENCY);
const downloaders = {
	YOUTUBE_SONG: downloadFromYoutube
};

export default function download(song) {
	return executor.queueTask(song);
}