import store from '../store';
import { SONG_PLAYING } from '../actions/constants';

let prevPlayer;
function handlePlay() {
	const player = store.getState().player;
	if (player === prevPlayer || !player.currentSong) {
		return;
	}

	if (player.state === SONG_PLAYING) {
		if (!prevPlayer || prevPlayer.currentSong !== player.currentSong) {
			player.audio.src = `http://localhost:8000/resources/${player.currentSong.fileName}`;
		}
		player.audio.play();
	} else {
		player.audio.pause();
	}

	prevPlayer = player;
}

export default function startPlayer() {
	store.subscribe(handlePlay);
}