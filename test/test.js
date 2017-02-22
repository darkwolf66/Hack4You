var assert = require('assert');
var config = require('../config.js');

// Test ip_tools
//var generate_ip = require('../libs/ip_tools.js')(config.bot.ip_ranges).generate_ip;

describe('IpTools', function() {
  var IpTools = require('../libs/ip_tools.js');
  describe('#generate_ip()', function() {
  	var generate_ip = new IpTools(config.bot.ip_ranges).generate_ip;
    it('should return generated ip', function() {
    	var regex = new RegExp("^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$", "g");
        assert.ok(regex.test(generate_ip(config.bot.ip_ranges)));
    });
  });
});
describe('MachineBotGenerator', function() {
  var machineBotGenerator = require('../libs/machine_bot_generator.js');
  describe('#generateBots()', function() {
    it('should be bigger than 0', function() {
    	machineBotGenerator.generateBots();
        assert.ok(global.machineBots.size);
    });
  });
});