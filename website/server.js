var express = require("express");
var bodyparser = require("body-parser");
var app = express();
var fs = require("fs");
var events = require("events");

const TRIVIA_TIMEOUT = 10000;

var eventEmitter = new events.EventEmitter();
var UNIQUE_ID   = 1;
var USER_ID     = 1e10;
var clients = {};

var currentQuestion = {}

var removeClient = function(id) {
	if(id) {
		delete clients[id];
	}
}

var broadcast = function(toId, msg, eventName) {

	if(toId === "*") {
		for(var p in clients) {
			broadcast(p, msg);
		}
		return;
	}

	var clientSocket = clients[toId];
	if(!clientSocket) {
		return;
	}

	eventName && clientSocket.write("event: " + eventName + "\n");
	clientSocket.write("id: " + (++UNIQUE_ID) + "\n");
	clientSocket.write("data: " + JSON.stringify(msg) + "\n\n");
	console.log("Finished writing event " + eventName  + " to user: " + toId + " with message: " + msg);
}

app.use(bodyparser.json({ type : 'application/json'})); // for parsing application/json
app.use(bodyparser.urlencoded({ extended: true }));	// for parsing POST 'data'

// Default Index route
app.get('/', function (req, res) {
	fs.readFile('./index.html', function(err, data) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end(data);
	});
});

// Content routes
app.use('/resume', express.static(__dirname + '/resume'));
app.use('/assets', express.static(__dirname + '/assets'));

var triviaRouter = express.Router();

triviaRouter.get('/login', function(req, res) 
{ 
	console.log("User Connected");
	res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache"
	});
	res.write(":" + Array(2049).join(" ") + "\n"); // 2kB
	res.write("retry: 2000\n");
		
	var sseUserId = req.headers['_sse_user_id_']; 
	removeClient(sseUserId);

	// A very simple id system. You'll need something more secure.
	sseUserId = (USER_ID++).toString(36);

	clients[sseUserId] = res;

	broadcast(sseUserId, sseUserId, "login");

	// broadcast current question

	setTimeout(function() {
		broadcast(sseUserId, new Date().getTime(), "ping");
	}, 3000);

	// Send back ID
	setInterval(function() {
		broadcast(sseUserId, new Date().getTime(), "ping");
	}, 10000);

	res.on("close", function() {
		console.log("User: " + sseUserId + " disconnected");
		removeClient(sseUserId);
	});

	setImmediate(function() { eventEmitter.emit("endQuestion", null); });

	return; 
});

triviaRouter.post('/answer', function(req, res) 
{
	console.log("Request Headers: " + JSON.stringify(req.headers));

	var sseUserId = req.get('sse-user-id'); 
	// TO-DO: Throw error if header doesn't exist
	
	var answer = req.body.answer;

	// TO-DO: Throw error if user doesn't exist

	console.log("User: " + sseUserId + " answer: " + answer);

	// TO-DO: Compare answer with current question
	
	// TO-DO: If wrong then message user answer is wrong
	// TO-DO: If right then message all users answer is right
	res.end();
});

app.use('/cmd/trivia', triviaRouter);

var askQuestion = function()
{
	console.log("Asking new question");

	// TO-DO: open FS and get new question
	currentQuestion.question = "Ol' Hope and Change. The 44th president of course";
	currentQuestion.answer = "Barack Obama";
	currentQuestion.topic = "Presidential";
	
	// TO-DO: send only topic & question
	broadcast("*", currentQuestion.question, "newQuestion"); 

	console.log("Throwing endQuestion in " + TRIVIA_TIMEOUT + " seconds");
	setTimeout( function() { eventEmitter.emit("endQuestion", currentQuestion.question )}, TRIVIA_TIMEOUT);
}

eventEmitter.addListener('endQuestion', function (question) {
	console.log("End question event thrown: " + question);

	// Ask a new question if
		// The current question is null => This is the first trivia request
		// OR this event was passed the current question => Timeout on question has elapsed
	if(currentQuestion == null || currentQuestion.question == question)
	{
		broadcast("*", currentQuestion.answer, "answer");

		console.log("Queuing up next question");
		process.nextTick(askQuestion);
	}
});

function disconnectUser(user)
{
	console("Disconnecting User: " + user);
}

//module.exports = app;

app.listen(8080);
