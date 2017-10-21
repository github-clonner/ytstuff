import React from 'react';
import store from '../store';
import { connect } from 'react-redux';
import { PLUGIN_DISCONNECTED } from '../actions/constants';

class PluginConnectionIndecator extends React.Component {
	render() {
		return <div>{this.props.plugin ? this.props.plugin.state : 'asd'}</div>
	}
}

function mapStateToProps(state) {
	return {
		plugin: state.plugin
	};
}

const BoundPluginConnectionIndecator = connect(mapStateToProps)(PluginConnectionIndecator);
export default BoundPluginConnectionIndecator; 