/////////////////////////////////////////////////////
///////////
//////////		Hack4You API Daemon	
///////////
///////////////////
////////////////////////////////////////////////////////////
var express			=	require("express");
var bodyParser		=	require("body-parser");
var fs				=	require('fs');
var mysql			=	require('mysql');
var readline        =   require('readline');
var config			=	require('./config.js');
var lang        	=	require('./lang.js');
var lang = new lang();

// Simplify returnMessage function
var rlang = lang.returnMessage;

// Start console
var rl = readline.createInterface(process.stdin, process.stdout);

// Create mysql connection based on config.js
var my = mysql.createConnection(config.mysql);

// Start express with body parser to parse json
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Start routes of the api sending via parameter express, mysql connection, config and lang function
fs.readdirSync('./routes/').forEach(file => {
  require("./routes/" + file)(app, my);
});

// Start listening
var server = app.listen(config.port, function () {
    console.log(config.title+" daemon is listening on port %s...", server.address().port);
    //rl.prompt();
});

global.loggedUsers = new Map();
var UserManager = require('./libs/user_manager.js');
global.userManager = new UserManager();



//Actions Check
fs.readdirSync('./tasks/').forEach(file => {
  var task = require("./tasks/" + file);
  task.startTask();
});


//Console Commands
rl.setPrompt('master > ');
rl.on('line', function(line) {
	console.log(global.userManager.checkUserLogin(line));
    rl.prompt();
});


// Server machine bots
