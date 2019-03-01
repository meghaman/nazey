import React from 'react';

import { Console } from './Console';

import './Window.css';

export class Window extends React.Component {
	handleClick() {
		this.refs.console.setFocus();
	}

	render() {
		return(
			<div className="window" onClick={this.handleClick.bind(this)}>
			    <div className="window-title">
				<span className="window-title-content">
				    M:\
				</span>
				<span className="window-title-buttons">
				    <img src="assets/minimize.png" />
				    <img src="assets/maximize.png" />
				    <img src="assets/close.png" />
				</span>
			    </div>
			    <Console ref="console" />
			</div>
		)
	}
}
