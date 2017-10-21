import cachedSongs from '../../../data/songs.json';
import _ from 'lodash';
import { processSong } from '../utils';

export function fetchSongFromCache(song) {
	for (const cachedSong of cachedSongs) {
		if (cachedSong.type === song.type && cachedSong.id === song.id) {
			return processSong(cachedSong);
		}
	}
}

export function fetchQueryFromCache({ filter, count, order, start }) {
	const filteredSongs = _.filter(cachedSongs, filter);
	const sortedSongs = _.orderBy(filteredSongs, _.keys(order), _.values(order));
	const startingIndex = start ? _.findIndex(sortedSongs, start) + 1 : 0;

	return _.slice(sortedSongs, startingIndex, startingIndex + count).map(processSong);
}

export function addToCache(song) {

}