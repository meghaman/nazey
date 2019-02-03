import React from 'react';
import ReactDOM from 'react-dom';

import { Desktop } from './Desktop/Desktop';
import { Window } from './Console/Window';

import './app.css';

ReactDOM.render(
	<div className='container'>
		<Desktop />
		<Window />
	</div>
	,
	document.getElementById('app')
);
