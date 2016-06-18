'use strict';

exports.config = {

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////     Important  Options     //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

							//User Token
token: 						"",
							//The bot's token. It needs this to log in.
	
							//Verbose Switch
verbose: 					false,
							//Should we print more stuff to the console?
	
							//Command Symbols
cmdsymb: 					[""],
							//Put one of these at the start of a message to send it.

							//Emote Symbols
emtsymb: 					["", ""],
							//Put the first one in before, and the second one after an emote to parse it.

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////         Whitelists         //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
whitelist: {
							//User Whitelist
users: 						[""],
							//Users that can use all of the bot's features.
							
							//Channel Whitelist
channels: 					[""],
							//Channels that all of the bot's features can be used in, regardless of user [except for blacklisted ones].

							//Server Whitelist
servers: 					[""],
							//Servers that all of the bot's features can be used in, regardless of user [except for blacklisted ones].
},

///////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////         Blacklists         //////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
blacklist: {
							//User Blacklist
users: 						[""],
							//Users that cannot use the bot at all.
							
							//Channel Blacklist
channels: 					[""],
							//Channels that the bot cannot be used in, except if the user is whitelisted.

							//Server Blacklist
servers: 					[""],
							//Servers that the bot cannot be used in, except if the user is whitelisted.
},

///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////         Miscellaneous Config         /////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

							//Channel Graylist
graylist: 					[""],
							//Channels that the bot can be used in, even if the server is blacklisted.

							//Channel Spamlist
spamlist: 					[""],
							//Channels that spammy commands for the bot cannot be used in.

							//Channel Non-Command Banlist
forcecmd: 					[""],
							//Channels that non-command/emotes things cannot be used in.

							//Channel Emote Banlist
noemotes: 					[""],
							//Channels that emotes are banned in.

///////////////////////////////////////////////////////////////////////////////////////////////
};