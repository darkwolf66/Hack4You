var nodemailer = require('nodemailer');
var config	   = require('../config.js');
var email = config.email;

var MailSender = function() {
	var transporter = nodemailer.createTransport(config.email.smtp);
	var sender = email.sender;

	this.sendMail = function(to, body){
		var mailOptions = {
		    from: '"'+sender.name+'" <'+sender.email+'>', // sender address
		    to: to, // list of receivers
		    subject: body.subject, // Subject line
		    html: body.content // html body
		};
		transporter.sendMail(mailOptions, (error, info) => {
		    if (error) {
		        return console.log(error);
		    }else{
			    console.log('Message %s sent: %s', info.messageId, info.response);
		    }
		});
	}
}


module.exports = MailSender;