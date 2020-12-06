var Discord = require('discord.js');
var logger = require('winston');
var stringify = require('json-stringify-safe');
var discordAuth = require('./discordAuth.json');
var cloudflareAuth = require('./cloudflareAuth.json');

var fs = require('fs');
// var cowsayShrekScript = fs.readFileSync('cowsayShrek.txt', 'utf8');
// var NavyPasta = fs.readFileSync('NavySeilCopyPasta.txt', 'utf8');
// var eggnogSpam = fs.readFileSync('eggnog.txt', 'utf8');
// var d9835ed850ab4595a6ff55194d296761 = fs.readFileSync('d9835ed850ab4595a6ff55194d296761.txt', 'utf8');
const delay = require('delay');
logger.info('Loaded Bee movie script');

var dns = require('dns');

// Define all scripts Available
var scriptsCommandToFileMap = {
	"bee": "BeeMovieScript.txt",
	"shrek": "ShrekMovieScript.txt",
	"cowsay shrek": "cowsayShrek.txt",
	"eggnog": "eggnog.txt",
	"d9835ed850ab4595a6ff55194d296761": "d9835ed850ab4595a6ff55194d296761.txt"
}

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
	logger.info(bot.username + ' - (' + bot.id + ')');
});

//Initialize Cloudflare

var ddns = require("cloudflare-dynamic-dns");


//FUNCTIONS

function autoCorrectDNS(msg) {
	const http = require('http');

	var ipAddressWebsite = {
		host: 'ipv4bot.whatismyipaddress.com',
		port: 80,
		path: '/'
	};

	http.get(ipAddressWebsite, function (res) {
		res.on("data", function (currentIP) {
			dns.lookup('mc.qrl.nz', function (err, DomainIP, family) {
				if (currentIP == DomainIP) {
					IPResultMessage = "IP is " + currentIP + ", which matches the domain mc.qrl.nz";
					msg.channel.send(IPResultMessage);
				} else { // IP is not correct
					IPResultMessage = "IP is " + currentIP + " but the domain mc.qrl.nz points to " + DomainIP + ". Attempting DNS auto-correction";
					msg.channel.send(IPResultMessage);
					ddns.update(cloudflareAuth, function (err) {
						if (err) {
							console.log("An error occurred:");
							msg.channel.send("DNS was not able to be auto-corrected | <@310135293254696970>");
							console.log(err);
							console.log(cloudflareAuth);
						} else {
							console.log("Success!");
							msg.channel.send("DNS has been auto-corrected, the update should take effect in ~5-30mins")
						}
					});
		
				}
			});

		});
	}).on('error', function (err) {
		console.log("An error occurred:");
		msg.channel.send("IP of server was not able to be found | <@310135293254696970>")
		console.log(err);
	});
}

function SliceMessage(Text) {
	//Function to Take a Large String and split it into a array
	var SliceMessages = [];
	var SliceSection = "";
	var NumberOfSlices = 0;
	var i = 0;
	var x = 2000; //Character Limit 
	NumberOfSlices = Math.ceil(Text.length / x);
	console.log(NumberOfSlices);
	while (i < NumberOfSlices - 1) {
		SliceSection = Text.slice(i * x, x * (i + 1));

		if (SliceSection.length <= 2000) {
			console.log(SliceSection.length);
			SliceMessages.push(SliceSection);
		}
		else {
			console.log('Over Limit');
			console.log(SliceSection.length);
		}
		i += 1;
	}
	SliceSection = Text.slice(i * x, Text.length);
	SliceMessages.push(SliceSection);

	return (SliceMessages);
}
function SendMessages(Array, msg) {
	var i = 0;
	while (i < Array.length) {
		console.log('Sending A Message');
		msg.channel.send(Array[i]);
		i += 1;
		delay(200);
	}
}

//MAIN CODE

bot.on('message', msg => {
	if (msg.author.bot) return;

	msgCommand = msg.content.toLowerCase();

	if (msg.channel.name == 'the-sacered-texts') {
		// if (msg.content.toLowerCase() == 'bee') {
		// 	ScriptArray = SliceMessage(BeeScript);
		// 	SendMessages(ScriptArray, msg);
		// }
		// else if (msg.content.toLowerCase() == "shrek") {
		// 	ScriptArray = SliceMessage(ShrekScript);
		// 	SendMessages(ScriptArray, msg);
		// } else if (msg.content.toLowerCase() == "cowsay shrek") {
		// 	ScriptArray = SliceMessage(cowsayShrekScript);
		// 	SendMessages(ScriptArray, msg);
		// }

		// else if (msg.content.toLowerCase() = "noob") {
		// 	ScriptArray = SliceMessage(NavyPasta);
		// 	SendMessages(ScriptArray, msg);
		// }

		

		for (command in scriptsCommandToFileMap) {
			console.log(command)
			if (msgCommand == command) {
				console.log("Tes")
				SendMessages(SliceMessage(fs.readFileSync(scriptsCommandToFileMap[command],'utf8')), msg);

			}
		}
	}
	else if (msg.channel.name == 'eggnog' && msg.author.id != '163483537935171585') {
		if (msg.content.toLowerCase().includes("eggnog!")) {
			ScriptArray = SliceMessage(eggnogSpam);
			SendMessages(ScriptArray, msg);
		}
	}
	else if (msg.content.toLowerCase().includes("d9835ed850ab4595a6ff55194d296761") && msg.author.id != '628791782007898142' && msg.author.id != '163483537935171585') {
		ScriptArray = SliceMessage(d9835ed850ab4595a6ff55194d296761);
		SendMessages(ScriptArray, msg);
	}
	if (msg.content.toLowerCase() == 'tcip!') {
		autoCorrectDNS(msg);
	}
});
bot.login(discordAuth.token);