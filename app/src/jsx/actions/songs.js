import { ADD_SONG } from './constants';
import { bindActionCreators } from 'redux';
import fetch from '../fetchers';

export function addSong(song, where) {
	return {
		type: ADD_SONG,
		data: {
			song,
			where
		}
	};
}

export function fetchSong(song, where) {
	return dispatch => fetch(song, bindActionCreators((song) => addSong(song, where), dispatch));
}

