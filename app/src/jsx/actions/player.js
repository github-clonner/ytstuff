import { PLAY_SONG, PAUSE_SONG } from './constants';

export function playSong(song) {
	return {
		type: PLAY_SONG,
		data: song
	};
}

export function pauseSong() {
	return {
		type: PAUSE_SONG
	};
}