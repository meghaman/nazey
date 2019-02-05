import React from 'react';

import './Console.css';

var modes = {
	Command : { Prefix : 'M:/> ' },
	Trivia : { Prefix : '' }
};

export class Console extends React.Component
{
	constructor()
	{
		super();
		this.state = {
			mode : modes.Command,
			cmd : ''
		};

		this.keyUpHandler = this.keyUpHandler.bind(this);
		this.cmdLine_Change = this.cmdLine_Change.bind(this);
	}

	keyUpHandler(e)
	{
		if (e.keyCode == 13) {
			console.log("Enter key pressed: " + e.target.value);
			
			// Reset input
			// Process command

			this.setState({ cmd : '' });
		}
	}

	cmdLine_Change(e)
	{
		// Check if the user removed the prefix - wipe their input if they are a smartass
		if(e.target.value.indexOf(this.state.mode.Prefix) != 0)
			this.setState({ cmd : '' });
		else
			this.setState({ cmd : e.target.value.replace(this.state.mode.Prefix, '') })
	}
	
	render()
	{
		return(
		    <div className="console">
			<div id="console-history">
			    Welcome To Murali Kulachandran's Website
			    <div className="console-input">
				<input name="cmdline" id="cmdline" type="text" value={this.state.mode.Prefix + this.state.cmd} className="console-input-text" onChange={this.cmdLine_Change} onKeyUp={this.keyUpHandler}/>
			    </div>
			</div>
		    </div>
		)
	}
}
