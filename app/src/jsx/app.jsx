import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import DownloadedSongs from './routes/DownloadedSongs.jsx';
import DownloadingSongs from './routes/DownloadingSongs.jsx';
import { Provider, connect } from 'react-redux';
import { addDownloadedSong } from './actions/songs';
import Player from './components/Player.jsx';
import Navbar from './components/Navbar.jsx';
import store from './store';
import nw from 'nw.gui';
import startServer from './server';
import startPlayer from './player';

startServer();
startPlayer();

nw.Window.get().showDevTools();

class App extends React.Component {
  render () {
    return (
    	<div>
        <Redirect exact from="/_generated_background_page.html" to="/downloaded"/>
        <Navbar/>
        <Switch>
          <Route exact path="/downloaded" component={DownloadedSongs}/>
          <Route exact path="/downloading" component={DownloadingSongs}/>
        </Switch>
    		<Player/>
    	</div>
    );
  }
}

render((
	<BrowserRouter>
		<Provider store={store}>
			<App/>
		</Provider>
	</BrowserRouter>
), document.getElementById('app'));
