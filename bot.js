var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');
var BeeScript = fs.readFileSync('BeeMovieScript.txt', 'utf8');
var ShrekScript = fs.readFileSync('ShrekMovieScript.txt', 'utf8');
var NavyPasta = fs.readFileSync('NavySeilCopyPasta.txt', 'utf8');
const delay = require('delay');
logger.info('Loaded Bee movie script');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

//GOOGLE DOCS API

const readline = require('readline');
const {google} = require('googleapis');
const TOKEN_PATH = 'token.json';
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly'];
// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Docs API.
  authorize(JSON.parse(content), printDocTitle);
});

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}



/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
function printDocTitle(auth) {
  const docs = google.docs({version: 'v1', auth});
  docs.documents.get({
    documentId: '1Qy4UPJAaclkHIlRxJc_7nNxHRB3vb6p25KJGu0cTIOI',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    console.log("The body of the document is: %j", res.data.body.content[1].paragraph.elements[0].textRun.content);
  });
}
function GetDocBody(msg,auth) {
  const docs = google.docs({version: 'v1', auth});
  docs.documents.get({
    documentId: '1Qy4UPJAaclkHIlRxJc_7nNxHRB3vb6p25KJGu0cTIOI',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    ScriptArray = SliceMessage(NavyPasta);
	SendMessages(ScriptArray,msg);
    Body = res.data.body.content[1].paragraph.elements[0].textRun.content;
    console.log(Body);
    ScriptArray = SliceMessage(Body);
	SendMessages(ScriptArray,msg);
  });
}

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
	if (msg.channel.name == 'the-sacered-texts' && msg.author.username != 'CJ2005') {
	    if (msg.content == 'bee') {
	    	ScriptArray = SliceMessage(BeeScript);
	    	SendMessages(ScriptArray,msg);
	    }
	    else if (msg.content.includes('shrek')){
	    	ScriptArray = SliceMessage(ShrekScript);
	    	SendMessages(ScriptArray,msg);
	    }
	    else if (msg.content == "noob"){
	    	ScriptArray = SliceMessage(NavyPasta);
	    	SendMessages(ScriptArray,msg);
	    } 
	    else if (msg.content == "yes"){
	    	console.log("Message Author");
	    	console.log(msg.author.username);
	    	SendMessages(["no"],msg);
	    }
	    else if (msg.content == "print doc"){
	    	fs.readFile('credentials.json', (err, content) => {
  				if (err) return console.log('Error loading client secret file:', err);
  				// Authorize a client with credentials, then call the Google Docs API.
  				authorize(JSON.parse(content), GetDocBody(msg));
			});
	    	
	    } 

	    


	}
});
bot.login(auth.token);