import { PLAY_SONG, PAUSE_SONG, SONG_PLAYING, SONG_PAUSED } from '../actions/constants';

const context = new AudioContext();
const gain = context.createGain();
const audio = new Audio();
const source = context.createMediaElementSource(audio);

source.connect(gain);
gain.connect(context.destination);

const initialState = {
	context,
	audio,
	source,
	gain,
	state: SONG_PAUSED
};

export function playerReducer(state = initialState, action) {
	switch(action.type) {
		case PLAY_SONG:
			return Object.assign({}, state, {
				currentSong: action.data,
				state: SONG_PLAYING
			});
		case PAUSE_SONG:
			return Object.assign({}, state, {
				state: SONG_PAUSED
			});
		default:
			return state;
	}
}