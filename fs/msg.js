'use strict';

exports.parser = {
	CMDLESS: { //Put your single-key commands here/other commands that require just this text.
		c: "cry",
		C: "cry",
		ɔ: "cry",
		f: "respects",
		F: "respects",
		ɟ: "respects",
		h: "hug",
		H: "hug",
		ɥ: "hug",
		k: "kiss",
		K: "kiss",
		n: "nuzzle",
		N: "nuzzle",
		u: "nuzzle",
		p: "pet",
		P: "pet",
		d: "pet"
	},
	EMOTES: { //duh.
		boo: {
			emotes: ["kogamy.png"],
			names: ["boo.png"]
		},
		denko: {
			emotes: ["denko.jpg"],
			names: ["denko.jpg"]
		},
		destroyed: {
			emotes: ["destroyed.png"],
			names: ["destroyed.png"]
		},
		hinaface: {
			emotes: ["hinaface.png"],
			names: ["hinaface.png"]
		},
		kogamy: {
			emotes: ["kogamy.png"],
			names: ["kogamy.png"]
		},
		lewd: {
			emotes: ["lewd.gif"],
			names: ["lewd.gif"]
		},
		mg: {
			emotes: ["mg.jpg"],
			names: ["mg.jpg"]
		},
		mok: {
			emotes: ["mokay.jpg"],
			names: ["mok.jpg"]
		},
		mokay: {
			emotes: ["mokay.jpg"],
			names: ["mokay.jpg"]
		},
		mokoo: {
			emotes: ["mokoo.png"],
			names: ["mokoo.png"]
		},
		mokooo: {
			emotes: ["mokooo.png"],
			names: ["mokooo.png"]
		},
		reisenbox: {
			rng: [90, 10],
			emotes: ["reisenbox.png", "spoonsreisen.png"],
			names: ["reisenbox.png", "spoonsreisen.png"]
		},
		reisenfacev: {
			emotes: ["reisenfacev.png"],
			names: ["reisenfacev.png"]
		},
		reisenfloof: {
			emotes: ["reisenfloof.png"],
			names: ["reisenfloof.png"]
		},
		reisenwut: {
			emotes: ["reisenwut.jpg"],
			names: ["reisenwut.jpg"]
		},
		shoutime: {
			emotes: ["shoutime.png"],
			names: ["shoutime.png"]
		},
		unyu: {
			emotes: ["unyu.png"],
			names: ["unyu.png"]
		},
		yanderebot: {
			emotes: ["yanderebot.png"],
			names: ["yanderebot.png"]
		}
	},
	example: { //example command
		group: "???", //the group that the command is filed under. this determines whether a server can use it [Defaults to "none"].
		noCall: true, //if the command cannot be called normally, set this to true and it won't be. [Defaults to false]
		isSpam: true, //if the command is spammy, set this to true. [Defaults to false]
		okChan: [""], //the command can only be used in these channels. [Defaults to all channels]
		noChan: [""], //the command cannot be used in these channels. [Defaults to no channels]
		wlonly: true, //the command can only be used by whitelisted users. [Defaults to false]
		alias: "nop", //the command that will be executed instead of this one. [Defaults to none]
		command: function (args, message) {} //The actual command. Required except in the case of when alias is present.
	},
	
	//Development
	echo: {
		wlonly: true,
		command: function (args) {
			if (args.length < 2 || !args[1]) return false;
			if (args[0].toLowerCase() === "here") args[0] = mChannel;
			let toSend = "";
			for (let i = 1; i < args.length; i++) {
				toSend += (i > 1) ? ", " + args[i] : args[i];
			}
			return choonbot.sendMessage(args[0], toSend);
		}
	},
	eval: {
		wlonly: true,
		command: function (args, message) {
			if (!args || !args[0]) return false;
			let buff = "";
			for (let i = 0; i < args.length; i++) {
				buff += (i > 1) ? ", " + args[i] : args[i];
			}
			try {
				return choonbot.sendMessage(mChannel, "Executed successfully and returned:\n```" + eval(buff) + "```");
			} catch (e) {
				return choonbot.sendMessage(mChannel, "Error detected.\n```" + e.stack + "```");
			}
		}
	},
	hello: {
		command: function () {
			return choonbot.sendMessage(mChannel, "Sup, I'm ChoonBot version 2.0! I was made by Choon, who has a knack for naming things after himself.\nUpdates are made whenever my creator and/or I feel like them.\nBefore you ask, I'm married and have a child.");
		}
	},
	reload: {
		wlonly: true,
		command: function () {
			try {
				uncacheTree('./fs/msg.js');
				//uncacheTree('../config.js');
				global.PARSER = require('./msg.js').parser;
				//global.CFG = require('../config.js').config;
				return choonbot.sendMessage(mChannel, "Reloaded commands/misc stuff.");
			} catch (e) {
				return choonbot.sendMessage(mChannel, "Error reloading.\n```" + e.stack + "```");
			}
		}
	},
	uptime: {
		command: function () {
			let time = choonbot.uptime;
			let buffer = 0;
			let str = String(time%1000);
			while (str.length < 3) str = "0" + str;
			str = "." + str + " seconds`";
			time = Math.floor(time/1000); //convert to seconds
			if (time === 0) return choonbot.sendMessage(mChannel, "Uptime: `0" + str);
			str = String(time%60) + str;
			time = Math.floor(time/60); //convert to minutes
			if (time === 0) return choonbot.sendMessage(mChannel, "Uptime: `" + str);
			if (time%60 === 1) {
				str = "1 minute, " + str;
			} else if (time%60 > 0) {
				str = String(time%60) + " minutes, " + str;
			}
			time = Math.floor(time/60); //convert to hours
			if (time === 0) return choonbot.sendMessage(mChannel, "Uptime: `" + str);
			if (time%24 === 1) {
				str = "1 hour, " + str;
			} else if (time%24 > 0) {
				str = String(time%24) + " hours, " + str;
			}
			time = Math.floor(time/24); //convert to days
			if (time === 0) return choonbot.sendMessage(mChannel, "Uptime: `" + str);
			if (time%365 === 1) {
				str = "1 day, " + str;
			} else if (time%365 > 0) {
				str = String(time%365) + " days, " + str;
			}
			buffer = Math.floor(time/365); //convert to years [shouldn't ever happen]
			if (time === 0) return choonbot.sendMessage(mChannel, "Uptime: `" + str);
			if (time === 1) {
				str = "1 year, " + str;
			} else {
				str = String(time) + " years, " + str;
			}
			return choonbot.sendMessage(mChannel, "Uptime: `" + str);
		}
	},
	
	//Information
	help: {
		command: function () {
			return choonbot.sendMessage(mChannel, "help coming soon™");
		}
	},
	
	//inside jokes
	dango: {
		noCall: true,
		isSpam: true,
		command: function () { 
			return choonbot.sendMessage(mChannel, "🍡🍡DANGO PARTY🍡🍡");
		}
	},
	hmm: {
		okChan: ["129117205156724736"],
		command: function () { 
			let hmm = ["hmm", "hmm...", "hm?", "mmh", "hmmmmmmmmmmmm", "hmm hmm!", "hmmmh"];
			return choonbot.sendMessage(mChannel, rne(hmm));
		}
	},
	meatloaf: {
		okChan: ["139023144387084288"],
		command: function () {
			let meatloaf = "";
			let arr = ["M", "E", "A", "T", "L", "O", "A", "F", "m", "e", "a", "t", "l", "o", "a", "f"];
			for (let i = 0; i < 8; i++) {
				meatloaf += arr[i + 8*rng(2)];
			}
			return choonbot.sendMessage(mChannel, meatloaf);
		}
	},/*
	tableflip: {
		noCall: true,
		isSpam: true,
		command: function () {
			let tableflip = ["┬─┬﻿ ノ( ゜-゜ノ)", "(╯°□°)╯︵ ┻━┻ ︵ ╯(°□° ╯)", "┬─┬﻿ ︵ /(.□. \\\\）", "┬─┬ ノ( ^_^ノ)", "(╯°Д°）╯︵ /(.□ . \\\\)", "(/¯◡ ‿ ◡)/¯ ~ ┬─┬﻿", "ノ┬─┬ノ ︵ ( \\\\o°o)\\\\"];
			return choonbot.sendMessage(mChannel, rne(tableflip));
		}
	},*/
	pi: {
		alias: "pie",
	},
	pie: {
		command: function (args, message) {
			let target = mSender.mention();
			if (mMention && mMention !== true) target = mMention[0].mention();
			if (message.command === "pi") return choonbot.sendMessage(mChannel, "*throws a mathematical pie at " + target + "*");
			let pies = ["aloo pie", "apple crisp", "apple pie", "australian and new zealand meat pie", "bacon and egg pie", "bakewell tart", "banana cream pie", "banoffee pie", "bean pie", "bedfordshire clanger", "bisteeya", "blackberry pie", "black bottom pie", "black bun", "blueberry pie", "bob andy pie", "bougasta", "boysenberry pie", "bridie", "buko pie", "bumbleberry pie", "bundevara", "bündner nusstorte", "burek", "butter pie", "butter tart", "buttermilk pie", "canelé", "cantaloupe pie", "caramel tart", "cheesecake", "cheese pie", "cherry pie", "chess pie", "chicken and mushroom pie", "chiffon pie", "chinese pie", "coconut cream pie", "cookie cake pie", "corned beef pie", "cottage pie", "coulibiac", "cumberland pie", "curry pie", "curry puff", "custard tart", "derby pie", "egg tart", "empanda", "fish pie", "flan", "flapper pie", "fried pie", "gibanica", "green grape pie", "homity pie", "hornazo", "jamaican patty", "kalakukko", "karelian pastry", "key lime pie", "khachapurie", "killie pie", "knish", "kuchen", "lemon ice box pie", "lemon meringue pie", "manchester tart", "meat and potato pie", "meat pie", "melton mowbray pork pie", "mince pie", "mississippi mud pie", "natchitoches meat pie", "neapolitan cake pie", "neapolitan pie", "echpochmak", "pastafrola", "pastilla", "pasty", "peach pie", "pear tart", "pecan pie", "pie", "pie a la mode", "pirog", "pirozhki", "pork pie", "pot pie", "pumpkin pie", "qumeshtore me pete", "quiche", "raisin pie", "rappie pie", "raspberry pie", "razzleberry pie", "red velvet cake pie", "red velvet cheesecake pie", "reisen pie", "rhubarb pie", "sambusac", "saskatoonberry pie", "scotch pie", "sea-pie", "sfiha", "shaker lemon pie", "shepherd's pie", "shoofly pie", "soparnik", "southern tomato pie", "spanakopita", "stargazy pie", "steak and kidney pie", "steak pie", "strawberry pie", "strawberry rhubarb pie", "st. stephen's day pie", "sugar pie", "sweet potato pie", "tarta de santiago", "tiropita", "torta capresse", "tourtiére", "treacle tart", "vlaai", "watalappan", "woolton pie", "zelnik"];
			let pie = rne(pies);
			if (pie[0] === "a" || pie[0] === "e" || pie[0] === "i" || pie[0] === "o" || pie[0] === "u") {
				pie = "an " + pie;
			} else {
				pie = "a " + pie;
			}
			choonbot.sendMessage(mChannel, "*throws " + pie + " at " + target + "*");
		}
	},
	
	//Cute bot things
	cri: {
		alias: "cry"
	},
	cry: {
		command: function () {
			if (mContent === "ɔ" && mSender.id !== "90956503476883456") return false;
			let sender = (mContent !== "ɔ") ? mSender.mention() : "@" + mSender.username;
			let cri = [";_;", ";_;7", "*cries softly*", "BibleThump", "bibolfamp", "notlikethis", ";~;", ";-;", "(;_ʖ;)", "*runs up to " + mSender.mention() + " and cries on their shoulder*", "*sobs*", "*weeps*", "*plays a sad song on the worlds smallest violin*", ",.,", ",x,", ";x;", "FeelsBadMan"];
			return choonbot.sendMessage(mChannel, (mContent === "ɔ") ? wavesine(rne(cri)) : rne(cri));
		}
	},
	pet: {
		command: function (args) {
			if (mContent === "d" && mSender.id !== "90956503476883456") return false;
			if (mMention === true) return choonbot.sendMessage(mChannel, "how do you expect me to pet everyone at the same time");
			//if (args && args[0] === "*") return choonbot.sendMessage(mChannel, "stop taking my directions literally for a sec");
			let buffer = [], loop = true, count = 0;
			while (loop) {
				if (mMention[count]) {
					if (mMention[count].id === choonbot.user.id) {
						buffer = [], loop = false;
					} else if (mMention[count].id === "116652461841711108" && mMention[count].username.toLowerCase().substr(message.mentions[count].username.length - 6) === "reiuji") { //special case: okuu is being pet
						let oPath = path.join(__dirname, "images/okuu-pet.gif");
						return choonbot.sendFile(mChannel, oPath, "okuu-pet.gif");
					} else buffer[buffer.length] = mMention[count].mention();
				} else loop = false;
			}
			if (!buffer.length) {
				let pet = ["*is pet*", "*appreciates the petting*", "*loves the petting*", "*reluctantly is pet*", "*demands you pet him more*", "*cute choonbot noises*", "*awkwardly blushes*", "*becomes a choonbot poff*", "*sputters*", "*murrs*", "*wags his tail cutely*"];
				return choonbot.sendMessage(mChannel, (mContent === "d") ? wavesine(rne(pet)) : rne(pet));
			}
			if (buffer.length === 1) return choonbot.sendMessage(mChannel, "*pets " + buffer[0] + "*");
			if (buffer.length === 2) return choonbot.sendMessage(mChannel, "*pets " + buffer[0] + " and " + buffer[1] + "*");
			return choonbot.sendMessage(mChannel, "I only have 2 hands to pet people with");
		}
	},
	hug: {
		command: function (args) {
			if (mContent === "ɥ" && mSender.id !== "90956503476883456") return false;
			if (mMention === true) return choonbot.sendMessage(mChannel, "sorry but I can't hug everyone at once");
			//if (args && args[0] === "*") return choonbot.sendMessage(mChannel, "stars are intangible you shit");
			let buffer = [], loop = true, count = 0, sender = mSender.mention();
			while (loop) {
				if (mMention[count]) {
					if (mMention[count].id === choonbot.user.id) {
						buffer = [], loop = false;
					} else buffer[buffer.length] = mMention[count].mention();
				} else loop = false;
			}
			if (!buffer.length) {
				if (mContent === "ɥ") sender = "@" + mSender.username;
				let hug = ["*is hugged*", "*hugs back*", "*loves " + sender + "'s hug*", "*hugs " + sender + " back and breaks away*\nIt's not that I wanted you to hug me or anything, you baka...", "*cute choonbot noises*", "*gives " + sender + " a tight hug*", "*hugs " + sender + " back and kisses them on the cheek*", "*awkwardly blushes and hugs " + sender + " back*", "*floofs*", "*snuggles with " + sender + "*", "*cuddles " + sender + "*"];
				return choonbot.sendMessage(mChannel, (mContent === "ɥ") ? wavesine(rne(hug)) : rne(hug));
			}
			if (buffer.indexOf(sender) > -1) return choonbot.sendMessage(mChannel, sender + " hugs themself.");
			if (buffer.length === 1) return choonbot.sendMessage(mChannel, sender + " has hugged " + buffer[0] + "!");
			if (buffer.length === 2) return choonbot.sendMessage(mChannel, sender + " has hugged " + buffer[0] + " and " + buffer[1] + "!");
			return choonbot.sendMessage(mChannel, "I'm quite sure this would be more like a huddle");
		}
	},
	kiss: {
		command: function (args) {
			if (mMention === true) return choonbot.sendMessage(mChannel, "you must be really desperate aren't you");
			//if (args && args[0] === "*") return choonbot.sendMessage(mChannel, ">kissing a star");
			let buffer = [], loop = true, count = 0, sender = mSender.mention();
			while (loop) {
				if (mMention[count]) {
					if (mMention[count].id === choonbot.user.id) {
						buffer = [], loop = false;
					} else buffer[buffer.length] = mMention[count].mention();
				} else loop = false;
			}
			if (!buffer.length && mSender.id !== "91184988610895872") return choonbot.sendMessage(mChannel, "how about no");
			if (!buffer.length) {
				let kiss = ["*blushes*", "*kisses" + sender + " back*", "*moans a bit into the kiss*", "*kisses " + sender + " back then slaps them*\nD-don't get the wrong idea, it's not that I kissed you because I love you or anything, y-you baka...", "*passionately embraces and kisses" + sender + "*", "*sputters*", "*messily kisses" + sender + " back*", "*licks " + sender + "'s cheek*"];
				return choonbot.sendMessage(mChannel, rne(kiss));
			}
			if (buffer.indexOf(sender) > -1) return choonbot.sendMessage(mChannel, sender + " grabs a mirror and kisses their reflection. what a narcissist");
			if (buffer.length === 1) return choonbot.sendMessage(mChannel, sender + " has kissed " + buffer[0] + "!");
			if (buffer.length === 2) return choonbot.sendMessage(mChannel, sender + " has kissed " + buffer[0] + " and " + buffer[1] + "!");
			return choonbot.sendMessage(mChannel, "what a happy family we got here");
		}
	},
	nuzzle: {
		command: function (args) {
			if (mContent === "u" && mSender.id !== "90956503476883456") return false;
			if (mMention === true) return choonbot.sendMessage(mChannel, "how can you nuzzle everyone");
			//if (args && args[0] === "*") return choonbot.sendMessage(mChannel, "good idea if you like your nose being burned off by plasma");
			let buffer = [], loop = true, count = 0, sender = mSender.mention();
			while (loop) {
				if (mMention[count]) {
					if (mMention[count].id === choonbot.user.id) {
						buffer = [], loop = false;
					} else buffer[buffer.length] = mMention[count].mention();
				} else loop = false;
			}
			if (!buffer.length) {
				if (mContent === "u") sender = "@" + mSender.username;
				let nuzz = ["*blushes*", "*nuzzles " + sender + " back*", "*embraces + " + sender + "*", "*makes a heart with his hands and projects it to " + sender + "'s chest*"];
				return choonbot.sendMessage(mChannel, rne(nuzz));
			}
			if (buffer.indexOf(sender) > -1) return choonbot.sendMessage(mChannel, sender + " grabs a mirror and nuzzles their reflection. what a narcissist");
			if (buffer.length === 1) return choonbot.sendMessage(mChannel, sender + " nuzzled " + buffer[0] + "!");
			if (buffer.length === 2) return choonbot.sendMessage(mChannel, sender + " nuzzled " + buffer[0] + " and " + buffer[1] + "!");
			return choonbot.sendMessage(mChannel, "yes I get it you like nuzzling");
		}
	},
	
	//Misc Commands that don't have a category.
	choice: {
		alias: "pick"
	},
	choose: {
		alias: "pick"
	},
	pick: {
		command: function (args) {
			if (!args || !args[0]) return choonbot.sendMessage(mChannel, ">not even giving me a single choice");
			if (args[0] === "*" && args.length === 1) return choonbot.sendMessage(mChannel, "I choose: **to believe you're incredibly dense.**");
			if (args.length < 2) return choonbot.sendMessage(mChannel, "That isn't really a choice.");
			for (let i = 1; i < args.length; i++) {
				for (let j = 0; j < i; j++) {
					if (args[i].toLowerCase() === args[j].toLowerCase()) return choonbot.sendMessage(mChannel, "Sorry, I only make fair decisions.");
				}
			}
			return choonbot.sendMessage(mChannel, "I choose: **" + rne(args) + "**");
		}
	},
	dice: {
		alias: "roll"
	},
	roll: {
		command: function (args) {
			let opt = [];
			let str = "You rolled ";
			let buf = 0;
			let tot = 0;
			if (!args.length || !args[0]) args = ["1d6p0"];
			args = args[0].toLowerCase(); //maybe multiple roll options will pop in the future?
			if (args.indexOf("d") === -1) args = "1d" + args;
			if (args.indexOf("+") > -1 || args.indexOf("-") > -1) {
				if (args.indexOf("p") > -1 || args.indexOf("m") > -1) return choonbot.sendMessage(mChannel, "nice try but you can't mix signs");
				if (args.indexOf("+") > -1 && args.indexOf("-") > -1) return choonbot.sendMessage(mChannel, "make up your mind, which sign do you want");
				if (args.indexOf("-") === 0) return choonbot.sendMessage(mChannel, "you can't roll a negative amount of dice");
				if (args.indexOf("+") === 0) return choonbot.sendMessage(mChannel, "you don't need the +, get rid of it");
				buf = (args.indexOf("-") > -1) ? -args.indexOf("-") : args.indexOf("+");
				if (buf < 0) {
					if (args.lastIndexOf("-") !== -buf) return choonbot.sendMessage(mChannel, "you only need 1 sign, which should go after the roll.");
					args = args.substr(0, -buf) + "m" + args.substr(-buf + 1);
				} else {
					if (args.lastIndexOf("+") !== buf) return choonbot.sendMessage(mChannel, "you only need 1 sign, which should go after the roll.");
					args = args.substr(0, buf) + "p" + args.substr(buf + 1);
				}
			} else if (args.indexOf("p") === -1 && args.indexOf("m") === -1) {
				args += "p0";
			}
			if (args !== toId(args)) return choonbot.sendMessage(mChannel, "you probably shouldn't use any spaces or special characters");
			if (args.indexOf("m") > -1) {
				opt = [Number(args.split("d")[0]), Number(args.split("d")[1].split("m")[0]), -Number(args.split("m")[1])];
			} else {
				opt = [Number(args.split("d")[0]), Number(args.split("d")[1].split("p")[0]), Number(args.split("p")[1])];
			}
			if (isNaN(opt[0]) || isNaN(opt[1]) || isNaN(opt[2])) return choonbot.sendMessage(mChannel, "??????????????");
			if (opt[0] < 1) return choonbot.sendMessage(mChannel, "i'm pretty sure you can't roll no dice");
			if (opt[0] > 64) return choonbot.sendMessage(mChannel, "how many dice do you need to roll sweet jesus man");
			if (opt[1] < 1) return choonbot.sendMessage(mChannel, "dice can't have no sides try again"); //there ARE actually 1-sided dice.
			if (opt[1] > 144) return choonbot.sendMessage(mChannel, "well, I'm not sure a die with that many sides exists yet...");
			for (let j = 0; j < opt[0]; j++) {
				buf = rng(opt[1]) + 1;
				tot += buf;
				buf = String(buf);
				if (opt[0] === 1) {
					str += "`" + buf + "`!";
				} else {
					if (j === 0) str += "`";
					str += buf;
					if (j === opt[0] - 1) {
						if (opt[2] === 0) {
							str += "` for a total of " + String(tot) + "!";
						} else if (opt[2] > 0) {
							str += "+" + String(opt[2]) + "` for a total of " + String(tot + opt[2]) + "!";
						} else {
							str += "-" + String(-opt[2]) + "` for a total of " + String(tot + opt[2]) + "!";
						}
					} else {
						str += ",";
					}
				}
			}
			return choonbot.sendMessage(mChannel, str);
		}
	},
	flip: {
		alias: "coin"
	},
	coin: {
		command: function (args) {
			let str = "";
			let heads = 0;
			let tails = 0;
			if (!args.length || !args[0]) args = ["1"];
			let num = Number(args[0]);
			if (isNaN(num)) return choonbot.sendMessage(mChannel, "??????????????");
			if (num < 1) return choonbot.sendMessage(mChannel, "I'm not sure it's possible to flip less than 1 coin.");
			if (num !== Math.floor(num)) return choonbot.sendMessage(mChannel, "I'm not sure it's possible to flip a fraction of a coin.");
			if (num === 1) {
				str = "The coin landed on " + rne(["heads", "tails"]) + "!";
			} else if (num < 64) {
				str = "Detailed results: `";
				for (let i = 0; i < num; i++) {
					if (i) str += ",";
					if (rng(2)) {
						heads += 1;
						str += "h";
					} else {
						tails += 1;
						str += "t";
					}
					if (i === num - 1) str = "You flipped " + String(num) + " coins. You got " + String(heads) + " heads and " + String(tails) + " tails. " + str + "`";
				}
			} else if (num < 65536) {
				str = "You flipped " + String(num) + " coins. You got ";
				for (let i = 0; i < num; i++) {
					if (rng(2)) {
						heads += 1;
					} else {
						tails += 1;
					}
					if (i === num - 1) str += String(heads) + " heads and " + String(tails) + " tails.";
				}
			} else {
				return choonbot.sendMessage(mChannel, "WHY DO YOU NEED TO FLIP THIS MANY COINS?!?");
			}
			if (num > 255) str += " You might have a coin-flipping problem.";
			return choonbot.sendMessage(mChannel, str);
		}
	},
	dome: {
		alias: "fossil"
	},
	helix: {
		alias: "fossil"
	},
	fossil: {
		command: function (args, message) {
			if (message.command === "fossil") return false;
			let fossil = (message.command === "dome") ? "dome fossil" : "helix fossil";
			if (!args || args.length < 1 || !args[0]) return choonbot.sendMessage(mChannel, "you're supposed to say something to the " + fossil + " first");
			if (args[0] === "*") return choonbot.sendMessage(mChannel, "The " + fossil + " says: **why.**");
			if (!rng(128)) return choonbot.sendMessage(mChannel, "The " + fossil + " says: **Go ask RoboNitori instead.**");
			let praise = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again ", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful", "no.", "START", "A", "B", "UP", "DOWN", "LEFT", "RIGHT", "SELECT"];
			return choonbot.sendMessage(mChannel, "The " + fossil + " says: **" + rne(praise) + "**");
		}
	},
	respects: {
		command: function (args, message) {
			if (mContent === "ɟ" && mSender.id !== "90956503476883456") return false;
			let sender = (mContent !== "ɟ") ? mSender.mention() : "@" + mSender.username;
			return choonbot.sendMessage(mChannel, (mContent === "ɟ") ? wavesine(sender + " has paid their respects.") : sender + " has paid their respects.")
		}
	}
	invite: {
		command: function () {
			return choonbot.sendMessage(mChannel, "if you want me on your server that badly just pester choon about it");
		}
	},
	
	//well would you look at that, choon finally added quotes
	quote: {
		command: function (args) {
			if (!mServer.id) return choonbot.sendMessage(mChannel, "you can't exactly use quotes in pms, sorry, too inside-jokey");
			let qPath = path.join(__dirname, "arch/" + mServer.id + "/quo.txt"); //due to how this works fs is already there
			try {
				fs.accessSync(qPath, fs.F_OK);
			} catch (e) {
				console.log(e.stack);
				console.log("Server " + mServer.id + "'s quote file doesn't exist... somehow. Creating files...");
				let dPath = path.join(__dirname, "arch/" + mServer.id + "/");
				try {
					fs.accessSync(dPath, fs.F_OK);
				} catch (r) {
					console.log("HOW DOES SERVER " + mServer.id + "'S FOLDER NOT EXIST. Creating it now I guess...");
					fs.mkdir(dPath, function (err) {
						if (err) {
							console.log("fuck it.");
							console.log(err.stack);
							process.exit(-1);
						}
					});
					fs.writeFile(qPath, "", function (err) {
						if (err) {
							console.log("??????????");
							console.log(err.stack);
						}
					});
				}
				fs.writeFile(qPath, "", function (err) {
					if (err) {
						console.log("??????????");
						console.log(err.stack);
					}
				});
				return choonbot.sendMessage(mChannel, "ok, did you delete a file or did I just join a new server?");
			}
			let qFile = fs.readFileSync(qPath, {encoding:"utf8"});
			let quotes = qFile.split("\n\n\nQ:");
			quotes.shift();
			let arg = args[0].toLowerCase();
			args.splice(0, 1);
			if (arg === "add") {
				let quo = args.join(", ");
				while (quo.indexOf("\n\n\nQ:") > -1) quo = quo.substr(0, quo.indexOf("\n\n\nQ:")) + quo.substr(quo.indexOf("\n\n\nQ:") + 1); //nice try
				fs.writeFileSync(qPath, qFile + "\n\n\nQ:" + quo);
				return choonbot.sendMessage(mChannel, "Quote added as number " + String(quotes.length) + "!");
			} else { //other features tba
				if (isNaN(Number(arg)) || Number(arg) !== Math.floor(Number(arg)) || Number(arg) < 0 || args.length) return false;
				if (!quotes[Number(arg)]) return choonbot.sendMessage(mChannel, "doesn't exist yet");
				return choonbot.sendMessage(mChannel, quotes[Number(arg)]);
			}
		}
	},
	
	//the godly meme command, which deserves its own section
	lenny: {
		alias: "meme", //so that way we can have nice things
	},
	meme: { //PogChamp
		isSpam: true,
		command: function (args, message) {
			if (message.command === "lenny") args = ["lenny"];
			if (args[0]) {
				//if (args[0] === "*") return choonbot.sendMessage(mChannel, "here's a * for you: ( ° ͜ʖ͡°)╭∩╮");
				let arg = args[0].toLowerCase();
				if (arg === "dank") { //dank placeholder
					return choonbot.sendMessage(mChannel, "dank meme");
				} else if (arg === "monocle") {
					return choonbot.sendMessage(mChannel, "(╭ರ_⊙)");
				} else if (arg === "lenny") {
					let lenny = ["( ͡° ͜ʖ ͡°)", "( ͠° ͟ʖ ͡°)", "ᕦ( ͡° ͜ʖ ͡°)ᕤ", "( ͡~ ͜ʖ ͡°)", "( ͡o ͜ʖ ͡o)", "͡° ͜ʖ ͡ -", "( ͡͡ ° ͜ ʖ ͡ °)", "( ͡ ͡° ͡°  ʖ ͡° ͡°)", "(ง ͠° ͟ل͜ ͡°)ง", "( ͡° ͜ʖ ͡ °)", "(ʖ ͜° ͜ʖ)", "[ ͡° ͜ʖ ͡°]", "( ͡o ͜ʖ ͡o)", "{ ͡• ͜ʖ ͡•}", "( ͡° ͜V ͡°)", "( ͡^ ͜ʖ ͡^)", "( ‾ʖ̫‾)", "( ͡°╭͜ʖ╮͡° )", "ᕦ( ͡°╭͜ʖ╮͡° )ᕤ", "─=≡Σᕕ( ͡° ͜ʖ ͡°)ᕗ"];
					return choonbot.sendMessage(mChannel, lenny[rng(lenny.length)]);
				} else if (arg === "xd") {
					let xd = ["xd", "Xd", "xD", "XD"];
					return choonbot.sendMessage(mChannel, xd[rng(xd.length)]);
				} else if (arg === ":^)") {
					return choonbot.sendMessage(mChannel, ':^)');
				}
			}
			//In this case, make your own donger!
			//Donger Part list courtesy of dongerlist.com.
			//ლʕ ” ‾́ _ʖ ‾́ ” ʔ╭∩╮
			//ᕙ༼~‾́ل͜‾́~༽ᕗ
			let arm = ["╰", "╯", "ヽ", "ﾉ", "ノ", "∩", "੧", "੭", "⋋", "⋌", "ლ", "╭∩╮", "⊃", "つ", "ᕙ", "ᕗ", "ᕕ", "୧", "୨", "┌", "┐", "└", "┘", "٩", "و", "ʋ", "ง", "凸", "ᕦ", "ᕤ", "へ", "ᓄ", "¯\\\\_", "_/¯", "╚═", "═╝", "〜", "┌∩┐", "c", "╮", "乁", "ㄏ", "ᕤ", "ԅ", "o͡͡͡╮", "╭o͡͡͡", "ノ⌒.", "//╲/\\╭", "╮/\\╱﻿\\"];
			let bod = ["(", ")", "[", "]", "༼", "༽", "ʕ", "ʔ", "໒(", ")७", "|", "⁞", "།", "།", "〳", "〵", "╏", "║", "▐", "░", "▒"];
			let che = [".", "✿", "˵", ",", "\\*", "”", "=", "\\~", "∗", ":"];
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
			choonbot.sendMessage(mChannel, DONGER);
		}
	}
};