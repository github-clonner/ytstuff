import { combineReducers } from 'redux';
import { downloadedSongsReducer, downloadingSongsReducer } from './songs_reducer';
import { playerReducer } from './player_reducer';
import { pluginReducer } from './plugin_reducer';

export const mainReducer = combineReducers({
	downloadedSongs: downloadedSongsReducer,
	downloadingSongs: downloadingSongsReducer,
	player: playerReducer,
	plugin: pluginReducer
});