var config = {
	title: "Hack4You",
	main_url: '127.0.0.1:',
	port: 9304
};
config.expiration = {
	login: 1800000000,
	actions: 50,
	minute_actions: 5
}
config.tasks = {
	actions_check: 5000, //Default per minute - Value in milliseconds
	userlist_check: 10000 //Default every 30 minutes - Value in milliseconds
}
config.default_bonus = {
	money: 100,
	hcoins: 0
}
config.mysql = {
	host: "127.0.0.1", 
	user: "root",
	password: "123",
	database: "hack4you"
};

config.email = {
	smtp: {
	    host: 'smtp.gmail.com',
	    port: 587,
	    secure: false, // upgrade later with STARTTLS
	    auth: {
	        user: 'test',
	        pass: 'test'
	    }
	},
	sender: {
		name: 'Hack4You',
		email: 'will.moraes.96@gmail.com'
	}
}

module.exports = config;