import youtube from '../apis/youtube';
import { YOUTUBE_SONG, STATE_DOWNLOADING } from './constants';
import moment from 'moment';
import { processSong } from '../utils';

export function fetchYoutubeSong({ id: songId }) {
	return new Promise((resolve, reject) => {
		youtube.videos.list({
			part: 'contentDetails,snippet',
			id: songId
		}, (err, response) => {
			resolve(processSong({
				id: songId,
				type: YOUTUBE_SONG,
				state: STATE_DOWNLOADING,
				title: response.items[0].snippet.title,
				thumbnail: response.items[0].snippet.thumbnails.high.url,
				duration: moment.duration(response.items[0].contentDetails.duration).as('seconds'),
			}));
		});
	});
}