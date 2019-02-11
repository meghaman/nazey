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
			cmd : '',
			history : [{ command : 'Welcome To Murali Kulachandran\'s Website', className : 'console-text' , key : 0}],
			history_count : 0
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

			this.setState(state => {
				const history_count = state.history_count + 1;
				const history = state.history.concat([{command : state.mode.Prefix + ' ' + state.cmd, className : 'the', key : history_count }]);
				
				// To-Do: Is this really the best way?
				return {
					history,
					cmd : '',
					mode : state.mode,
					history_count
				}
			});

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
			{this.state.history.map(item =>
				<ConsoleHistory key={item.key} history={item} />
			)}
			    <div className="console-input">
				<input name="cmdline" id="cmdline" type="text" value={this.state.mode.Prefix + this.state.cmd} className="console-input-text" onChange={this.cmdLine_Change} onKeyUp={this.keyUpHandler}/>
			    </div>
			</div>
		    </div>
		)
	}
}

function ConsoleHistory(props)
{
	return(
		<div className={props.history.className}>{props.history.command}</div>
	);
}
