import React from 'react';

import { IconList } from './IconList';
import { Taskbar } from './Taskbar';

import './Desktop.css';

export class Desktop extends React.Component {
	render() {
		return(
		<div className="desktop">
			<IconList />
			<Taskbar />
		</div>
		);
	}
}
