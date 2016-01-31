'use strict';

exports.commands = {
	//dev commands
	hello: {
		command: function (message, args) {
			choonbot.sendMessage(message.channel, "Sup, this is a test command Choon made to see if commands even worked.");
		}
	},
	say: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			let buffer = args[0];
			if (!buffer) return false;
			for (var i = 0; i < args.length; i++) {
				if (i !== 0) buffer += ", " + args[i];
			}
			choonbot.sendMessage(message.channel, buffer);
		}
	},
	say2: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			if (!args[1]) return false;
			let channelID = args[0];
			let buffer = args[1];
			for (var i = 1; i < args.length; i++) {
				if (i !== 1) buffer += ", " + args[i];
			}
			choonbot.sendMessage(args[0], buffer);
		}
	},
	poof: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			choonbot.sendMessage(message.channel, "*poofs away*");
			setTimeout(function () {
				choonbot.logout();
				process.exit(0);
			}, 500);
		}
	},
	reload: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			try {
				uncacheTree('./recognition.js');
				uncacheTree('./config.js');
				global.commands = require('./recognition.js').commands;
				global.emotes = require('./recognition.js').emotes;
				global.configBuffer = require('./config.js');
				for (let i in configBuffer) {
					global[i] = configBuffer[i];
				}
				delete global.configBuffer;
				choonbot.sendMessage(message.channel, "Reloaded. Hopefully I'm smarterer now! ('.w.')");
			} catch (e) {
				choonbot.sendMessage(message.channel, "Error reloading. See console for more info.");
				console.log('Reload Failure: ' + e.stack);
			}
		}
	},
	dump: {
		command: function (message, args) {
			//return false; //disabled mostly
			let buffer = message.mentions;
			if (typeof buffer === "number" || typeof buffer === "string") {
				console.log(buffer);
			} else {
				for (let i in buffer) {
					console.log(i);
				}
			}
			choonbot.sendMessage(message.channel, "dumped info about message.mentions");
		}
	},
	acceptinvite: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			if (!args[0]) return false;
			choonbot.sendMessage(message.channel, "alright, I'm joining now!");
			choonbot.joinServer(args[0]);
		}
	},
	goaway: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			choonbot.sendMessage(message.channel, "ok ;_;");
			choonbot.leaveServer(message.channel.server);
		}
	},
	eval: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			let buffer = args[0];
			if (!buffer) return false;
			for (var i = 0; i < args.length; i++) {
				if (i !== 0) buffer += ", " + args[i];
			}
			buffer = buffer.replace(/`/g, "");
			try {
				choonbot.sendMessage(message.channel, eval(buffer));
			} catch (e) {
				choonbot.sendMessage(message.channel, "```Error Detected: " + e.stack + "```");
			}
		}
	},
	
	//info
	
	help: {
		command: function (message, args) {
			if (Math.floor(Math.random()*22) === 11) return choonbot.sendMessage(message.channel, "nobody can help you. you must face the gazebo alone.");
			if (args[0]) {
				let arg = toId(args[0]);
				if (arg === "emotes") {
					choonbot.sendMessage(message.channel, "Emotes list:\n`denko`: Sends a denko face.\n`kogamy`: Sends a spoopy kogasa picture. Alias: `boo`\n`reisenbox`: Sends a box of Reisen for all of your Choon satisfying needs.\nThese are surrounded by `:`. One emote per message please.");
				} else if (arg === "command") {
					choonbot.sendMessage(message.channel, "did you just");
				} else if (arg === "help") {
					choonbot.sendMessage(message.channel, "seriously?");
				} else if (arg === "hello") {
					choonbot.sendMessage(message.channel, "A test command that makes me say hello.");
				} else if (arg === "game") {
					choonbot.sendMessage(message.channel, "Starts a game where we do absolutely nothing because Choon hasn't made anything yet.\nArgs:\n`end`: Ends the game.");
				} else if (arg === "meme") {
					choonbot.sendMessage(message.channel, "Sends a dank meme.");
				} else if (arg === "pet") {
					choonbot.sendMessage(message.channel, "Lets you pet a user by mentioning them!");
				} else if (arg === "hug") {
					choonbot.sendMessage(message.channel, "Lets you hug a user by mentioning them!");
				} else if (arg === "notice") {
					let botname = (spoon) ? "SpoonBot" : "ChoonBot";
					choonbot.sendMessage(message.channel, botname + "-Senpai will notice whoever you mention!");
				}
			} else {
				choonbot.sendMessage(message.channel, "Sup! I'm a bot made by Choon. He made me for fun, if you're upset let him know and I'll leave.\nCommand List:\nDev:`hello`\nGames:`game`\nMisc:`meme`,`pet`,`hug`,`notice`\nMy command identifier is `*` or the vastly superior `('.w.') `. Put one of these before a command and at the beginning of your message. I separate arguments using `,` with a space at the end.\nFor help with specific commands use `*help command`. For a list of emotes use `*help emotes`.");
			}
		}
	},
	schedule: {
		command: function (message, args) {
			choonbot.sendMessage(message.channel, "My Schedule [EST/EDT]:\nMWF: Classes at 9:05~10:55am\nTR: Classes at 8:05~9:25am and 12:05~1:20pm\nALL: Sleeping at 9:00pm~5:30am\nOtherwise I'm free. Please allow a 1 hour adjustment during MTWRF for commuting between campus and home.");
		}
	},
	
	//gaming the system
	
	game: {
		isSpam: true,
		command: function (message, args) {
			if (args[0] && toId(args[0]) === "end") {
				if (!games[message.channel.id]) {
					choonbot.sendMessage(message.channel, "what game?");
				} else {
					choonbot.sendMessage(message.channel, "aw, party pooper.");
					delete games[message.channel.id];
				}
			} else {
				if (!games[message.channel.id]) {
					choonbot.sendMessage(message.channel, "let's play a game where nothing happens!");
					games[message.channel.id] = true;
				} else {
					choonbot.sendMessage(message.channel, "but this game is so much fun!");
				}
			}
		}
	},
	
	//misc

	setavatar: {
		command: function (message, args) {
			if (!args[0]) return false;
			if (isNaN(args[0]) || parseInt(args[0]) < 0 || parseInt(args[0]) != parseFloat(args[0])) return choonbot.sendMessage(message.channel, "I can only take positive integers.");
			let avatarID = parseInt(args[0]);
			//jpg files
			let jpg = [true, false];
			if (avatarID >= jpg.length) return choonbot.sendMessage(message.channel, "That avatar doesn't exist yet.");
			let avatarFile = (jpg[avatarID]) ? "./avatars/" + String(avatarID) + ".jpg" : "./avatars/" + String(avatarID) + ".png";
			choonbot.setAvatar(fs.readFileSync(avatarFile));
			choonbot.sendMessage(message.channel, "Avatar set!");
		}
	},
	dispavatar: {
		command: function (message, args) {
			if (!args[0]) return false;
			if (isNaN(args[0]) || parseInt(args[0]) < 0 || parseInt(args[0]) != parseFloat(args[0])) return choonbot.sendMessage(message.channel, "I can only take positive integers.");
			let avatarID = parseInt(args[0]);
			//jpg files
			let jpg = [true, false];
			if (avatarID >= jpg.length) return choonbot.sendMessage(message.channel, "That avatar doesn't exist yet.");
			let avatarAttach = (jpg[avatarID]) ? "./avatars/" + String(avatarID) + ".jpg" : "./avatars/" + String(avatarID) + ".png";
			let avatarName = (jpg[avatarID]) ? "avatar.jpg" : "avatar.png";
			choonbot.sendFile(message.channel, avatarAttach, avatarName);
		}
	},
	
	//the dankest of memes.
	
	meatloaf: {
		command: function (message, args) {
			if (!(message.channel.id === "139023144387084288" || message.channel.id in absoluteChannel)) return false;
			let ride = 0;
			let meatloaf = "";
			let arr = [["M", "E", "A", "T", "L", "O", "A", "F"], ["m", "e", "a", "t", "l", "o", "a", "f"]];
			for (let i = 0; i < 8; i++) {
				ride = Math.floor(Math.random()*2);
				meatloaf += arr[ride][i];
			}
			choonbot.sendMessage(message.channel, meatloaf);
		}
	},
	unrip: {
		command: function (message, args) {
			if (unripAlready[message.channel.id]) return false;
			let meme = ["it was just a prank bro", "I wasn't dead I was just sleeping", "*awake*"]
			choonbot.sendMessage(message.channel, meme[Math.floor(Math.random()*meme.length)]);
			global.unripAlready[message.channel.id] = true;
		}
	},
	pet: {
		command: function (message, args) {
			let buffer = [];
			let kek = true;
			let lel = 0;
			while (kek) {
				if (message.mentions[lel]) {
					if (message.mentions[lel].id === selfID) {
						kek = false;
						buffer = [];
					} else {
						buffer[buffer.length] = message.mentions[lel].mention();
					}
					lel++;
				} else {
					kek = false;
				}
			}
			if (buffer.length === 0) {
				let pet = ["*is pet*", "*appreciates the petting*", "*loves the petting*", "*reluctantly is pet*", "*cute choonbot noises*", "*demands you pet him more*", "*sensually moans*", "*awkwardly blushes*", "*floofs*", "*sputters*"];
				return choonbot.sendMessage(message.channel, pet[Math.floor(Math.random()*pet.length)]);
			}
			if (buffer.length === 1) {
				choonbot.sendMessage(message.channel, "*pets " + buffer[0] + "*");
			} else if (buffer.length === 2) {
				choonbot.sendMessage(message.channel, "*pets " + buffer[0] + " and " + buffer[1] + "*");
			} else {
				let output = "*pets ";
				for (let j = 0; j < buffer.length; j++) {
					if (j !== 0) output += ", ";
					if (j === buffer.length - 1) output += "and ";
					output += buffer[j];
				}
				choonbot.sendMessage(message.channel, output + "*");
			}
		}
	},
	hug: {
		command: function (message, args) {
			let buffer = [];
			let kek = true;
			let lel = 0;
			let sender = message.sender.mention();
			while (kek) {
				if (message.mentions[lel]) {
					if (message.mentions[lel].id === selfID) {
						kek = false;
						buffer = [];
					} else if (message.mentions[lel].mention() === sender) {
						kek = false;
						buffer = ["self"];
					} else {
						buffer[buffer.length] = message.mentions[lel].mention();
					}
					lel++;
				} else {
					kek = false;
				}
			}
			if (buffer.length === 0) {
				let hug = ["*is hugged*", "*hugs back*", "*loves " + sender + "'s hug*", "*hugs " + sender + " back and breaks away*\nIt's not that I wanted you to hug me or anything, you baka...", "*cute choonbot noises*", "*gives " + sender + " a tight hug*", "*hugs " + sender + " back and kisses them on the cheek*", "*awkwardly blushes and hugs " + sender + " back*", "*floofs*", "*snuggles with " + sender + "*"];
				return choonbot.sendMessage(message.channel, hug[Math.floor(Math.random()*hug.length)]);
			}
			if (buffer.length === 1) {
				if (buffer[0] === "self") {
					choonbot.sendMessage(message.channel, sender + " hugs themself.");
				} else {
					choonbot.sendMessage(message.channel, sender + " has hugged " + buffer[0] + "!");
				}
			} else if (buffer.length === 2) {
				choonbot.sendMessage(message.channel, sender + " has hugged " + buffer[0] + " and " + buffer[1] + "!");
			} else {
				let output = sender + " has hugged ";
				for (let j = 0; j < buffer.length; j++) {
					if (j !== 0) output += ", ";
					if (j === buffer.length - 1) output += "and ";
					output += buffer[j];
				}
				choonbot.sendMessage(message.channel, output + "!");
			}
		}
	},
	unspoon: {
		command: function (message, args) {
			if (spoon) {
				choonbot.setUsername("ChoonBot");
				setTimeout(function () {
					choonbot.sendMessage(message.channel, "thank goodness");
				}, 666);
				global.spoon = false;
			} else {
				choonbot.sendMessage(message.channel, "not a spoon right now");
			}
		}
	},
	spoon: {
		command: function (message, args) {
			if (spoon) {
				choonbot.sendMessage(message.channel, "i am already a spoon");
			} else {
				choonbot.setUsername("SpoonBot");
				setTimeout(function () {
					choonbot.sendMessage(message.channel, "what have you done");
				}, 666);
				global.spoon = true;
			}
		}
	},
	fork: {
		command: function (message, args) {
			choonbot.sendMessage(message.channel, "ew forks");
		}
	},
	notice: {
		command: function (message, args) {
			if (message.everyoneMentioned) return choonbot.reply(message, "NICE TRY, NERD");
			let buffer = [];
			let output = "ChoonBot-senpai notices you, ";
			let kek = true;
			let lel = 0;
			while (kek) {
				if (message.mentions[lel]) {
					if (message.mentions[lel].id === selfID) return choonbot.sendMessage(message.channel, "You're joking right?");
					if (message.mentions[lel].id !== message.sender.id || message.mentions[lel].id in whitelist) {
						buffer[buffer.length] = message.mentions[lel].mention();
					}
					lel++;
				} else {
					kek = false;
				}
			}
			if (buffer.length === 0) return choonbot.sendMessage(message.channel, "Who am I supposed to be noticing, exactly?");
			if (buffer.length === 1) {
				output += buffer[0];
			} else if (buffer.length === 2) {
				output += buffer[0] + " and " + buffer[1];
			} else {
				for (let j = 0; j < buffer.length; j++) {
					if (j !== 0) output += ", ";
					if (j === buffer.length - 1) output += "and ";
					output += buffer[j];
				}
			}
			choonbot.sendMessage(message.channel, output + "!");
		}
	},
	hmm: {
		isHmm: true,
		command: function (message, args) {
			let hmm = ["hmm", "hmm...", "hm?", "mmh", "hmmmmmmmmmmmm", "hmm hmm!", "hmmmh"];
			choonbot.sendMessage(message.channel, hmm[Math.floor(Math.random()*hmm.length)]);
		}
	},
	meme: { //PogChamp
		isSpam: true,
		command: function (message, args) {
			if (args[0]) {
				let arg = toId(args[0]);
				if (arg === "dank") { //dank placeholder
					return choonbot.sendMessage(message.channel, "dank meme");
				} else if (arg === "monocle") {
					return choonbot.sendMessage(message.channel, "(╭ರ_⊙)");
				} else if (arg === "lenny") {
					let lenny = ["( ͡° ͜ʖ ͡°)", "( ͠° ͟ʖ ͡°)", "ᕦ( ͡° ͜ʖ ͡°)ᕤ", "( ͡~ ͜ʖ ͡°)", "( ͡o ͜ʖ ͡o)", "͡° ͜ʖ ͡ -", "( ͡͡ ° ͜ ʖ ͡ °)", "( ͡ ͡° ͡°  ʖ ͡° ͡°)", "(ง ͠° ͟ل͜ ͡°)ง", "( ͡° ͜ʖ ͡ °)", "(ʖ ͜° ͜ʖ)", "[ ͡° ͜ʖ ͡°]", "( ͡o ͜ʖ ͡o)", "{ ͡• ͜ʖ ͡•}", "( ͡° ͜V ͡°)", "( ͡^ ͜ʖ ͡^)", "( ‾ʖ̫‾)", "( ͡°╭͜ʖ╮͡° )", "ᕦ( ͡°╭͜ʖ╮͡° )ᕤ", "─=≡Σᕕ( ͡° ͜ʖ ͡°)ᕗ"];
					return choonbot.sendMessage(message.channel, lenny[Math.floor(Math.random()*lenny.length)]);
				} else if (arg === "xd") {
					let xd = ["xd", "Xd", "xD", "XD"];
					return choonbot.sendMessage(message.channel, xd[Math.floor(Math.random()*xd.length)]);
				} else if (arg === ":^)") {
					return choonbot.sendMessage(message.channel, ':^)');
				}
			}
			//In this case, make your own donger!
			//Donger Part list courtesy of dongerlist.com.
			//ლʕ ” ‾́ _ʖ ‾́ ” ʔ╭∩╮
			//ᕙ༼~‾́ل͜‾́~༽ᕗ
			let arm = ["╰", "╯", "ヽ", "ﾉ", "ノ", "∩", "੧", "੭", "⋋", "⋌", "ლ", "╭∩╮", "⊃", "つ", "ᕙ", "ᕗ", "ᕕ", "୧", "୨", "┌", "┐", "└", "┘", "٩", "و", "ʋ", "ง", "凸", "ᕦ", "ᕤ", "へ", "ᓄ", "¯\\_", "_/¯", "╚═", "═╝", "〜", "┌∩┐", "c", "╮", "乁", "ㄏ", "ᕤ", "ԅ", "o͡͡͡╮", "╭o͡͡͡", "ノ⌒.", "//╲/\\╭", "╮/\\╱﻿\\"];
			let bod = ["(", ")", "[", "]", "༼", "༽", "ʕ", "ʔ", "໒(", ")७", "|", "⁞", "།", "།", "〳", "〵", "╏", "║", "▐", "░", "▒"];
			let che = [".", "✿", "˵", ",", "*", "”", "=", "~", "∗", ":"];
			let eye = ["•́", "•̀", "￣", "ݓ", "✖", "･", "՞", "﹒", "﹒︣", "︣", "⌣", "́", "⁰", "❛", "¯͒", "¯", "͒", "´", "\`", "ཀ", "༎ຶ", "ຈ", "O", "͡", "◕", "-", "͠°", "°͠", "⇀", "↼", "ಥ", "☯", "͝°", "°", "ಠ", "ಠ", "ಠೃ", "ರ", "ರೃ", "ರ", "◕", "˙", "◔", "͡°", "□", "⌐", "▀", "・", "◉", "‾́", "-", "⊙", "◐", "◖", "◗", "◑", "ヘ", "¬", "≖", "̿̿", "̿", "･ิ", "ิ", "◔", "ʘ̆", "ʘ", "☉", ";", "͡■", "■͡", "͡°", "°͡", "͡ຈ", "ຈ͡", "ຈ", "͡◕", "◕͡", "◕", "°", "◉", "͡", "º", "͡;", "͡☉", "°", "͜ಠ", "͡ʘ", "͡’", "•", "^", "◕", "▀̿", "ʘ͡", "–", "❛", "x", "ᴼ", "＾", "˘", "۞", "◯", "๑", "͡ᵔ", "͡°", "°", "͒", "σ", "✪", "♥", "❛ั", "•̀", "•́", "☉", "͠ຈ", "╥", "ᵒ̌", "ಡ", "͡°̲", "ᵕ", "ି", "ୖ", "ଵ", "்", "౦", "್", "ಠ", "ര", "ි", "ᓀ", "ᓂ", "⊡", "⊙", "⊚", "⊘", "⊗", "☯", "¤"];
			let mou = ["_", "ਊ", "︿", "o", "〜", "〰", "∧", "Д", "۝", "ڡ", "ʖ", "͜ʖ", "ل͜", "-", "‸", "⌂", "ل͟", "﹏", "益", "‿", "o", "ʖ̯", "Ĺ̯", "͜ʟ", "д", "ᗜ", "ᴥ", "ل", "ω", "◞౪◟", "౪", "‸", "෴", "﹏ु", "_ʖ", "-", "͜ر", "ں", "┏ل͜┓", "ヮ", "͜ ʖ", "Ĺ̯", "▽", "▃", "౪", "ₒ", "_̀", "ε", "~͜ʖ~", "□", "◡", "3", "_ʖ", "͟ʖ", "ڡ", "◯", "ʖ̫", "╭ ͟ʖ╮", "╭͜ʖ╮", "͟ل͜", "۝", "~", "͜ʖ", "(oo)", "▾"];
			let acc = ["┬┴┬┴┤", "├┬┴┬┴", "⊹", "︻̷┻̿═━一", "━☆ﾟ.*･｡ﾟ", "︵┻━┻", "Zzzzzzz", "†", "⌐■-■", "✡", "/̵͇̿̿/’̿’̿ ̿", "︵ ส็็็็็็็ส", "┬───┬", "҉̛༽̨҉҉ﾉ̨", "༼ ༽", "┬──┬╯﻿", "̿ ̿ ̿ ̿’̿’̵з", "♫", "♪", "✿", "( . ( . )", "━ 卐", "卐", "ð", "✂", "╰⋃╯", "̿̿ ̿̿ ̿’̿’̵͇̿̿з=", "-]—-", "︵ ǝʞoɾ ǝɯɐs", "┣▇▇▇═──", "━╤デ╦︻", "├┬", "¤=[]:::::&gt;", "⌒.[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]"];
		
			//Actual function goes here
			//Initialize positions
			let armPos = (~~(Math.random()*4)) ? ~~(Math.random()*arm.length) : -1;
			let bodPos = ~~(Math.random()*bod.length);
			let chePos = (!(~~(Math.random()*4))) ? ~~(Math.random()*che.length) : -1;
			let eyePos = ~~(Math.random()*eye.length);
			let mouPos = ~~(Math.random()*mou.length);
			let accPos = ~~(Math.random()*acc.length);
		
			//Heuristics
			let armL = {0:[1],2:[3,4],6:[7],8:[9],14:[15],16:[15],17:[18],19:[20,22],21:[20,22],23:[24],28:[29,42],30:[31],32:[33],34:[35],40:[41],44:[45],47:[48]};
			let armR = {1:[0],3:[2],4:[2],7:[6],9:[8],15:[14,16],18:[17],20:[19,21],22:[19,21],24:[23],29:[28],31:[30],33:[32],35:[34],41:[40],42:[28],45:[44],48:[47]};
			if (armPos in armL) {
				armPos = [armPos, armL[armPos][~~(Math.random()*armL[armPos].length)]];
			} else if (armPos in armR) {
				armPos = [armR[armPos][~~(Math.random()*armR[armPos].length)], armPos];	
			} else {
				armPos = [armPos, armPos];
			}
		
			if (!(bodPos%2) && bodPos < 10 || bodPos === 14) {
				bodPos = [bodPos, bodPos + 1];
			} else if ((bodPos%2) && bodPos < 10 || bodPos === 15) {
				bodPos = [bodPos - 1, bodPos];	
			} else {
				bodPos = [bodPos, bodPos];
			}
		
			//We shall now construct the random donger.
			let DONGER = "";
			DONGER += (armPos[0] > -1) ? arm[armPos[0]] : '';
			DONGER += bod[bodPos[0]];
			DONGER += (chePos > -1) ? che[chePos] : '';
			DONGER += eye[eyePos] + mou[mouPos] + eye[eyePos];
			DONGER += (chePos > -1) ? che[chePos] : '';
			DONGER += bod[bodPos[1]];
			DONGER += (armPos[1] > -1) ? arm[armPos[1]] : '';
			DONGER += (!(~~(Math.random()*25))) ? acc[accPos] : '';
		
			//Beautiful.
			choonbot.sendMessage(message.channel, DONGER);
		}
	}
};
exports.emotes = {
	boo: {
		type: "file",
		emote: "./images/kogamy.png",
		name: "boo.png"
	},
	denko: {
		type: "text",
		emote: "('.w.')"
	},
	hinaface: {
		type: "file",
		emote: "./images/hinaface.png",
		name: "hinaface.png"
	},
	kogamy: {
		type: "file",
		emote: "./images/kogamy.png",
		name: "kogamy.png"
	},
	lewd: {
		type: "file",
		emote: "./images/lewd.gif",
		name: "lewd.gif"
	},
	mg: {
		type: "file",
		emote: "./images/mg.jpg",
		name: "mg.jpg"
	},
	reisenbox: {
		type: "file",
		emote: "./images/reisenbox.png",
		name: "reisenbox.png"
	},
	reisenfacev: {
		type: "file",
		emote: "./images/reisenfacev.png",
		name: "reisenfacev.png"
	},
	reisenfloof: {
		type: "file",
		emote: "./images/reisenfloof.png",
		name: "reisenfloof.png"
	},
	shoutime: {
		type: "file",
		emote: "./images/shoutime.png",
		name: "shoutime.png"
	}
};