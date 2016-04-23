'use strict';

//Configuration. Note that these are globals!

//I like these people the most [use ids]!
exports.whitelist = {};
//And these people should die.
exports.blacklist = {};
//And this is me.
exports.selfID = "";

//Want me to be more eloquent?
exports.verbose = false;

//These rooms we don't like spam in...
exports.noSpam = {};
//We can do whatever we want here.
exports.absoluteChannel = {};
//We can only post hmms here.
exports.onlyHmm = {};
//And these rooms we should just avoid.
exports.antipost = {};
//Server that we should avoid except for specific channels:
exports.serverCrosstalk = {};

//I use these!
exports.cmdS = []; //Command symbols. Put one of these before the command!
exports.emtS = ["", ""]; //Emote symbols. Format: [start, end].

//And my login credentials are...
exports.TOKEN = "";