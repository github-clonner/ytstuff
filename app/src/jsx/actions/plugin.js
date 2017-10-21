import { CHANGE_PLUGIN_STATE } from './constants';

export function changePluginState(status) {
	return {
		type: CHANGE_PLUGIN_STATE,
		data: status
	};
}