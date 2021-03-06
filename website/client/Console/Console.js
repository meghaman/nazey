import React from 'react';

import './Console.css';

const modes = {
	Command : {
		Prefix : 'M:/> ',
		UserEntry : function(payload) {
			// Get entered command 
			var command = payload.split(" ")[0];

			// Does word match action?
			const action = this.state.mode[command];

			if (action) {
				// Call next function
				this.dispatch(command, payload.split(" ").slice(1));
			}
			else
			{
				this.updateAfterInput(command ? {command : 'Unrecognized Command: ' + command, className : 'user-entry' } : null);
			}
			

		},
		Trivia : function(payload) {
			this.updateAfterInput({command : 'Logging Into Game Server...', className : 'trivia-message' }, modes.Trivia);
			this.updateAfterInput({command : 'Type "!quit" to disconnect', className : 'trivia-emphasis' }, null);
			this.connectToTrivia();			
		},
		LongMatch : function(args) {
			this.updateAfterInput({command : 'String: ' + args[0] + ', Pattern: ' + args[1], className : 'user-entry' }, null);
			this.longMatch(args);
		}
	},
	Trivia : {
		Prefix : '',
		UserEntry : function(payload) {
			if(payload === '!quit')
			{
				this.disconnectFromTrivia();
				return;
			}
			var data = {};
			data.answer = payload;
			console.log("User answer: " + payload);
			fetch('cmd/trivia/answer', {
				method: 'post',
				body: JSON.stringify(data),
				headers: {
					"sse-user-id" : this.userId,
					"Content-Type" : "application/json"
				}
			}).then(function(response) {
				return response.text();
			}).then(function(responseText) {
				if(responseText == "Correct")
				{
					this.updateAfterInput({command : 'Correct!', className : 'trivia-correct' });
				}
				else
				{
					this.updateAfterInput({command : 'Incorrect!', className : 'trivia-incorrect' });
				}
			}.bind(this));
		}
	}
};

export class Console extends React.Component
{

	constructor()
	{
		super();
		this.state = {
			mode : modes.Command,
			cmd : '',
			history : [{ command : 'Welcome To Murali Kulachandran\'s Website', className : 'console-text' , key : 0}, { command : 'Available Commands: Trivia', className : 'console-text' , key : 1}],
			history_count : 1
		};

		this.keyUpHandler = this.keyUpHandler.bind(this);
		this.cmdLine_Change = this.cmdLine_Change.bind(this);
		this.dispatch = this.dispatch.bind(this);
		this.updateAfterInput = this.updateAfterInput.bind(this);
		this.connectToTrivia = this.connectToTrivia.bind(this);
		this.disconnectFromTrivia = this.disconnectFromTrivia.bind(this);
		this.longMatch = this.longMatch.bind(this);

		this.userId = -1;
	}

	keyUpHandler(e)
	{
		if (e.keyCode == 13) {
			this.dispatch('UserEntry', this.state.cmd);
		}
	}

	dispatch(actionName, ...payload) {
		const action = this.state.mode[actionName];

		console.log('State: ' + this.state.mode);
		console.log('Action: ' + actionName);

		if (action) {
			action.call(this, ...payload);
			return true;
		}
		return false;
	}

	cmdLine_Change(e)
	{
		// Check if the user removed the prefix - wipe their input if they are a smartass
		if(e.target.value.indexOf(this.state.mode.Prefix) != 0)
			this.setState({ cmd : '' });
		else
			this.setState({ cmd : e.target.value.replace(this.state.mode.Prefix, '') })
	}

	connectToTrivia()
	{
		this.evSource = new EventSource('/cmd/trivia/login');

		this.evSource.addEventListener('login', function (broadcast) {
			var loginData = JSON.parse(broadcast.data);
			this.userId = loginData.userId;
			console.log("Connected Users: " + loginData.userCount);
			this.updateAfterInput({command : 'Number of connected users: ' + loginData.userCount, className : 'trivia-message' });
		}.bind(this));

		this.evSource.addEventListener('ping', function (broadcast) {
			console.log(broadcast);
		});

		this.evSource.addEventListener('newQuestion', function (question) {
			var questionObj = JSON.parse(question.data);
			console.log("JSON Question: " + JSON.parse(question.data));
			this.updateAfterInput({command : 'Category: ' + questionObj.category, className : 'trivia-category' });
			this.updateAfterInput({command : 'Question: ' + questionObj.question, className : 'trivia-question' });
			console.log("New Question Asked: " + question.data);
		}.bind(this));

		this.evSource.addEventListener('answer', function (answer) {
			this.updateAfterInput({command : 'Answer: ' + answer.data, className : 'trivia-answer' });
			console.log("Answer: " + answer.data);
		}.bind(this));
	}

	updateAfterInput(consoleMessage, newState)
	{
		this.setState(state => {
			var history_count = state.history_count + 1;
			var history = state.history.concat([{command : state.mode.Prefix + ' ' + state.cmd, className : 'user-entry', key : history_count }]);
			
			if(consoleMessage)
			{
				history_count++;

				// To-Do: Probably fixable
				const attachedKey = Object.assign({key: history_count}, consoleMessage);
				// attachedKey.key = history_count;
				console.log(attachedKey.command);

				history = history.concat(attachedKey);
			}

			// To-Do: Is this really the best way?
			return {
				history,
				cmd : '',
				mode : newState ? newState : state.mode,
				history_count
			}
		});
	}

	componentDidUpdate()
	{
		this.scrollToBottom.call(this);
	}

	scrollToBottom() {
		this.messagesEnd.scrollIntoView({ behavior: "smooth" });
	}

	setFocus()
	{
		this.refs.Input.focus();
	}
	
	disconnectFromTrivia()
	{
		this.evSource.close();
		this.updateAfterInput({command : 'Disconnecting from Game Server...', className : 'user-entry' }, modes.Command);
	}

	longMatch(args)
	{
		// Recursion!
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
				<input name="cmdline" id="cmdline" type="text" ref="Input" value={this.state.mode.Prefix + this.state.cmd} className="console-input-text user-entry" onChange={this.cmdLine_Change} onKeyUp={this.keyUpHandler}/>
			    </div>
				<div ref={(el) => { this.messagesEnd = el; }}>			
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
