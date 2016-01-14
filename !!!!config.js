'use strict';

//Configuration. Note that these are globals!

//I like these people the most [use ids]!
exports.whitelist = {"118433433960710152":1};
//And these people should die.
exports.blacklist = {};
//And this is me.
exports.selfID = "136970101512470528";

//Want me to be more eloquent?
exports.verbose = true;

//These rooms we don't like spam in...
exports.noSpam = {};
//We can only post hmms here.
exports.onlyHmm = {"129117205156724736":1};
//And these rooms we should just avoid.
exports.antipost = {};

//I use these!
exports.cmdS = ["('.w.') ", "*"]; //Command symbols. Put one of these before the command!
exports.emtS = [":", ":"]; //Emote symbols. Format: [start, end].