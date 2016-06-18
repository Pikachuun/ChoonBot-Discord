'use strict';

//>Looking at other people's code
//Wait this is open-source on github I can't complain

//Required Modules
global.Discord = require('discord.js');
global.fs = require('fs');
global.path = require('path');
global.request = require('superagent');
//Required Files
try { //config
	global.CFG = require(path.join(__dirname, "config.js")).config;
} catch (e) {
	console.log("config.js doesn't exist; try copying config-base.js to config.js.");
	process.exit(-1);
}
try { //message parsing
	global.PARSER = require(path.join(__dirname, "fs/msg.js")).parser;
} catch (e) {
	console.log("msg.js doesn't exist; how am I supposed to respond to messages if I don't know how to react?");
	console.log(e.stack);
	process.exit(-1);
}
//Global Functions + Misc.
global.toId = function (str) {
	if (str && str.id) {
		str = str.id;
	} else if (str && str.userid) {
		str = str.userid;
	}
	if (typeof str !== 'string' && typeof str !== 'number') return '';
	return ('' + str).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
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
global.rng = function (num) { //about time amirite
	return Math.floor(Math.random()*num);
};
global.rne = function (arr) { //about time amirite
	if (typeof(arr) !== "object" || !Array.isArray(arr)) return false;
	return arr[rng(arr.length)];
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
global.games = {};

//create http server for various things
let http = require('http');
http.createServer(function (req, res) { 
	res.writeHead(200, {'Content-Type': 'text/plain'}); 
	res.end("What? Were you expecting hentai or something?", 'utf-8'); 
}).listen(process.env.PORT || 5000);
setInterval(function () {
	http.get("http://choonbot-discord.herokuapp.com"); //help myself
	http.get("http://reisenuinabot-psmaga.rhcloud.com"); //help a friend
	http.get("http://choonisanerd-psmaga.rhcloud.com"); //help my creator
}, 300000);


















//And thus we begin.
global.choonbot = new Discord.Client(); //We kinda need this right
choonbot.on("ready", function () {
	console.log("Ready! ('.w.') U:" + choonbot.users.length + "/S:" + choonbot.servers.length + "/C:" + choonbot.channels.length + "," + choonbot.privateChannels.length);
	choonbot.setUsername("ChoonBot");
	let dfilePath = "";
	let mfilePath = "";
	let qfilePath = "";
	for (let i in choonbot.servers) {
		if (choonbot.servers[i] && choonbot.servers[i].id) {
			mfilePath = path.join(__dirname, "fs/arch/" + choonbot.servers[i].id + "/mod.txt");
			qfilePath = path.join(__dirname, "fs/arch/" + choonbot.servers[i].id + "/quo.txt");
			try {
				fs.accessSync(mfilePath, fs.F_OK);
				fs.accessSync(qfilePath, fs.F_OK);
			} catch (e) {
				console.log("At least one of server " + choonbot.servers[i].id + "'s files doesn't exist. Creating files...");
				dfilePath = path.join(__dirname, "fs/arch/" + choonbot.servers[i].id + "/");
				try {
					fs.accessSync(dfilePath, fs.F_OK);
				} catch (r) {
					console.log("Server " + choonbot.servers[i].id + "'s folder doesn't exist. Creating folder...");
					try {
						fs.accessSync(path.join(__dirname, "fs/arch/"), fs.F_OK);
					} catch (o) {
						console.log("The archive folder in general doesn't exist. Creating folder...");
						fs.mkdir(path.join(__dirname, "fs/arch/"), function (err) {
							if (err) {
								console.log("fuck it.");
								console.log(err.stack);
								process.exit(-1);
							} else {
								fs.mkdir(dfilePath, function (err) {
									if (err) {
										console.log("??????????");
										console.log(err.stack);
										process.exit(-1);
									}
								});
								fs.writeFile(mfilePath, "", function (err) {
									if (err) {
										console.log("??????????");
										console.log(err.stack);
									}
								});
								fs.writeFile(qfilePath, "", function (err) {
									if (err) {
										console.log("??????????");
										console.log(err.stack);
									}
								});
							}
						});
					}
					fs.mkdir(dfilePath, function (err) {
						if (err) {
							console.log("??????????");
							console.log(err.stack);
							process.exit(-1);
						}
					});
					fs.writeFile(mfilePath, "", function (err) {
						if (err) {
							console.log("??????????");
							console.log(err.stack);
						}
					});
					fs.writeFile(qfilePath, "", function (err) {
						if (err) {
							console.log("??????????");
							console.log(err.stack);
						}
					});
				}
				fs.writeFile(mfilePath, "", function (err) {
					if (err) {
						console.log("??????????");
						console.log(err.stack);
					}
				});
				fs.writeFile(qfilePath, "", function (err) {
					if (err) {
						console.log("??????????");
						console.log(err.stack);
					}
				});
			}
		}
	}
});
choonbot.on("disconnected", function () {
	console.log("rip in kill [dc]");
});
choonbot.on("message", function (message) {
	/////////////////////
	//  Message  Init  //
	/////////////////////
	if (message.sender.id === choonbot.user.id || CFG.blacklist.users.indexOf(message.sender.id) > -1) return false;
	if (CFG.blacklist.channels.indexOf(message.channel.id) > -1) return false;
	if (message.channel.server && CFG.blacklist.servers.indexOf(message.channel.server.id) > -1 && CFG.graylist.indexOf(message.channel.id) === -1) return false;
	global.mChannel = message.channel;
	global.mContent = message.content;
	global.mMention = (message.mentionsEveryone) ? true: message.mentions;
	global.mSender = message.sender;
	global.mServer = (mChannel.server) ? mChannel.server : {id:false};
	console.log("Message Intercept in #" + mChannel.name + " from @" + mSender.username + ": " + mContent);
	if (CFG.verbose) {
		console.log("[CID:" + mChannel.id + "/UID:" + mSender.id + "]");
	}
	let msg = mContent.toLowerCase();
	
	/////////////////////
	// Command Parsing //
	/////////////////////
	let i = 0;
	let cmd = ["", true];
	//Default
	for (i = 0; i < CFG.cmdsymb.length; i++) {
		if (mContent.substr(0, CFG.cmdsymb[i].length) === CFG.cmdsymb[i]) {
			cmd[0] = msg.substr(CFG.cmdsymb[i].length).split(" ")[0];
		}
	}
	//No Symbol
	if (PARSER.CMDLESS && mContent in PARSER.CMDLESS && CFG.forcecmd.indexOf(mChannel.id) === -1 && !(CFG.forcecmd.indexOf(mServer.id) > -1 && CFG.graylist.indexOf(mChannel.id) === -1)) {
		cmd = [PARSER.CMDLESS[mContent], false];
	}
	//Special Cases
	if (!cmd[0]) {
		if (mContent.indexOf("🍡") > -1) {
			cmd = ["dango", false];
		}
	}
	if (cmd[0] in PARSER) {
		let exec = PARSER[cmd[0]];
		if (exec.alias && exec.alias in PARSER) exec = PARSER[exec.alias];
		console.log("Command Detected (" + cmd[0] + ")!");
		if (exec.command && !(cmd[1] && exec.noCall) && !(exec.isSpam && (CFG.spamlist.indexOf(mChannel.id) > -1 || CFG.spamlist.indexOf(mServer.id) > -1 && CFG.graylist.indexOf(mChannel.id) === -1)) && !(exec.wlonly && CFG.whitelist.users.indexOf(mSender.id) === -1)) {
			let args = mContent.substr(cmd[0].length + 2).split(", ");
			message.command = cmd[0]; //pass the command over
			return exec.command(args, message);
		}
	}
	
	/////////////////////
	//  Emote Parsing  //
	/////////////////////
	if (!PARSER.EMOTES || CFG.noemotes.indexOf(mChannel.id) > -1 || CFG.noemotes.indexOf(mServer.id) > -1 && CFG.graylist.indexOf(mChannel.id) === -1) return false; //>emotes are banned
	let emote = {};
	let erng = [0, 0, 0];
	for (i in PARSER.EMOTES) {
		if (msg.indexOf(CFG.emtsymb[0] + i + CFG.emtsymb[1]) > -1) {
			emote = PARSER.EMOTES[i];
			if (!emote.rng) emote.rng = [1];
			erng[1] = rng(emote.rng.reduce(function (a, b) {return a + b;}));
			while (erng[2] < emote.rng.length) {
				erng[0] += emote.rng[erng[2]];
				if (erng[0] < erng[1]) {
					let ePath = path.join(__dirname, "fs/emotes/" + emote.emotes[erng[2]]);
					console.log("Emote Detected (" + emote.names[erng[2]] + ")! Sending " + ePath + ".");
					return choonbot.sendFile(mChannel, ePath, emote.names[erng[2]]);
				}
				erng[2]++;
			}
		}
	}
});
choonbot.on("messageDeleted", function (message, channel) {
	if (!message || !message.content) return false;
	let str = "";
	if (message.sender.id === "91184988610895872") str += "Bob. I saw that. You said \"" + message.content + "\" right?";
	if (str) return choonbot.sendMessage(channel, str);
});

choonbot.loginWithToken(CFG.token);