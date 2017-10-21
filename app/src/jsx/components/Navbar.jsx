import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PluginConnectionIndecator from './PluginConnectionIndecator.jsx';

export default class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.selected = "DOWNLOADED";
	}

	onSelect(selected) {
		this.selected = selected;
	}

	render() {
		return (
			<Nav bsStyle="tabs" activeKey={this.selected} onSelect={(selected) => this.onSelect(selected)}>
				<NavItem eventKey={"DOWNLOADED"}><Link to="/downloaded">Downloaded Songs</Link></NavItem>
				<NavItem eventKey={"DOWNLOADING"}><Link to="/downloading">Downloading Songs</Link></NavItem>
				<li className="plugin-connection-indecator"><PluginConnectionIndecator/></li>
			</Nav>
		);
	}
}