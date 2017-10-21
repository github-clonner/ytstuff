import { ADD_SONG, LIST_START } from '../actions/constants';
import { STATE_DOWNLOADED, STATE_DOWNLOADING } from '../fetchers/constants';

function addSongToList(list, song) {
	if (song.where === LIST_START) {
		return [
			song.song,
			...list
		];
	} else {
		return [
			...list,
			song.song
		];
	}
}

export function downloadedSongsReducer(state = [], action) {
	switch(action.type) {
		case ADD_SONG:
			console.log(action.data.song);
			if (action.data.song.state === STATE_DOWNLOADED)
				return addSongToList(state, action.data);

			return state;
		default:
			return state;
	}
}

export function downloadingSongsReducer(state = [], action) {
	switch(action.type) {
		case ADD_SONG:
			if (action.data.song.state === STATE_DOWNLOADING)
				return addSongToList(state, action.data);
			
			return state;
		default:
			return state;
	}
}