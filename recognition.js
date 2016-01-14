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
				uncacheTree('./!!!!config.js');
				global.commands = require('./recognition.js').commands;
				global.emotes = require('./recognition.js').emotes;
				global.configBuffer = require('./!!!!config.js');
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
	setavatar: {
		command: function (message, args) {
			//not implemented
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
	
	//info
	
	help: {
		command: function (message, args) {
			if (Math.floor(Math.random()*22) === 11) return choonbot.sendMessage(message.channel, "nobody can help you. you must face the gazebo alone.");
			if (args[0]) {
				let arg = toId(args[0]);
				if (arg === "emotes") {
					choonbot.sendMessage(message.channel, "Emotes list:\ndenko: Sends a denko face.\nkogamy: Sends a spoopy kogasa picture. Alias: boo\nreisenbox: Sends a box of Reisen for all of your Choon satisfying needs.");
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
				}
			} else {
				choonbot.sendMessage(message.channel, "Sup! I'm a bot made by Choon. He made me for fun, if you're upset let him know and I'll leave.\nCommand List:\nDev:`hello`\nGames:`game`\nMemes:`meme`\nMy command identifier is `*` or the vastly superior `('.w.') `. Put one of these before a command and at the beginning of your message. I separate arguments using `,` with a space at the end.\nFor help with specific commands use `*help command`. For a list of emotes use `*help emotes`.");
			}
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
	
	//the dankest of memes.
	
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
	denko: {
		type: "text",
		emote: "('.w.')"
	},
	boo: {
		type: "file",
		emote: "./images/kogamy.png",
		name: "boo.png"
	},
	kogamy: {
		type: "file",
		emote: "./images/kogamy.png",
		name: "kogamy.png"
	},
	reisenbox: {
		type: "file",
		emote: "./images/reisenbox.png",
		name: "reisenbox.png"
	},
	hinaface: {
		type: "file",
		emote: "./images/hinaface.png",
		name: "hinaface.png"
	},
	shoutime: {
		type: "file",
		emote: "./images/shoutime.png",
		name: "shoutime.png"
	},
	reisenfloof: {
		type: "file",
		emote: "./images/reisenfloof.png",
		name: "reisenfloof.png"
	},
	reisenfacev: {
		type: "file",
		emote: "./images/reisenfacev.png",
		name: "reisenfacev.png"
	},
	lewd: {
		type: "file",
		emote: "./images/lewd.gif",
		name: "lewd.gif"
	}
};