import React from 'react';

import './Window.css';

export class Window extends React.Component {
	render() {
		return(
			<div className="window">
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
			    <div className="console">
				<div id="console-history">
				    Welcome To Murali Kulachandran's Website
				    <div className="console-input">
					<input name="cmdline" id="cmdline" type="text" className="console-input-text" value="M:\> " />
				    </div>
				</div>
			    </div>
			</div>
		)
	}
}
