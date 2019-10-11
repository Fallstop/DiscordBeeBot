var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var BeeScript = fs.readFileSync('BeeMovieScript.txt', 'utf8');
var ShrekScript = fs.readFileSync('ShrekScript.txt', 'utf8');
const delay = require('delay');
logger.info('Loaded Bee movie script');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

//FUNCTIONS

function SliceMessage(Text) {
	//Function to Take a Large String and split it into a array
	var SliceMessages = [];
	var SliceSection = "";
	var NumberOfSlices = 0;
	var i = 0;
	var x = 2000; //Charcter Limit 
	NumberOfSlices = Math.ceil(Text/x;
	while (i < NumberOfSlices - 1){
		SliceSection = Text.slice(i*x,x*(i+1));
		SliceMessages.push(SliceSection);
		i += 1;
	}
	SliceSection = Text.slice(i*x,Text.length);
	SliceMessages.push(SliceSection);

	return(SliceMessages);
}
function SendMessages(Array) {
	var i = 0;
    while(i < Array.length){
   		bot.sendMessage({
        	to: channelID,
        	message: Array[i]
    	});
   		i+= 1;
   		delay(200);
    }
}

//MAIN CODE

bot.on('message', function (user, userID, channelID, message, evt) {
    if (message == 'bee') {
    	ScriptArray = SliceMessage(BeeScript);
    	SendMessages(ScriptArray);
    }
    else if (message == 'shrek'){
    	ScriptArray = SliceMessage(ShrekScript);
    	SendMessages(ScriptArray);
    } 

});