import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';
import { playSong, pauseSong } from '../actions/player';
import store from '../store';
import { SONG_PLAYING } from '../actions/constants';
import { connect } from 'react-redux';
import _ from 'lodash';

class PlayButton extends React.Component {
	onClick() {
		if (_.isEqual(this.props.player.currentSong, this.props.song) && this.props.player.state === SONG_PLAYING) {
			store.dispatch(pauseSong());
		} else {
			store.dispatch(playSong(this.props.song));
		}
	}

	render() {
		return (
			<div onClick={() => this.onClick()} className="play-button"><Glyphicon glyph={
				_.isEqual(this.props.player.currentSong, this.props.song) && this.props.player.state === SONG_PLAYING ? 'pause' : 'play'
			}/></div>
		)
	}
}

function mapStateToProps(state) {
	return {
		player: state.player
	};
}

const BoundPlayButton = connect(mapStateToProps)(PlayButton);
export default BoundPlayButton;