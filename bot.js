var Discord = require('discord.js');
var logger = require('winston');
var stringify = require('json-stringify-safe');
var discordAuth = require('./discordAuth.json');
var cloudflareAuth = require('./cloudflareAuth.json');


const cowsay = require('cowsay');
const fetch = require('node-fetch');
const fs = require('fs');
const he = require('he');
const chunk = require('chunk-text');

const delay = require('delay');
logger.info('Loaded Bee movie script');

var dns = require('dns');

// Define all scripts Available
var scriptsCommandToFileMap = {
	"bee": "BeeMovieScript.txt",
	"shrek": "ShrekMovieScript.txt",
	"cowsay shrek": "cowsayShrek.txt",
	"eggnog": "eggnog.txt",
	"d9835ed850ab4595a6ff55194d296761": "d9835ed850ab4595a6ff55194d296761.txt",
	"oh god": "oh-god-e.txt",
	"hello there": "starwarsHelloThere.txt",
	"Show Me The Star Wars": "AllHailStarWars.txt"
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
	// var SliceMessages = [];
	// var SliceSection = "";
	// var NumberOfSlices = 0;
	// var i = 0;
	// var x = 2000; //Character Limit 
	// NumberOfSlices = Math.ceil(Text.length / x);
	// console.log(NumberOfSlices);
	// while (i < NumberOfSlices - 1) {
	// 	SliceSection = Text.slice(i * x, x * (i + 1));

	// 	if (SliceSection.length <= 2000) {
	// 		console.log(SliceSection.length);
	// 		SliceMessages.push(SliceSection);
	// 	}
	// 	else {
	// 		console.log('Over Limit');
	// 		console.log(SliceSection.length);
	// 	}
	// 	i += 1;
	// }
	// SliceSection = Text.slice(i * x, Text.length);
	// SliceMessages.push(SliceSection);

	

	return chunk(Text, 2000);
}
function SendMessages(Array, msg) {
	var i = 0;
	while (i < Array.length) {
		console.log('Sending A Message');
		msg.channel.send(Array[i]);
		i += 1;
		delay(400);
	}
}

function HtmlToDiscord(input) {
	//Convert HTML tags to Discord Markdown
	input = input.replace(/<\/?b>/ig, '**')
	input = input.replace(/<\/?i>/ig, '*')
	input = input.replace(/<\/?br>/ig, '\n')
	input = input.replace(/<\/?em>/ig, '***')
	input = input.replace(/<\/?strike>/ig, '~~')
	input = input.replace(/<\/?del>/ig, '~~')
	input = input.replace(/<\/?s>/ig, '~~')
	input = input.replace(/<\/?p>/ig, '\n')
	//General Cleanup of HTML
	input = input.replace(/<\/?.+>/ig, '')
	input = he.decode(input);
	return input
}

//MAIN CODE

bot.on('message', msg => {
	if (msg.author.bot) return;

	msgCommand = msg.content.toLowerCase();

	if (msg.channel.name == 'the-sacered-texts') {

		

		for (command in scriptsCommandToFileMap) {
			console.log(command)
			if (msgCommand == command) {
				console.log("Tes")
				SendMessages(SliceMessage(fs.readFileSync(scriptsCommandToFileMap[command],'utf8')), msg);
				return
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
	if (msg.content.startsWith('cowsay ')) {
		SendMessages(SliceMessage("```" +cowsay.say({text:msg.content.substring(7)})+"```"), msg);
	}
	if (msg.channel.name.toLowerCase()=="admin" &&msg.content == 'SUS!') {
		console.log("Nuke mode activated")
		msg.channel.send("Nuke intensifies")

		let fetched;
		do {
			fetched = await msg.channel.fetchMessages({limit: 100});
			msg.channel.channel.bulkDelete(fetched);
		}
		while(fetched.size >= 2);
		msg.channel.send("Literally nothing to see here...")
	}
	if (msg.content.startsWith( 'day!')) {
		let date = msg.content.substring(4) ?? ""
		fetch(`https://hctools.jmw.nz/api/gettimetableday/${date}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data["isSchoolDay"]) {
                console.log(data["currentDay"]);
                msg.channel.send("Day " + data["currentDay"]);
            } else if (!data["isSchoolDay"]) {
                msg.channel.send("Not a school day");
            }
            else if ('internalError' in data) {
                console.log("Error in gettimetableday API | <@310135293254696970>");
				msg.channel.send("Error in gettimetableday API | <@310135293254696970>");
            }
            
        })
        .catch(error => {
            console.log("Error in gettimetableday API | <@310135293254696970>");
			msg.channel.send("Error in gettimetableday API | <@310135293254696970> ```"+error+"```");
        });

	}
	if (msg.content.startsWith( 'notice!')) {
		let date = msg.content.substring(7) ?? ""
		fetch(`https://hctools.jmw.nz/api/getdailynotice/${date}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data["isSchoolDay"]) {
                console.log(HtmlToDiscord(data["noticeText"]));
                SendMessages(SliceMessage(HtmlToDiscord(data["noticeText"])), msg);
            } else if (!data["isSchoolDay"]) {
                msg.channel.send("Not a school day");
            }
            else if ('internalError' in data) {
                console.log("Error in getdailynotice API | <@310135293254696970>");
				msg.channel.send("Error in getdailynotice API | <@310135293254696970>");
            }
            
        })
        .catch(error => {
            console.log("Error in getdailynotice API | <@310135293254696970>");
			msg.channel.send("Error in getdailynotice API | <@310135293254696970> ```"+error+"```");
        });

	}
});
bot.login(discordAuth.token);