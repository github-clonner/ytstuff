import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

export class ExpandButton extends React.Component {
	render() {
		return (
			<div className="expand-button"><Glyphicon className={this.props.disabled ? 'disabled' : ''} glyph="plus"/></div>
		)
	}
}