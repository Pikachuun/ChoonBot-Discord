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
			let buffer = args[0];
			if (!buffer) return false;
			for (let i = 0; i < args.length; i++) {
				if (i !== 0) buffer += ", " + args[i];
			}
			choonbot.sendMessage(message.channel, message.sender.mention() + " says: \"" + buffer + "\"");
		}
	},
	echo: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			if (!args[1]) return false;
			let channelID = args[0];
			let buffer = args[1];
			for (let i = 1; i < args.length; i++) {
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
	whois: {
		command: function (message, args) {
			if (args[0] === "*") return choonbot.sendMessage(message.channel, "I'd get info about an idiot but you probably know all about yourself");
			if (!message.mentions) return choonbot.sendMessage(message.channel, "I kinda need someone mentione in order to get info about them...");
			if (message.mentions.length > 1) return choonbot.sendMessage(message.channel, "Pick 1 person please.");
			let mentioned = message.mentions[0];
			let str = "Info about " + mentioned.mention() + ":\nID: `" + mentioned.id + "`";
			if (mentioned.game) str += "\nPlaying " + mentioned.game.name;
			if (mentioned.avatarURL) str += "\nAvatar URL: `" + mentioned.avatarURL + "`";
			return choonbot.sendMessage(message.channel, str);
		}
	},
	/*acceptinvite: {
		command: function (message, args) {
			if (!(message.sender.id in whitelist)) return false;
			if (!args[0]) return false;
			choonbot.sendMessage(message.channel, "alright, I'm joining now!");
			choonbot.joinServer(args[0]);
		}
	},*/
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
			for (let i = 0; i < args.length; i++) {
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
	uptime: {
		command: function (message, args) {
			let time = Date.now() - STARTTIME;
			let buffer = 0;
			let str = String(time%1000);
			while (str.length < 3) str = "0" + str;
			str = "." + str + " seconds`";
			time = Math.floor(time/1000); //convert to seconds
			if (time === 0) return choonbot.sendMessage(message.channel, "Uptime: `0" + str);
			str = String(time%60) + str;
			time = Math.floor(time/60); //convert to minutes
			if (time === 0) return choonbot.sendMessage(message.channel, "Uptime: `" + str);
			if (time%60 === 1) {
				str = "1 minute, " + str;
			} else if (time%60 > 0) {
				str = String(time%60) + " minutes, " + str;
			}
			time = Math.floor(time/60); //convert to hours
			if (time === 0) return choonbot.sendMessage(message.channel, "Uptime: `" + str);
			if (time%24 === 1) {
				str = "1 hour, " + str;
			} else if (time%24 > 0) {
				str = String(time%24) + " hours, " + str;
			}
			time = Math.floor(time/24); //convert to days
			if (time === 0) return choonbot.sendMessage(message.channel, "Uptime: `" + str);
			if (time%365 === 1) {
				str = "1 day, " + str;
			} else if (time%365 > 0) {
				str = String(time%365) + " days, " + str;
			}
			buffer = Math.floor(time/365); //convert to years [shouldn't ever happen]
			if (time === 0) return choonbot.sendMessage(message.channel, "Uptime: `" + str);
			if (time === 1) {
				str = "1 year, " + str;
			} else {
				str = String(time) + " years, " + str;
			}
			return choonbot.sendMessage(message.channel, "Uptime: `" + str);
		}
	},
	
	//info
	
	help: {
		command: function (message, args) {
			if (rng(22) === 11) return choonbot.sendMessage(message.channel, "nobody can help you. you must face the gazebo alone.");
			if (args[0]) {
				let arg = toId(args[0]);
				if (arg === "emotes") {
					choonbot.sendMessage(message.channel, "Emotes list:\n`denko`: Sends a denko face.\n`kogamy`: Sends a spoopy kogasa picture. Alias:`boo`\n`lewd`: Sends a gif that basically says \"lewd.\"\n`mg`: Sends a mg-tastic picture of Ringo enjoying Pocky Dango.\n`mokay`: Sends a manga-esque Mokou face saying OK. Alias:`mok`\n`reisenbox`: Sends a box of Reisen for all of your Choon satisfying needs.\n`reisenfacev`: Sends a vector-esque version of the dank reisenface meme.\n`reisenfloof`: Sends the best floof.\n`reisenwut`: Sends a very confused Reisen. Perfect for when you have no clue what is going on.\n`shoutime`: Tells you what time it is.\nThese are surrounded by `:`. One emote per message please.");
				} else if (arg === "command") {
					choonbot.sendMessage(message.channel, "did you just");
				} else if (arg === "help") {
					choonbot.sendMessage(message.channel, "seriously?");
				} else if (args[0] === "*") {
					choonbot.sendMessage(message.channel, "well played");
				} else if (arg === "hello") {
					choonbot.sendMessage(message.channel, "A test command that makes me say hello.");
				} else if (arg === "game") {
					choonbot.sendMessage(message.channel, "`game`: Starts a game where we do absolutely nothing because Choon hasn't made anything yet.\n`game end`: Ends the game.");
				} else if (arg === "meme") {
					choonbot.sendMessage(message.channel, "Sends a dank meme. The argument can change the meme!");
				} else if (arg === "pet") {
					choonbot.sendMessage(message.channel, "Lets you pet a user by mentioning them!");
				} else if (arg === "hug") {
					choonbot.sendMessage(message.channel, "Lets you hug a user by mentioning them!");
				} else if (arg === "notice") {
					let botname = (spoon) ? "SpoonBot" : "ChoonBot";
					choonbot.sendMessage(message.channel, botname + "-Senpai will notice whoever you mention!");
				} else if (arg === "morse") {
					choonbot.sendMessage(message.channel, "`morse encode, *`: Translates whatever you tell me into morse code.\n`morse decode, *`: Translates whatever you tell me from morse code.");
				} else if (arg === "cri") {
					choonbot.sendMessage(message.channel, "For those moments when you're really sad, I'll cry with you.");
				} else if (arg === "pick") {
					choonbot.sendMessage(message.channel, "Can't decide on something? That's ok, I'll decide for you! Use as many choices as you want.");
				}
			} else {
				choonbot.sendMessage(message.channel, "Sup! I'm a bot made by Choon. He made me for fun, if you're upset let him know and I'll leave.\nCommand List:\nDev:`hello`,`help *`,`say *`,`echo *, *`\nGames:`game`\nMisc:`meme *`,`pet *`,`hug *`,`notice *`,`morse *`,`cri`,`pick *`\nMy command identifier is `*` or the vastly superior `('.w.') `. Put one of these before a command and at the beginning of your message. I separate arguments using `,` with a space at the end.\nFor help with specific commands use `help command`.\nI also can use emotes by surrounding the requested emote with `:`. For a list of emotes use `emotes` as an argument for this command.");
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
			let jpg = [true, false, false, true, true];
			if (avatarID >= jpg.length) return choonbot.sendMessage(message.channel, "That avatar doesn't exist yet.");
			let avatarFile = (jpg[avatarID]) ? "./avatars/" + String(avatarID) + ".jpg" : "./avatars/" + String(avatarID) + ".png";
			choonbot.setAvatar(fs.readFileSync(avatarFile));
			setTimeout(function () {
				choonbot.sendMessage(message.channel, "Avatar set!");
			}, 666);
		}
	},
	dispavatar: {
		command: function (message, args) {
			if (!args[0]) return false;
			if (isNaN(args[0]) || parseInt(args[0]) < 0 || parseInt(args[0]) != parseFloat(args[0])) return choonbot.sendMessage(message.channel, "I can only take positive integers.");
			let avatarID = parseInt(args[0]);
			//jpg files
			let jpg = [true, false, false, true, true];
			if (avatarID >= jpg.length) return choonbot.sendMessage(message.channel, "That avatar doesn't exist yet.");
			let avatarAttach = (jpg[avatarID]) ? "./avatars/" + String(avatarID) + ".jpg" : "./avatars/" + String(avatarID) + ".png";
			let avatarName = (jpg[avatarID]) ? "avatar.jpg" : "avatar.png";
			choonbot.sendFile(message.channel, avatarAttach, avatarName);
		}
	},
	morse: {
		command: function (message, args) {
			if (!args || !args[0]) return false;
			if (args[0] === "*") return choonbot.sendMessage(message.channel, "._.");
			if (args[0].toLowerCase() !== "encode" && args[0].toLowerCase() !== "decode" || args.length < 2) return false;
			if (args[1] === "*") return choonbot.sendMessage(message.channel, "...");
			let buffer = "";
			for (let i = 1; i < args.length; i++) {
				if (i !== 1) buffer += ", ";
				buffer += args[i];
			}
			let morse = "";
			let table = {};
			if (args[0].toLowerCase() === "encode") {
				table = {"a":".-", "b":"-...", "c":"-.-.", "d":"-..", "e":".", "f":"..-.", "g":"--.", "h":"....", "i":"..", "j":".---", "k":"-.-", "l":".-..", "m":"--", "n":"-.", "o":"---", "p":".---.", "q":"--.-", "r":".-.", "s":"...", "t":"-", "u":"..-", "v":"...-", "w":".--", "x":"-..-", "y":"-.--", "z":"--..", "0":"-----", "1":".----", "2":"..---", "3":"...--", "4":"....-", "5":".....", "6":"-....", "7":"--...", "8":"---..", "9":"----.", ".":".-.-.-", ",":"--..--", ":":"---...", "?":"..--..", "'":".----.", "-":"-....-", "/":"-..-.", "(":"-.--.-", ")":"-.--.-", "\"": ".-..-.", "@":".--.-.", "=":"-...-", " ":" "};
				for (let j = 0; j < buffer.length; j++) {
					if (j === 0) {
						morse += "Translated Message: ```";
					} else {
						morse += "   ";
					}
					if (!(buffer[j].toLowerCase() in table)) return choonbot.sendMessage(message.channel, "Invalid character `" + buffer[j] + "` detected. Translation failed.");
					morse += table[buffer[j].toLowerCase()];
					if (j === buffer.length - 1) morse += "```";
				}
				choonbot.sendMessage(message.channel, morse);
			} else {
				if (buffer[0] !== "`" || buffer[buffer.length - 1] !== "`" || buffer.split("   ").length < 2) return choonbot.sendMessage(message.channel, "Invalid format detected. Use \\`these\\` around your message and separate each letter with a triple space please [spaces are 7 spaces].");
				table = {".-":"a", "-...":"b", "-.-.":"c", "-..":"d", ".":"e", "..-.":"f", "--.":"g", "....":"h", "..":"i", ".---":"j", "-.-":"k", ".-..":"l", "--":"m", "-.":"n", "---":"o", ".---.":"p", "--.-":"q", ".-.":"r", "...":"s", "-":"t", "..-":"u", "...-":"v", ".--":"w", "-..-":"x", "-.--":"y", "--..":"z", "-----":"0", ".----":"1", "..---":"2", "...--":"3", "....-":"4", ".....":"5", "-....":"6", "--...":"7", "---..":"8", "----.":"9", ".-.-.-":".", "--..--":",", "---...":":", "..--..":"?", ".----.":"'", "-....-":"-", "-..-.":"/", "-.--.-":"(", "-.--.-":")", "\"": ".-..-.", ".--.-.":"@", "-...-":"=", " ":" "};
				buffer = buffer.substr(1, buffer.length - 2).split("       "); //get spaces first
				let bufferA = [];
				for (let k = 0; k < buffer.length; k++) {
					if (k > 0) bufferA[bufferA.length] = " ";
					bufferA = bufferA.concat(buffer[k].split("   "));
				}
				for (let j = 0; j < bufferA.length; j++) {
					if (j === 0) {
						morse += "Translated Message: ```";
					}
					if (!(bufferA[j] in table)) return choonbot.sendMessage(message.channel, "Invalid character `" + bufferA[j] + "` detected. Translation failed.");
					morse += table[bufferA[j]];
					if (j === bufferA.length - 1) morse += "```";
				}
				choonbot.sendMessage(message.channel, morse);
			}
		}
	},
	choice: {
		command: function (message, args) {
			commands.pick.command(message, args);
		}
	},
	choose: {
		command: function (message, args) {
			commands.pick.command(message, args);
		}
	},
	pick: {
		command: function (message, args) {
			if (args.length < 1 || !args[0]) return choonbot.sendMessage(message.channel, "uwotm8");
			if (args[0] === "*" && args.length === 1) return choonbot.sendMessage(message.channel, "I choose: **to believe you're incredibly dense.**");
			if (args.length < 2) return choonbot.sendMessage(message.channel, "That isn't really a choice.");
			for (let i = 1; i < args.length; i++) {
				for (let j = 0; j < i; j++) {
					if (toId(args[i]) === toId(args[j])) return choonbot.sendMessage(message.channel, "Sorry, I only make fair decisions.");
				}
			}
			let str = args[rng(args.length)];
			choonbot.sendMessage(message.channel, "I choose: **" + str + "**");
		}
	},
	dice: {
		command: function (message, args) {
			commands.roll.command(message, args);
		}
	},
	roll: {
		command: function (message, args) {
			let opt = [];
			let str = "You rolled ";
			let buf = 0;
			let tot = 0;
			if (!args || !args[0]) args = ["1d6p0"];
			args = args[0].toLowerCase(); //maybe multiple roll options will pop in the future?
			if (args.indexOf("d") === -1) args = "1d" + args;
			if (args.indexOf("+") > -1 || args.indexOf("-") > -1) {
				if (args.indexOf("p") > -1 || args.indexOf("m") > -1) return choonbot.sendMessage(message.channel, "nice try but you can't mix signs");
				if (args.indexOf("+") > -1 && args.indexOf("-") > -1) return choonbot.sendMessage(message.channel, "make up your mind, which sign do you want");
				if (args.indexOf("-") === 0) return choonbot.sendMessage(message.channel, "you can't roll a negative amount of dice");
				if (args.indexOf("+") === 0) return choonbot.sendMessage(message.channel, "you don't need the +, get rid of it");
				buf = (args.indexOf("-") > -1) ? -args.indexOf("-") : args.indexOf("+");
				if (buf < 0) {
					if (args.lastIndexOf("-") !== -buf) return choonbot.sendMessage(message.channel, "you only need 1 sign, which should go after the roll.");
					args = args.substr(0, -buf) + "m" + args.substr(-buf + 1);
				} else {
					if (args.lastIndexOf("+") !== buf) return choonbot.sendMessage(message.channel, "you only need 1 sign, which should go after the roll.");
					args = args.substr(0, buf) + "p" + args.substr(buf + 1);
				}
			} else if (args.indexOf("p") === -1 && args.indexOf("m") === -1) {
				args += "p0";
			}
			args = toId(args);
			if (args.indexOf("m") > -1) {
				opt = [Number(args.split("d")[0]), Number(args.split("d")[1].split("m")[0]), Number(args.split("m")[1])];
			} else {
				opt = [Number(args.split("d")[0]), Number(args.split("d")[1].split("p")[0]), Number(args.split("p")[1])];
			}
			if (isNaN(opt[0]) || isNaN(opt[1]) || isNaN(opt[2])) return choonbot.sendMessage(message.channel, "??????????????");
			if (opt[0] < 1) return choonbot.sendMessage(message.channel, "i'm pretty sure you can't roll no dice");
			if (opt[0] > 64) return choonbot.sendMessage(message.channel, "how many dice do you need to roll sweet jesus man");
			if (opt[1] < 1) return choonbot.sendMessage(message.channel, "dice can't have no sides try again"); //there ARE actually 1-sided dice.
			if (opt[1] > 144) return choonbot.sendMessage(message.channel, "well, I'm not sure a die with that many sides exists yet...");
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
							str += "` and " + opt[2] + " was added for a total of " + String(tot + opt[2]) + "!";
						} else {
							str += "` and " + opt[2] + " was subtracted for a total of " + String(tot - opt[2]) + "!";
						}
					} else {
						str += ",";
					}
				}
			}
			choonbot.sendMessage(message.channel, str);
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
				ride = rng(2);
				meatloaf += arr[ride][i];
			}
			choonbot.sendMessage(message.channel, meatloaf);
		}
	},
	dome: {
		command: function (message, args) {
			commands.helix.command(message, args, true);
		}
	},
	helix: {
		command: function (message, args, dome) {
			let fossil = (dome) ? "dome" : "helix";
			if (!args || args.length < 1 || !args[0]) return choonbot.sendMessage(message.channel, "you're supposed to say something to the " + fossil + " fossil first");
			if (args[0] === "*") return choonbot.sendMessage(message.channel, "The " + fossil + " fossil says: **why.**");
			if (rng(128) === 127) return choonbot.sendMessage(message.channel, "The " + fossil + " fossil says: **Go ask RoboNitori instead.**");
			let praise = ["It is certain", "It is decidedly so", "Without a doubt", "Yes definitely", "You may rely on it", "As I see it, yes", "Most likely", "Outlook good", "Yes", "Signs point to yes", "Reply hazy try again", "Ask again later", "Better not tell you now", "Cannot predict now", "Concentrate and ask again ", "Don't count on it", "My reply is no", "My sources say no", "Outlook not so good", "Very doubtful", "no.", "START", "A", "B", "UP", "DOWN", "LEFT", "RIGHT", "SELECT"];
			choonbot.sendMessage(message.channel, "The " + fossil + " fossil says: **" + praise[rng(praise.length)] + "**");
		}
	},
	pi: {
		command: function (message, args) {
			commands.pie.command(message, args, true);
		}
	},
	pie: {
		command: function (message, args, math) {
			let sender = message.sender.mention();
			if (math) return choonbot.sendMessage(message.channel, "*throws a mathematical pie at " + sender + "*");
			let pies = ["aloo pie", "apple crisp", "apple pie", "australian and new zealand meat pie", "bacon and egg pie", "bakewell tart", "banana cream pie", "banoffee pie", "bean pie", "bedfordshire clanger", "bisteeya", "blackberry pie", "black bottom pie", "black bun", "blueberry pie", "bob andy pie", "bougasta", "boysenberry pie", "bridie", "buko pie", "bumbleberry pie", "bundevara", "bündner nusstorte", "burek", "butter pie", "butter tart", "buttermilk pie", "canelé", "cantaloupe pie", "caramel tart", "cheesecake", "cheese pie", "cherry pie", "chess pie", "chicken and mushroom pie", "chiffon pie", "chinese pie", "coconut cream pie", "cookie cake pie", "corned beef pie", "cottage pie", "coulibiac", "cumberland pie", "curry pie", "curry puff", "custard tart", "derby pie", "egg tart", "empanda", "fish pie", "flan", "flapper pie", "fried pie", "gibanica", "green grape pie", "homity pie", "hornazo", "jamaican patty", "kalakukko", "karelian pastry", "key lime pie", "khachapurie", "killie pie", "knish", "kuchen", "lemon ice box pie", "lemon meringue pie", "manchester tart", "meat and potato pie", "meat pie", "melton mowbray pork pie", "mince pie", "mississippi mud pie", "natchitoches meat pie", "neapolitan cake pie", "neapolitan pie", "echpochmak", "pastafrola", "pastilla", "pasty", "peach pie", "pear tart", "pecan pie", "pie", "pie a la mode", "pirog", "pirozhki", "pork pie", "pot pie", "pumpkin pie", "qumeshtore me pete", "quiche", "raisin pie", "rappie pie", "raspberry pie", "razzleberry pie", "red velvet cake pie", "red velvet cheesecake pie", "reisen pie", "rhubarb pie", "sambusac", "saskatoonberry pie", "scotch pie", "sea-pie", "sfiha", "shaker lemon pie", "shepherd's pie", "shoofly pie", "soparnik", "southern tomato pie", "spanakopita", "stargazy pie", "steak and kidney pie", "steak pie", "strawberry pie", "strawberry rhubarb pie", "st. stephen's day pie", "sugar pie", "sweet potato pie", "tarta de santiago", "tiropita", "torta capresse", "tourtiére", "treacle tart", "vlaai", "watalappan", "woolton pie", "zelnik"];
			let pie = pies[rng(pies.length)];
			if (pie[0] === "a" || pie[0] === "e" || pie[0] === "i" || pie[0] === "o" || pie[0] === "u") {
				pie = "an " + pie;
			} else {
				pie = "a " + pie;
			}
			choonbot.sendMessage(message.channel, "*throws " + pie + " at " + sender + "*");
		}
	},
	cri: {
		command: function (message, args, ws) {
			let sender = (ws) ? "@Lunar Admiral, Wave_Sine" : message.sender.mention();
			let cri = [";_;", ";_;7", "*cries softly*", "BibleThump", "bibolfamp", ";~;", ";-;", "(;_ʖ;)", "*runs up to " + message.sender.mention() + "'s and cries on their shoulder*", "*sobs*"];
			if (ws) return choonbot.sendMessage(message.channel, wavesine(cri[rng(cri.length)]));
			return choonbot.sendMessage(message.channel, cri[rng(cri.length)]);
		}
	},
	respects: {
		command: function (message, args, ws) {
			if (ws) return choonbot.sendMessage(message.channel, "˙sʇɔǝdsǝɹ ɹıǝɥʇ pıɐd sɐɥ ǝuıS‾ǝʌɐM 'ןɐɹıɯp∀ ɹɐun˥@");
			return choonbot.sendMessage(message.channel, message.sender.mention() + " has paid their respects.");
		}
	},
	pet: {
		command: function (message, args, ws) {
			if (args[0] === "*") return choonbot.sendMessage(message.channel, "I don't want to pet a star...");
			let buffer = [];
			let kek = true;
			let lel = 0;
			while (kek) {
				if (message.mentions[lel]) {
					if (message.mentions[lel].id === selfID) {
						kek = false;
						buffer = [];
					} else if (message.mentions[lel].id === "116652461841711108" && message.mentions[lel].username.toLowerCase().substr(message.mentions[lel].username.length - 6) === "reiuji") { //special case: okuu is being pet
						return choonbot.sendFile(message.channel, "./images/okuu-pet.gif", "okuu-pet.gif")
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
				if (message.channel.server && message.channel.server.id === "161058992699867136") pet = ["*sensually moans*"]; //special case
				if (ws) return choonbot.sendMessage(message.channel, wavesine(pet[rng(pet.length)]));
				return choonbot.sendMessage(message.channel, pet[rng(pet.length)]);
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
		command: function (message, args, ws) {
			if (args[0] === "*") return choonbot.sendMessage(message.channel, "hugging a star would hurt...");
			let buffer = [];
			let kek = true;
			let lel = 0;
			let sender = (ws) ? "@Lunar Admiral, Wave_Sine" : message.sender.mention();
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
				if (ws) return choonbot.sendMessage(message.channel, wavesine(hug[rng(hug.length)]));
				return choonbot.sendMessage(message.channel, hug[rng(hug.length)]);
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
	kiss: { //I was asked to do this okay
		command: function (message, args, ws) {
			if (!message.sender || message.sender.id !== "91184988610895872") return false;
			let sender = message.sender.mention();
			let kiss = ["*blushes*", "*kisses" + sender + " back*", "*moans a bit*", "*kisses " + sender + " back then slaps them*\nD-don't get the wrong idea, it's not that I kissed you because I love you or anything, y-you baka...", "*cute choonbot noises*", "*passionately embraces and kisses" + sender + "*", "*sputters*"];
			choonbot.sendMessage(message.channel, kiss[rng(kiss.length)]);
		}
	},
	succ: {
		command: function (message, args) {
			if (!message.channel.server || message.channel.server.id !== "148262278356008960") return false;
			choonbot.sendMessage(message.channel, "succ");
		}
	},
	/*unspoon: {
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
	},*/
	fork: {
		command: function (message, args) {
			choonbot.sendMessage(message.channel, "ew forks");
		}
	},
	notice: {
		command: function (message, args) {
			if (message.everyoneMentioned) return choonbot.reply(message, "NICE TRY, NERD");
			if (args[0] === "*") return choonbot.sendMessage(message.channel, "can't notice stars sorry");
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
			choonbot.sendMessage(message.channel, hmm[rng(hmm.length)]);
		}
	},
	meme: { //PogChamp
		isSpam: true,
		command: function (message, args) {
			if (args[0]) {
				if (args[0] === "*") return choonbot.sendMessage(message.channel, "here's a * for you: ( ° ͜ʖ͡°)╭∩╮");
				let arg = toId(args[0]);
				if (arg === "dank") { //dank placeholder
					return choonbot.sendMessage(message.channel, "dank meme");
				} else if (arg === "monocle") {
					return choonbot.sendMessage(message.channel, "(╭ರ_⊙)");
				} else if (arg === "lenny") {
					let lenny = ["( ͡° ͜ʖ ͡°)", "( ͠° ͟ʖ ͡°)", "ᕦ( ͡° ͜ʖ ͡°)ᕤ", "( ͡~ ͜ʖ ͡°)", "( ͡o ͜ʖ ͡o)", "͡° ͜ʖ ͡ -", "( ͡͡ ° ͜ ʖ ͡ °)", "( ͡ ͡° ͡°  ʖ ͡° ͡°)", "(ง ͠° ͟ل͜ ͡°)ง", "( ͡° ͜ʖ ͡ °)", "(ʖ ͜° ͜ʖ)", "[ ͡° ͜ʖ ͡°]", "( ͡o ͜ʖ ͡o)", "{ ͡• ͜ʖ ͡•}", "( ͡° ͜V ͡°)", "( ͡^ ͜ʖ ͡^)", "( ‾ʖ̫‾)", "( ͡°╭͜ʖ╮͡° )", "ᕦ( ͡°╭͜ʖ╮͡° )ᕤ", "─=≡Σᕕ( ͡° ͜ʖ ͡°)ᕗ"];
					return choonbot.sendMessage(message.channel, lenny[rng(lenny.length)]);
				} else if (arg === "xd") {
					let xd = ["xd", "Xd", "xD", "XD"];
					return choonbot.sendMessage(message.channel, xd[rng(xd.length)]);
				} else if (arg === ":^)") {
					return choonbot.sendMessage(message.channel, ':^)');
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
			choonbot.sendMessage(message.channel, DONGER);
		}
	}
};
exports.emotes = {
	boo: {
		emote: "./images/kogamy.png",
		name: "boo.png"
	},
	denko: {
		emote: "./images/denko.jpg",
		name: "denko.jpg"
	},
	hinaface: {
		emote: "./images/hinaface.png",
		name: "hinaface.png"
	},
	kogamy: {
		emote: "./images/kogamy.png",
		name: "kogamy.png"
	},
	lewd: {
		emote: "./images/lewd.gif",
		name: "lewd.gif"
	},
	mg: {
		emote: "./images/mg.jpg",
		name: "mg.jpg"
	},
	mok: {
		emote: "./images/mokay.jpg",
		name: "mok.jpg"
	},
	mokay: {
		emote: "./images/mokay.jpg",
		name: "mokay.jpg"
	},
	reisenbox: {
		rng: [90, 10],
		emote: ["./images/reisenbox.png", "./images/spoonsreisen.png"],
		name: ["reisenbox.png", "spoonsreisen.png"]
	},
	reisenfacev: {
		emote: "./images/reisenfacev.png",
		name: "reisenfacev.png"
	},
	reisenfloof: {
		emote: "./images/reisenfloof.png",
		name: "reisenfloof.png"
	},
	reisenwut: {
		emote: "./images/reisenwut.jpg",
		name: "reisenwut.jpg"
	},
	shoutime: {
		emote: "./images/shoutime.png",
		name: "shoutime.png"
	},
	unyu: {
		emote: "./images/unyu.png",
		name: "unyu.png"
	}
};