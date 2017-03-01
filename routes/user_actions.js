var lang = require('../lang.js');
var config  =  require('../config.js');
var fieldValidator = require('../libs/field_validator');
var microtime = require('microtime');
var crypto = require('crypto');
//Presets
var lang = new lang();
var rlang = lang.returnMessage;
var rmlang = lang.returnMail;

var fieldValidator = new fieldValidator();
var moment = require('moment');

var MailSender = require('../libs/mail_sender.js');
var mailSender = new MailSender();

var mysqlQueryList = require('../libs/mysql_query_list.js');
var getQuery = mysqlQueryList.getQuery;

//Ip Tools
var IpTools = require('../libs/ip_tools.js');
var generate_ip = new IpTools(config.bot.ip_ranges).generate_ip;

module.exports = function(app, my){
	//Primeiro os registros
	///	Account Register
	////
    app.post('/api/user/register', function(req, res){
    	if(!req.body.lang){
    		return res.send({"status": "error", "code":1 ,"message": 'Blank Language'});
    	}else{
            var lang = req.body.lang;
        }
        if(!req.body.recode){
    		return res.send(rlang(lang, 4));
    	}else if(!req.body.username){
    		return res.send(rlang(lang, 1));
    	}else if(!req.body.password){
    		return res.send(rlang(lang, 3));
    	}else if(!req.body.email){
    		return res.send(rlang(lang, 5));
    	}else if(req.body.reemail != req.body.email){
            return res.send(rlang(lang, 6));
        }
        
        if(!fieldValidator.username.isValid(req.body.username)){
           return res.send(rlang(lang, 9));
        }else if(!fieldValidator.email.isValid(req.body.email)){
           return res.send(rlang(lang, 7));
        }else if(!fieldValidator.password.isValid(req.body.password)){
           return res.send(rlang(lang, 8));
        }

        var ip = generate_ip();
        var salt = crypto.createHash('sha256').update(microtime.now()+req.body.username).digest("hex");
        var password = crypto.createHash('sha512').update(salt+req.body.password).digest("hex");

        var user = {
            username: req.body.username,
            email: req.body.email,
            password: password,
            salt: salt,
            token_expiration: microtime.now(),
            money: config.default_bonus.money,
            hcoins: config.default_bonus.hcoins,
            register_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            offline_mode_expiration: 0
        };

        //Check if machine ip exists and generate another one
        check_ip_status(my, ip);

        //Add new user to mysql
        my.beginTransaction(function(err) {
          if (err) { res.send(rlang(lang, 12)); }

          my.query(getQuery(2), user, function(err, result) {
            if (err) { 
              my.rollback(function() {
                return res.send(rlang(lang, 12));
              });
            }else{
                var machine = {
                    ip: ip,
                    id_user: result.insertId
                };
                
                my.query(getQuery(3), machine, function(err, result) {
                  if (err) { 
                    my.rollback(function() {
                      return res.send(rlang(lang, 12));
                    });
                  }  
                  my.commit(function(err) {
                    if (err) { 
                      my.rollback(function() {
                        return res.send(rlang(lang, 12));
                      });
                    }
                    res.send(rlang(lang, 11));
                    mailSender.sendMail(user.email, rmlang(lang, 1));
                    my.end();
                  });
                });
            }
          });

        });
    });
    app.post('/api/user/login', function(req, res){
        if(!req.body.lang){
            return res.send({"status": "error", "code":1 ,"message": 'Blank Language'});
        }else{
            var lang = req.body.lang;
        }
        if(!req.body.recode){
            return res.send(rlang(lang, 4));
        }else if(!req.body.user){
            return res.send(rlang(lang, 1));
        }else if(!req.body.password){
            return res.send(rlang(lang, 3));
        }
        var user;
        if(fieldValidator.email.isValid(req.body.user)){
            user = {
                email: req.body.user
            }
        }else{
            user = {
                username: req.body.user
            }
        }

        my.query(getQuery(4), user, function (error, result, fields) {
            if (error || result.lenght <= 0) {
                return res.send({"status": "error", "code":13 ,"message": rlang(lang, 13)});
            }else{
                result = result[0];
                user.password = req.body.password;
                if(result.password != crypto.createHash('sha512').update(result.salt+user.password).digest("hex")){
                    return res.send({"status": "error", "code":14 ,"message": rlang(lang, 14)});
                }else{
                    //Gerar token e tempo
                    result.token = crypto.createHash('sha256').update(microtime.now()+user.username).digest("hex");
                    result.token_expiration = microtime.now()+config.expiration.login;
                    result.actions = 0;
                    result.minute_actions = 0;
                    //Adicionar a lista de users online
                    global.loggedUsers.set(result.token, result);
                    return res.send({"status": "success", "code":80001 ,"token": result.token});
                }
            }
        });
    });
    app.post('/api/user/balance', function(req, res){
        if(!req.body.lang){
            return res.send({"status": "error", "code":1 ,"message": 'Blank Language'});
        }else{
            var lang = req.body.lang;
        }
        var rsp = global.userManager.checkUserLogin(req.body.token, res, lang);
        if(rsp == 'exit'){
            return false;
        }
        if(req.body.token && rsp){
            my.query(getQuery(5), global.loggedUsers.get(req.body.token).id_user, function (error, result, fields) {
                if (error) {
                    console.log(error);
                    return res.send(rlang(lang, 15));
                }else{
                    money = result[0].money;
                    return res.send({"status": "success", "balance": money});
                }
            });
        }else{
            return res.send(rlang(lang, 16));
        }
    });
    app.post('/api/user/machines', function(req, res){
        if(!req.body.lang){
            return res.send({"status": "error", "code":1 ,"message": 'Blank Language'});
        }else{
            var lang = req.body.lang;
        }
        var rsp = global.userManager.checkUserLogin(req.body.token, res, lang);
        if(rsp == 'exit'){
            return false;
        }
        if(req.body.token && rsp){
            my.query(getQuery(6), global.loggedUsers.get(req.body.token).id_user, function (error, result, fields) {
                if (error) {
                    console.log(error);
                    return res.send(rlang(lang, 15));
                }else{
                    return res.send({"status": "success", "machines": result});
                }
            });
        }else{
            return res.send(rlang(lang, 16));
        }
    });
}

// Checa o status de um ip até estar certo
function check_ip_status(my, ip){
    my.query(getQuery(7), ip, function (error, result, fields) {
        if (error) {
            return res.send(rlang(lang, 10));
        }else{
            if(result.lenght > 0){
                ip = generate_ip();
                check_ip_status(ip);
            }
        };

    });
}
//id_user, username, salt, password, email, avatar_url, 4h_coins, money, last_login, register_date, token, token_expiration, reputation, actions, email_verify, modo_offline_expiration