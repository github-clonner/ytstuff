import { CHANGE_PLUGIN_STATE, PLUGIN_DISCONNECTED, PLUGIN_CONNECTED } from '../actions/constants';

const initialState = {
	state: PLUGIN_DISCONNECTED
};

export function pluginReducer(state = initialState, action) {
	switch(action.type) {
		case CHANGE_PLUGIN_STATE:
			return Object.assign({}, state, {
				state: action.data
			});
		default:
			return state;
	}
}