import React from 'react';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import { SongListItem } from './SongListItem.jsx';

export class SongList extends React.Component {
	render() {
		return (
			<Panel header="this is a list of your shitty music">
				<ListGroup fill>
					<ListGroupItem>
						{this.props.items.map((item) => {
							return <SongListItem key={item.thumbnail} song={item}/>;
						})}
					</ListGroupItem>
				</ListGroup>
			</Panel>
		)
	}
}