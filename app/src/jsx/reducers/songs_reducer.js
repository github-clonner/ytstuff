import { ADD_SONG, LIST_START } from '../actions/constants';
import { STATE_DOWNLOADED, STATE_DOWNLOADING } from '../fetchers/constants';
import _ from 'lodash';

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

function tryToAdd(list, { song, where }, belongsInList) {
	const songInList = _.find(list, { id: song.id, type: song.type });
	if (songInList) {
		if (belongsInList) {
			list = _.clone(list);
			Object.assign(songInList, song);
		} else {
			list = _.remove(songInList, { id: song.id, type: song.type });
		}
	} else if (belongsInList) {
		list = addSongToList(list, { song, where });
	}

	return list;
}

export function downloadedSongsReducer(state = [], action) {
	switch(action.type) {
		case ADD_SONG:
			return tryToAdd(state, action.data, action.data.song.state === STATE_DOWNLOADED);
		default:
			return state;
	}
}

export function downloadingSongsReducer(state = [], action) {
	switch(action.type) {
		case ADD_SONG:
			return tryToAdd(state, action.data, action.data.song.state === STATE_DOWNLOADING);
		default:
			return state;
	}
}