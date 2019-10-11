var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var BeeScript = fs.readFileSync('BeeMovieScript.txt', 'utf8');
const delay = require('delay');
logger.info('Loaded Bee movie script');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
function SliceMessage(Message) {
	var SliceMessages = [];
	
}
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
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message == 'bee') {
        var Script = BeeScript;
        logger.info('Recived Command');
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var ScriptLength = Script.length;
        var ScriptSlice = Script.slice(0,2000);
        var ScriptNumSlice = 1;
        while (ScriptLength > 2000) {
            ScriptLength = ScriptLength - 2000;
            ScriptNumSlice += 1;    
        }
        logger.info('Found number of slices neeeded');
        logger.info(ScriptNumSlice);
        i = 0
        while (i < ScriptNumSlice - 1){
	    var ScriptSlice = Script.slice(i*2000,(i+1)*2000);
            logger.info("Sending ScriptSlice");
            bot.sendMessage({
                to: channelID,
                message: ScriptSlice
            });
            i += 1
            delay(100);
        }
        var ScriptSlice = Script.slice(i*2000,Script.length);
        bot.sendMessage({
            to: channelID,
            message: ScriptSlice
        });
        args = args.splice(1);
     }
});