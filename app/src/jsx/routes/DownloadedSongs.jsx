import React from 'react';
import { SongList } from '../components/SongList.jsx';
import { connect } from 'react-redux';
import { addSong } from '../actions/songs';
import { fetchQueryFromCache } from '../fetchers/cache';
import { STATE_DOWNLOADED } from '../fetchers/constants';
import { LIST_END } from '../actions/constants';
import store from '../store';

function mapStateToProps(state) {
	return {
		downloadedSongs: state.downloadedSongs
	};
}

class DownloadedSongs extends React.Component {
	componentDidMount() {
		for (const song of fetchQueryFromCache({ filter: { state: STATE_DOWNLOADED }, order: { 'created': 'desc' }, count: 10 })) {
			store.dispatch(addSong(song, LIST_END));
		}
	}

	render() {
		return <SongList items={this.props.downloadedSongs}/>
	}
}

const BoundDownloadedSongs = connect(mapStateToProps)(DownloadedSongs);
export default BoundDownloadedSongs;