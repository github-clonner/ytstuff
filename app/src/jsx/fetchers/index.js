import { fetchYoutubeSong } from './youtube';
import { YOUTUBE_SONG } from './constants';
import { fetchSongFromCache } from './cache';

const fetchers = {
	YOUTUBE_SONG: fetchYoutubeSong
};

export default function fetch(song, boundAction, boundCacheAction) {
	const songFromCache = fetchSongFromCache(song);
	if (songFromCache) {
		return boundCacheAction ? boundCacheAction(songFromCache) : boundAction(songFromCache);
	}

	return fetchers[song.type](song).then(song => {
		boundAction(song);
		return song;
	});
}