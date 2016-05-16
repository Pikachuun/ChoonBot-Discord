'use strict';

//Howdy! I'm ChoonBot the ChoonBot!
//*wink*

//Down here, I'm called...
const NAMAE = "ChoonBot";

//global function init
global.Discord = require('discord.js');
global.fs = require('fs');
global.request = require('superagent');
global.toId = function (str) {
	if (str && str.id) {
		str = str.id;
	} else if (str && str.userid) {
		str = str.userid;
	}
	if (typeof str !== 'string' && typeof str !== 'number') return '';
	return ('' + str).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
/*global.getUsers = function () {
	let usertxt = fs.readFileSync('./users.txt').toString();
	if (!usertxt.split('raisin is best waifu and if you disagree your bad!!!!!!11!!!\n\n')[1]) return false;
	usertxt = usertxt.split('raisin is best waifu and if you disagree your bad!!!!!!11!!!\n\n')[1];
	return usertxt;
};*/
global.uncacheTree = function (root) {
	let uncache = [require.resolve(root)];
	do {
		let newuncache = [];
		for (let i = 0; i < uncache.length; ++i) {
			if (require.cache[uncache[i]]) {
				newuncache.push.apply(newuncache,
					require.cache[uncache[i]].children.map(function (module) {
						return module.filename;
					})
				);
				delete require.cache[uncache[i]];
			}
		}
		uncache = newuncache;
	} while (uncache.length > 0);
};
global.choonbot = new Discord.Client();
global.commands = require('./recognition.js').commands;
global.emotes = require('./recognition.js').emotes;
try {
	global.configBuffer = require('./config.js');
} catch (e) {
	console.log('config.js doesn\'t exist; try copying config-base.js to config.js.');
	process.exit(-1);
}
for (let i in configBuffer) {
	global[i] = configBuffer[i];
}
delete global.configBuffer;
global.games = {};
global.rng = function (num) { //about time amirite
	return Math.floor(Math.random()*num);
};
global.wavesine = function (str) { //affectionately named
	let rts = "";
	let convert = "~}|{zʎxʍʌnʇsɹbdouɯๅʞſıɥɓɟəpɔqɐ,‾v]/[Z⅄XMΛ∩⊥SଧῸԀONWႨʞſIH⅁ℲƎႧƆઘ∀@¿>=<;:68L9૬hƐՇƖ0\\·-ʻ+ₓ)(ˌ⅋%$#ˌ¡ ";
	let code = 0;
	for (let i = str.length - 1; i > -1; i--) {
		code = str.charCodeAt(i);
		rts += (code < 127 && code > 31) ? convert[126 - code] : str[i];
	}
	return rts;
}
//check for users.txt
//let users = fs.readFileSync('./users.txt');
//ok
//users = getUsers();
//create http server for heroku, and prevent it from idling
let http = require('http');
http.createServer(function (req, res) { 
	res.writeHead(200, {'Content-Type': 'text/plain'}); 
	res.end('time over', 'utf-8'); 
}).listen(process.env.PORT || 5000);
setInterval(function () {
	http.get("http://choonbot-discord.herokuapp.com");
	http.get("http://reisenuinabot-psmaga.rhcloud.com"); //help a friend
	http.get("http://choonisanerd-psmaga.rhcloud.com"); //help my creator
}, 300000);

























//And thus we begin.
choonbot.on("ready", function () {
	console.log("Ready to go! ('.w.') C:" + choonbot.channels.length);
	choonbot.setUsername("ChoonBot");
	global.STARTTIME = Date.now();
});
choonbot.on("disconnected", function () {
	console.log("rip in kill [dc]");
	process.exit(1); //rip in kill
});
choonbot.on("message", function (message) {
	//Update users
	//users = getUsers();
	//No need to check ourselves. We already rekt ourselves.
	if (message.sender.id === selfID) return false;
	if (message.channel.id in antipost) return false;
	if (message.channel.server) {
		for (let j = 0; j < message.channel.server.rolesOfUser(message.sender).length; j++) {
			if (message.channel.server.rolesOfUser(message.sender)[j].name.toLowerCase() === "bots") return false; //not this again
		}
		if (message.channel.server.id in serverCrosstalk) {
			let crosstalk = false;
			for (let i = 0; i < serverCrosstalk[message.channel.server.id].length; i++) {
				if (message.channel.id === serverCrosstalk[message.channel.server.id][i]) crosstalk = true;
			}
			if (!crosstalk) return false;
		}
	}
	let msg = message.content;
	console.log("Message Intercept in #" + message.channel.name + " from @" + message.sender.username + ": " + msg);
	if (verbose) {
		console.log("[CID:" + message.channel.id + "/SID:" + message.sender.id + "]");
	}
	let msgbackup = msg;
	for (let i = 0; i < cmdS.length; i++) {
		if (msg.substr(0, cmdS[i].length) === cmdS[i]) {
			msg = msg.substr(cmdS[i].length, msg.length).split(" ")[0].toLowerCase(); //grab the command from *command args
			if (msg in commands) {
				let args = msgbackup;
				if (!args.substr(cmdS[i].length, args.length).split(" ")[1]) {
					args = [];
				} else {
					args = args.substr(cmdS[i].length, args.length).split(" ");
					if (args.length > 2) { //bug workaround
						let buffer = '';
						for (let i = 2; i < args.length; i++) {
							args[1] += " " + args[i];
						}
					}
					args = args[1].split(", ");
				}
				console.log("CMD:" + msg + "/ARG:" + args);
				if (!(message.channel.id in absoluteChannel)) {
					if (!commands[msg].isHmm && message.channel.id in onlyHmm || commands[msg].isHmm && !(message.channel.id in onlyHmm)) {
						if (message.channel.id !== "120242878738989056") return false;
					}
					if (commands[msg].isSpam && message.channel.id in noSpam) return false;
					if (commands[msg].alias && commands[commands[msg].alias]) return commands[commands[msg].alias].command(message, args);
				}
				return commands[msg].command(message, args);
			}
		}
	}
	if (message.channel.server && message.channel.server.id !== "110373943822540800" || !message.channel.server) {
		if (msg.toLowerCase() === "h") { //Press H to hug.
			return commands.hug.command(message, []);
		}
		if (msg.toLowerCase() === "c") { //Press C to cri.
			return commands.cri.command(message, []);
		}
		if (msg.toLowerCase() === "p") { //Press P to pet.
			return commands.pet.command(message, []);
		}
		if (msg.toLowerCase() === "f") { //Press F to pay respects
			return commands.respects.command(message, []);
		}
		if (msg.toLowerCase() === "k") { //Press K to kiss... maybe
			return commands.kiss.command(message, []);
		}
		if (message.sender.id === "90956503476883456") { //wavesine shenanigans
			if (msg === "ɥ") return commands.hug.command(message, [], true);
			if (msg === "ɔ") return commands.cri.command(message, [], true);
			if (msg === "d") return commands.pet.command(message, [], true);
			if (msg === "ɟ") return commands.respects.command(message, [], true);
		}
	}
	/*if (message.everyoneMentioned) {
		choonbot.reply(message, "YOU ARE LITERALLY THE WORST KIND OF PERSON FOR USING THE EVERYONE TAG");
	} else {*/
		for (let i in message.mentions) {
			if (message.mentions[i].id === selfID) choonbot.reply(message, "you called?");
		}
  //}
	msg = msgbackup;
	//if (msg.indexOf("*say") > -1 && msg.indexOf("*say2" < 0)) return choonbot.reply(message, "Here's a *say for you: ( ° ͜ʖ͡°)╭∩╮");
	//emote block
	let emoteCall = {};
	let emoteFin = {};
	let rngsum = 0;
	let rngval = 0;
	if (emtS[0] !== emtS[1] && msg.split(emtS[0])[1]) {
		console.log("Emote Checksum 1 Passed.");
		msg = msg.split(emtS[0])[1];
		if (msg.split(emtS[1])[1] || msg[msg.length - 1] === emtS[1]) {
			console.log("Emote Checksum 2 Passed.");
			msg = msg.split(emtS[0])[0];
			if (toId(msg) in emotes) {
				emoteCall = emotes[toId(msg)];
				if (emoteCall.rng) {
					rngval = Math.floor(Math.random()*emoteCall.rng.reduce(function (a, b) {return a + b;}));
					for (let r = 0; r < emoteCall.rng.length; r++) {
						rngsum += emoteCall.rng[r];
						if (rngval < rngsum) {
							emoteFin = {emote:emoteCall.emote[r], name:emoteCall.name[r]};
							r = emoteCall.rng.length;
						}
					}
				} else {
					emoteFin = emotes[toId(msg)];
				}
				console.log("Emote Detected (" + toId(msg) + ")! Sending " + emoteFin.emote + ".");
				return choonbot.sendFile(message.channel, emoteFin.emote, emoteFin.name);
			}
		} else {
			let err = 1*!(msg.split(emtS[1])[1]) + 2*(msg[msg.length - 1] !== emtS[1]);
			console.log("Emote Checksum 2 Failed. Cause of death: " + String(err&1) + String((err&2)/2));
		}
		msg = msgbackup;
	} else if (emtS[0] === emtS[1] && (msg.split(emtS[0])[2] || msg.split(emtS[0])[1] && msg[msg.length - 1] === emtS[0])) {
		console.log("Emote Checksum Q Passed.");
		msg = msg.split(emtS[0])[1];
		if (toId(msg) in emotes) {
			emoteCall = emotes[toId(msg)];
			if (emoteCall.rng) {
				rngval = Math.floor(Math.random()*emoteCall.rng.reduce(function (a, b) {return a + b;}));
				for (let r = 0; r < emoteCall.rng.length; r++) {
					rngsum += emoteCall.rng[r];
					if (rngval < rngsum) {
						emoteFin = {emote:emoteCall.emote[r], name:emoteCall.name[r]};
						r = emoteCall.rng.length;
					}
				}
			} else {
				emoteFin = emotes[toId(msg)];
			}
			console.log("Emote Detected (" + toId(msg) + ")! Sending " + emoteFin.emote + ".");
			return choonbot.sendFile(message.channel, emoteFin.emote, emoteFin.name);
		}
	}
	if ((msg.split("🍡").length > 1 || msg[msg.length - 1] === "🍡") && !(message.channel.id in noSpam)) {
		console.log("DANGO PARTY");
		return choonbot.sendMessage(message.channel, "🍡🍡DANGO PARTY🍡🍡");
	}
	if ((msg.split("(╯°□°）╯︵ ┻━┻").length > 1 || msg.substr(msg.length - 12, msg.length) === "(╯°□°）╯︵ ┻━┻") && !(message.channel.id in noSpam)) {
		let tableflip = ["┬─┬﻿ ノ( ゜-゜ノ)", "(╯°□°)╯︵ ┻━┻ ︵ ╯(°□° ╯)", "┬─┬﻿ ︵ /(.□. \\\\）", "┬─┬ ノ( ^_^ノ)", "(╯°Д°）╯︵ /(.□ . \\\\)", "(/¯◡ ‿ ◡)/¯ ~ ┬─┬﻿", "ノ┬─┬ノ ︵ ( \\\\o°o)\\\\"]//, "ik that feel man, i hate it when reisen's in hentai too"]
		console.log("Tableflip");
		return choonbot.sendMessage(message.channel, tableflip[rng(tableflip.length)]);
	}
});

choonbot.loginWithToken(TOKEN);