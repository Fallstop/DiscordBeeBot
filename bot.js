var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var BeeScript = fs.readFileSync('BeeMovieScript.txt', 'utf8');
var ShrekScript = fs.readFileSync('ShrekMovieScript.txt', 'utf8');
const delay = require('delay');
logger.info('Loaded Bee movie script');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client();

logger.info('Discord Client Loaded');
bot.on('debug', (e) => {
	logger.info(e);
})
bot.on('error', (e) => {
	logger.info(e);
})

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id 		+ ')');
});
//FUNCTIONS

function SliceMessage(Text) {
	//Function to Take a Large String and split it into a array
	var SliceMessages = [];
	var SliceSection = "";
	var NumberOfSlices = 0;
	var i = 0;
	var x = 2000; //Charcter Limit 
	NumberOfSlices = Math.ceil(Text/x);
	while (i < NumberOfSlices - 1){
		SliceSection = Text.slice(i*x,x*(i+1));
		if (SliceSection.length <= 2000 ){
			logger.info(SliceSection.length);
			SliceMessages.push(SliceSection);
		}
		else {
			logger.info('Over Limmit');
			logger.info(SliceSection.length);
		}
		i += 1;
	}
	SliceSection = Text.slice(i*x,Text.length);
	SliceMessages.push(SliceSection);

	return(SliceMessages);
}
function SendMessages(Array,msg) {
	var i = 0;
    while(i < Array.length){
   		msg.channel.send("BEEEEEEE");
   		i+= 1;
   		delay(200);
    }
}

//MAIN CODE

bot.on('message', msg => {
    if (msg.content === 'bee') {
    	ScriptArray = SliceMessage(BeeScript);
    	SendMessages(ScriptArray,msg);
    }
    else if (msg.content === 'shrek'){
    	ScriptArray = SliceMessage(ShrekScript);
    	SendMessages(ScriptArray,msg);
    } 

});
bot.login(auth.token);