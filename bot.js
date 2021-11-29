var Discord = require('discord.js');
var logger = require('winston');
require('dotenv').config()

var discordAuth = JSON.parse(process.env.DISCORD_AUTH)


const cowsay = require('cowsay');
const fetch = require('node-fetch');
const fs = require('fs');
const he = require('he');
const chunk = require('chunk-text');

const delay = require('delay');
logger.info('Loaded Bee movie script');


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


//FUNCTIONS

function SliceMessage(Text) {
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

bot.on('message', async msg => {
	if (msg.author.bot) return;

	msgCommand = msg.content.toLowerCase();

	if (msg.channel.name == 'the-sacred-texts') {



		for (command in scriptsCommandToFileMap) {
			console.log(command)
			if (msgCommand == command) {
				console.log("Tes")
				SendMessages(SliceMessage(fs.readFileSync(scriptsCommandToFileMap[command], 'utf8')), msg);
				return
			}
		}
	}
	else if (msg.channel.name == 'eggnog' && msg.author.id != '163483537935171585') {
		if (msg.content.toLowerCase().includes("eggnog")) {
			ScriptArray = SliceMessage(fs.readFileSync(scriptsCommandToFileMap["eggnog"], 'utf8'));
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
		SendMessages(SliceMessage("```" + cowsay.say({ text: msg.content.substring(7) }) + "```"), msg);
	}
	if (msg.channel.name.toLowerCase().includes("admin") && msg.content.toLowerCase() == 'sus!') {
		console.log("Nuke mode activated")
		msg.channel.send("Nuke intensifies")

		let fetched;

		do {
			fetched = await msg.channel.fetchMessages({ limit: 100 });
			await msg.channel.bulkDelete(fetched).catch(()=>{
				fetched.forEach((message) => {
					try {
						message.delete();
					} catch {
						
					}
				});
			});
			console.log("Delete go brrrr", fetched.size)
		}
		while (fetched.size >= 2);
		msg.channel.send("Literally nothing to see here...")
	}
	if (msg.content.startsWith('day!')) {
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
				msg.channel.send("Error in gettimetableday API | <@310135293254696970> ```" + error + "```");
			});

	}
	if (msg.content.startsWith('notice!')) {
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
				msg.channel.send("Error in getdailynotice API | <@310135293254696970> ```" + error + "```");
			});

	}
});
bot.login(discordAuth.token);