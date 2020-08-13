var Discord = require('discord.js');
var logger = require('winston');
var stringify = require('json-stringify-safe');
var auth = require('./auth.json');
var fs = require('fs');
var BeeScript = fs.readFileSync('BeeMovieScript.txt', 'utf8');
var ShrekScript = fs.readFileSync('ShrekMovieScript.txt', 'utf8');
var cowsayShrekScript = fs.readFileSync('cowsayShrek.txt', 'utf8');
var NavyPasta = fs.readFileSync('NavySeilCopyPasta.txt', 'utf8');
var eggnogSpam = fs.readFileSync('eggnog.txt', 'utf8');
var d9835ed850ab4595a6ff55194d296761 = fs.readFileSync('d9835ed850ab4595a6ff55194d296761.txt','utf8');
const delay = require('delay');
logger.info('Loaded Bee movie script');

var dns = require('dns');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Initialize Discord Bot
const bot = new Discord.Client();

logger.info('Discord Client Loaded');
bot.on('error', (e) => {
	logger.info(e);
})
logger.info('Discord Client Loaded');
bot.on('debug', (e) => {
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
	NumberOfSlices = Math.ceil(Text.length/x);
	console.log(NumberOfSlices);
	while (i < NumberOfSlices - 1){
		SliceSection = Text.slice(i*x,x*(i+1));

		if (SliceSection.length <= 2000 ){
			console.log(SliceSection.length);
			SliceMessages.push(SliceSection);
		}
		else {
			console.log('Over Limmit');
			console.log(SliceSection.length);
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
    	console.log('Sending A Message');
   		msg.channel.send(Array[i]);
   		i+= 1;
   		delay(200);
    }
}

//MAIN CODE

bot.on('message', msg => {
	if (msg.channel.name == 'the-sacered-texts'  && msg.author.id != '163483537935171585' ) {
	    if (msg.content.toLowerCase() == 'bee') {
	    	ScriptArray = SliceMessage(BeeScript);
	    	SendMessages(ScriptArray,msg);
	    }
	    else if (msg.content.toLowerCase() == "shrek"){
	    	ScriptArray = SliceMessage(ShrekScript);
	    	SendMessages(ScriptArray,msg);
	    } else if (msg.content.toLowerCase() == "cowsay shrek"){
	    	ScriptArray = SliceMessage(cowsayShrekScript);
	    	SendMessages(ScriptArray,msg);
	    }
	    
	    else if (msg.content.toLowerCase().includes("noob")){
	    	ScriptArray = SliceMessage(NavyPasta);
	    	SendMessages(ScriptArray,msg);
	    } 
	    else if (msg.content.toLowerCase() == "yes"){
	    	console.log("Debug Statment - Summury");
        msg.channel.send("Debug Statment - Summary");
        console.log("Message Author:");
	    	console.log(msg.author.username);
        var DebugStatment = `Debug Satement Recived, Reponse(sudo no --mesg "${msg.content}" --author "${msg.author.username}")`
        msg.channel.send(DebugStatment);
	    }
      else if (msg.content.toLowerCase() == "yes -a"){
        var MsgJSON = stringify(msg);
        ScriptArray = SliceMessage(MsgJSON);
        msg.channel.send("Debug Statment - All Info");
        msg.channel.send("Full Message Details:");
        SendMessages(ScriptArray,msg);
      }
	    else if (msg.content.toLowerCase() == "print doc"){
	    	GetDocBody(msg,auth)
	    	
	    }
      
      

	    


	}
	else if (msg.channel.name == 'eggnog'  && msg.author.id != '163483537935171585' ){
		if (msg.content.toLowerCase().includes("eggnog!")){
	    	ScriptArray = SliceMessage(eggnogSpam);
	    	SendMessages(ScriptArray,msg);
	    } 
	}
  else if (msg.content.toLowerCase().includes("d9835ed850ab4595a6ff55194d296761") && msg.author.id != '628791782007898142'  && msg.author.id != '163483537935171585' ){
        ScriptArray = SliceMessage(d9835ed850ab4595a6ff55194d296761);
        SendMessages(ScriptArray,msg);
  }
  if (msg.content.toLowerCase() == 'tcip!') {
  	const http = require('http');

	var options = {
	  host: 'ipv4bot.whatismyipaddress.com',
	  port: 80,
	  path: '/'
	};

	http.get(options, function(res) {

	  res.on("data", function(chunk) {
	    var w3 = dns.lookup('mc.qrl.nz', function (err, addresses, family) {
		  console.log(addresses);
		  IPResultMessage = "Failure";
		  if (chunk == addresses) {
		  	IPResultMessage = "IP is " + chunk + ", which matches the domain mc.qrl.nz";
		  } else {
		  	IPResultMessage = "IP is " + chunk + " but the domain mc.qrl.nz points to " + addresses + "	| <@310135293254696970>";
		  }
		  msg.channel.send(IPResultMessage);
		});

	  });
	}).on('error', function(e) {
	  console.log("error: " + e.message);
	});
  }
});
bot.login(auth.token);