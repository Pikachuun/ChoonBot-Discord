'use strict';

//Configuration. Note that these are globals!

//I like these people the most [use ids]!
exports.whitelist = {"118433433960710152":1};
//And these people should die.
exports.blacklist = {};
//And this is me.
exports.selfID = "136970101512470528";

//Want me to be more eloquent?
exports.verbose = false;

//These rooms we don't like spam in...
exports.noSpam = {};
//We can do whatever we want here.
exports.absoluteChannel = {"120242878738989056":1};
//We can only post hmms here.
exports.onlyHmm = {"129117205156724736":1};
//And these rooms we should just avoid.
exports.antipost = {};
//Server that we should avoid except for specific channels:
exports.serverCrosstalk = {"126454235515715584":["139023144387084288", "128736425159032832"]};

//I use these!
exports.cmdS = ["('.w.') ", "*"]; //Command symbols. Put one of these before the command!
exports.emtS = [":", ":"]; //Emote symbols. Format: [start, end].

//And my login credentials are...
exports.EMAIL = "choonbot@gmail.com";
exports.PASSW = "Sphirah02Binah";