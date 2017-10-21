import React from 'react';
import { connect } from 'react-redux';

class Player extends React.Component {
	render() {
		if (this.props.player.currentSong) {
			return <div className="footer">{this.props.player.currentSong.fileName}</div>;
		}

		return <div className="footer">kappa</div>;
	}
}

function mapStateToProps(state) {
	return {
		player: state.player
	};
}

const BoundPlayer = connect(mapStateToProps)(Player);
export default BoundPlayer;