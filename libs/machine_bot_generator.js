var config  =  require('../config.js');
var IpTools = require('../libs/ip_tools.js');
var generate_ip = new IpTools(config.bot.ip_ranges).generate_ip;
MachineBotGenerator = function(){
	this.generateBots = function(){
		var machineBots = new Map();
		for (var tier of config.bot.tiers) {
			for (var i = tier.bots - 1; i >= 0; i--) {
				var bot = {
					balance: valueGenerator(tier.money_range.initial, tier.money_range.final),
					firewall: valueGenerator(tier.software_range.initial, tier.software_range.final),
					scan: valueGenerator(tier.software_range.initial, tier.software_range.final),
					sdk: valueGenerator(tier.software_range.initial, tier.software_range.final),
					antivirus: valueGenerator(tier.software_range.initial, tier.software_range.final),
					proxy_tunel: valueGenerator(tier.software_range.initial, tier.software_range.final),
					spam: valueGenerator(tier.software_range.initial, tier.software_range.final),
					spyware: valueGenerator(tier.software_range.initial, tier.software_range.final)
				};
				var generated_id = generate_ip();
				while(machineBots.has(generated_id)){
					generated_id = generate_ip();
				}
				machineBots.set(generated_id, bot);
			}
		}
		var new_array = Array.from(machineBots);
		var fs = require('fs');
		fs.writeFile("./bots", JSON.stringify(new_array), function(err) {
		    if(err) {
		        return console.log(err);
		    }

		    console.log("The file was saved!");
		}); 
		global.machineBots = machineBots;
	}
	function valueGenerator(initial, final){
		return (Math.floor(Math.random() * final) + initial);
	}
}
module.exports = new MachineBotGenerator();