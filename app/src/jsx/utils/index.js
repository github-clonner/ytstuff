import { download_folder } from '../../../config/config.json';
import path from 'path';

export function processSong(song) {
	if (song.title) {
		let splitBy = ':';
		if (song.title.indexOf('-') !== -1) {
			splitBy = '-';
		} else if(song.title.indexOf('"') !== -1) {
			splitBy = '"';
		}

		song.artistName = song.title.split(splitBy)[0];
		song.songName = song.title.split(splitBy)[1];
	}

	return song;
}

export function getFileName(song) {
	return path.join(download_folder, song.artistName + ' - ' + song.songName + '.mp3');
}

export class ConcurrentExecutor {
	constructor(action, concurrency = 4) {
		this.action = action;
		this.concurrency = concurrency;
		this.queue = [];
		this.concurrentExecutors = 0;
		this.canRunMore = true;
	}

	queueTask(task) {
		return new Promise((resolve, reject) => {
			this.queue.push({ task, resolve });
			this._tryToRun();
		});
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
			const { task, resolve } = this.queue.shift();
			this.action(task).then(() => {
				resolve(task);
				this._runExecutor();
			});
		} else {
			this.concurrentExecutors--;
			this.canRunMore = true;
		}
	}
}
