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
global.getUsers = function () {
	let usertxt = fs.readFileSync('./users.txt').toString();
	if (!usertxt.split('raisin is best waifu and if you disagree your bad!!!!!!11!!!\n\n')[1]) return false;
	usertxt = usertxt.split('raisin is best waifu and if you disagree your bad!!!!!!11!!!\n\n')[1];
	console.log("Ping!");
	return usertxt;
};
global.uncacheTree = function (root) {
	var uncache = [require.resolve(root)];
	do {
		var newuncache = [];
		for (var i = 0; i < uncache.length; ++i) {
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
for (var i in configBuffer) {
	global[i] = configBuffer[i];
}
delete global.configBuffer;
global.games = {};
global.unripAlready = {};
global.spoon = false;
//check for users.txt
let users = fs.readFileSync('./users.txt');
//ok
users = getUsers();


































//And thus we begin.
choonbot.on("ready", function () {
	console.log("Ready to go! ('.w.') C:" + choonbot.channels.length);
	choonbot.setUsername("ChoonBot");
});
choonbot.on("disconnected", function () {
	console.log("rip in kill [dc]");
	process.exit(1); //rip in kill
});
choonbot.on("message", function (message) {
	//Update users
	users = getUsers();
	//No need to check ourselves. We already rekt ourselves.
	if (message.sender.id === selfID) return false;
	if (message.channel.id in antipost) return false;
	if (message.channel.server) {
		if (message.channel.server.id in serverCrosstalk) {
			let crosstalk = false;
			for (let i = 0; i < serverCrosstalk[message.channel.server.id].length; i++) {
				if (message.channel.id === serverCrosstalk[message.channel.server.id][i]) crosstalk = true;
			}
			if (!crosstalk) return false;
		}
	}
	let msg = message.content;
	if (!verbose) {
		console.log("Message Intercept in #" + message.channel.name + " from @" + message.sender.username + ": " + msg);
	} else {
		console.log("Message Intercept in " + message.channel + " from " + message.sender + ": " + msg);
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
	if (msg.toLowerCase() === "h") { //Press H to hug.
		return commands.hug.command(message, []);
	}
	if (message.everyoneMentioned) {
		choonbot.reply(message, "YOU ARE LITERALLY THE WORST KIND OF PERSON FOR USING THE EVERYONE TAG");
	} else {
		for (var i in message.mentions) {
			if (message.mentions[i].id === selfID) choonbot.reply(message, "you called?")
		}
	}
	msg = msgbackup;
	if (emtS[0] !== emtS[1] && msg.split(emtS[0])[1]) {
		console.log("Emote Checksum 1 Passed.");
		msg = msg.split(emtS[0])[1];
		if (msg.split(emtS[1])[1] || msg[msg.length - 1] === emtS[1]) {
			console.log("Emote Checksum 2 Passed.");
			msg = msg.split(emtS[0])[0];
			if (toId(msg) in emotes) {
				console.log("Emote Detected (" + toId(msg) + ")! Sending " + emotes[toId(msg)].emote + ".");
				if (emotes[toId(msg)].type === "text") return choonbot.sendMessage(message.channel, emotes[toId(msg)].emote);
				if (emotes[toId(msg)].type === "file") return choonbot.sendFile(message.channel, emotes[toId(msg)].emote, emotes[toId(msg)].name);
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
			console.log("Emote Detected (" + toId(msg) + ")! Sending " + emotes[toId(msg)].emote + ".");
			if (emotes[toId(msg)].type === "text") return choonbot.sendMessage(message.channel, emotes[toId(msg)].emote);
			if (emotes[toId(msg)].type === "file") return choonbot.sendFile(message.channel, emotes[toId(msg)].emote, emotes[toId(msg)].name);
		}
	}
	if ((msg.split("🍡").length > 1 || msg[msg.length - 1] === "🍡") && !(message.channel.id in noSpam)) {
		console.log("DANGO PARTY");
		return choonbot.sendMessage(message.channel, "🍡🍡DANGO PARTY🍡🍡");
	}
	if ((msg.split("(╯°□°）╯︵ ┻━┻").length > 1 || msg.substr(msg.length - 12, msg.length) === "(╯°□°）╯︵ ┻━┻") && !(message.channel.id in noSpam)) {
		let tableflip = ["┬─┬﻿ ノ( ゜-゜ノ)", "(╯°□°)╯︵ ┻━┻ ︵ ╯(°□° ╯)", "┬─┬﻿ ︵ /(.□. \\）", "┬─┬ ノ( ^_^ノ)", "(╯°Д°）╯︵ /(.□ . \\)", "(/¯◡ ‿ ◡)/¯ ~ ┬─┬﻿", "ノ┬─┬ノ ︵ ( \\o°o)\\"]//, "ik that feel man, i hate it when reisen's in hentai too"]
		console.log("Tableflip");
		return choonbot.sendMessage(message.channel, tableflip[Math.floor(Math.random()*tableflip.length)]);
	}
});

choonbot.login(EMAIL, PASSW);