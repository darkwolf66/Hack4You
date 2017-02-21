var config = {
	title: "Hack4You",
	main_url: '127.0.0.1:',
	port: 9304
};
config.expiration = {
	login: 1800000000
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
	        user: 'user@gmail.com',
	        pass: 'pass'
	    }
	},
	sender: {
		name: 'Hack4You',
		email: ''
	}
}

module.exports = config;