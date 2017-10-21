import React from 'react';
import { SongList } from '../components/SongList.jsx';
import { connect } from 'react-redux';
import { addDownloadedSong } from '../actions/songs';
import { fetchQueryFromCache } from '../fetchers/cache';
import { STATE_DOWNLOADED } from '../fetchers/constants';
import { LIST_END } from '../actions/constants';
import store from '../store';

function mapStateToProps(state) {
	return {
		downloadingSongs: state.downloadingSongs
	};
}

class DownloadingSongs extends React.Component {
	render() {
		return <SongList items={this.props.downloadingSongs}/>
	}
}

const BoundDownloadingSongs = connect(mapStateToProps)(DownloadingSongs);
export default BoundDownloadingSongs;