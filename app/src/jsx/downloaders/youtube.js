import ytdl from 'ytdl-core';

export default function downloadFromYoutube(song) {
	const url = 'http://www.youtube.com/watch?v=' + song.id;
	return ytdl(url, { filter: 'audioonly' });
}