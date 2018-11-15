/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const passport		= require('passport'),
	  bcrypt		= require('bcrypt-nodejs');

var datetime 		= require('node-datetime');
var crypto 			= require('crypto');

var qr 				= require('qr-image');
var algorithm   	= 'aes-256-ctr';
var	password    	= 'd6F3Efeq';  
var ENCRYPTION_KEY 	= password + password + password + password; // Must be 256 bytes (32 characters)
var IV_LENGTH 		= 16; // For AES, this is always 16
var moment = require('moment')
let iv				= crypto.randomBytes(IV_LENGTH);

module.exports = {
	
	load_more_feeds(req,res){
		var self = this;
		FeedService.allfeedlist(req).then(function(feeds){
			if(feeds.feeds.length == 0){
				return res.json({feeds:false});
			}
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				return res.render('ajax/load_more_feed',{
					feeds:feeds.feeds,
					likedFeed: feeds.likedFeed,
					userData:userInfo
				});
			});
		});
	},

	pendingrecives : function(req, res) {
		var user_id = req.user.id;
		return new Promise(function (fulfill, reject){
			UserConnection.find({to_user_id: user_id,status:'0' }).exec(function(err, pendingrecusers){
				pending_rec_ids = [];
				pendingrecusers.forEach(function(factor, index){
					pending_rec_ids.push(factor.user_id);
				});
				Users.find({id: {"$in" : pending_rec_ids}}).populate('company_id',{select:['company_name','slug']}).populate('userexperiences',{limit:1,select:['title','company_name'],sort:'current_work DESC'}).exec(function(err, pendingrecives){
					if (err){
						reject(err);
					} else {
						fulfill(pendingrecives);
					}
				})
			});
		});
	},

	/**
	* `AuthController.login()`
	*/
    login : function (req, res) {

		if (req.user) {
			var self = this;
			FeedService.allfeedlist(req).then(function(feeds){
				UserConnectionService.getRequestReceived(req.user.id,1).then(function(pendingrecives){
					UserConnectionService.getPeopleYouKnow(req.user.id,1,5).then(function(peopleyouknow){
						UserConnectionService.getCompanyYouFollow(req.user.id,1,5).then(function(companyyoufollow){
							UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
								UserContactVerifyData.findOne({user_id: req.user.id}).exec(function (err, verifyData) {
									Country_Dial_Code.find({select:['dial_code','name']}).exec(function (err, dial_code) {
										// return res.json(userInfo);
										return res.view('dashboard', { 
											status: 'OK', 
											title: 'Lynking World Through Blockchain | Lynked.World',
											keywords:'Trusted & Verified Professional Network, Simplifying Identity Through Blockchain, A Secure and Trusted Digital Identity for Everyone',
											feeds: feeds.feeds,
											likedFeed: feeds.likedFeed,
											meta_description : 'Lynked.World is a platform built upon Blockchain Technology to verify digital identity, education and professional experience. Blockchain security provides an irrefutable digitally verified block of information that is never compromised. The platform enables users to control their digital information and share directly with employers, institutions & businesses. We are moving towards a global platform that not only serves the purpose of digitalizing identities but will also become a network of trusted professionals.',
											totalfeeds: feeds.totalfeeds,
											userverify:verifyData,
											dial_code:dial_code,
											peopleyouknow: peopleyouknow.peopleyouknow,
											companyyoufollow: companyyoufollow.companyyoufollow,
											pendingrecives: pendingrecives.requestreceived,
											userData:userInfo
										});
									});
								});
							});
						});
					});
				});
			});
		} else {
			return res.view('Auth/login-withoutForm', { 
				status: 'OK', 
				//title: 'Verified and Trusted Professional Network!', 
				title:'Lynking World Through Blockchain | Lynked.World',
				keywords:'Trusted & Verified Professional Network, Simplifying Identity Through Blockchain, A Secure and Trusted Digital Identity for Everyone',
				layout: 'layouts/loginLayout'
			});
		}
    },
	
	devloginonly:function(req, res){
		return res.view('Auth/login', { 
			status: 'OK', 
			//title: 'Verified and Trusted Professional Network!', 
			title:'Lynking World Through Blockchain | Lynked.World',
			keywords:'Trusted & Verified Professional Network, Simplifying Identity Through Blockchain, A Secure and Trusted Digital Identity for Everyone',
			layout: 'layouts/loginLayout'
		});
    },
	
	qr_code:function(req, res){		
		
		var socket_id 	= req.param('socket_id');
		var dt 			= datetime.create();
		var formatted 	= dt.format('mdYHMS');
		var qr_data 	= socket_id+":"+formatted;
		if(req.param('socket_type') != undefined && req.param('socket_type')!=''){
			qr_data = qr_data + ':' + req.param('socket_type');
		}
		if(req.param('user_id') != undefined && req.param('user_id')!=''){
			qr_data = qr_data + ':' + req.param('user_id');
		}
		let cipher = crypto.createCipheriv(algorithm, new Buffer(ENCRYPTION_KEY), iv);
		var crypted = cipher.update(qr_data,'utf8','hex');			

		var svg_string = qr.imageSync(crypted, { type: 'svg' });
		return res.json({'qr':svg_string});
	},
	socket_io_server : function(req, res){
		var app = require('express')();
		var http = require('http').Server(app);
		var io = require('socket.io')(http);
		var app_res = res;
		var locals = {"data":'come'};

		io.on('connection', function (socket){
		  console.log(socket.id);''
		   socket.on('CH01', function (from, msg) {
		     Users.findOne({id:from}).exec(function(err, _user){
		     io.to(msg).emit('received_p_msg',{"user_id" : from,"user_req":{'loginid':_user.loginid,'password':_user.password}});
			});
		     socket.disconnect();
		   });  
		});
		http.listen(3000,function () {     
		  console.log('listening on *:3000');

		   return res.json({});      
		});
	},
	login_with_id:function(req, res){
		user_id = req.param("user_id");
		passport.authenticate('local', function(err, users, info){
			if((err) || (!users)) {
				return res.json({ message: info.message, users });
			}
			req.logIn(users, function(err) {
				if(err) res.json(err);
				return res.json({
					message: info.message,
					users
				});
			});
		})(req, res);
	},
	login_with_qr : function(req, res){
	    var io = require('socket.io-client');
	    var socket = io.connect(sails.config.appUrl+':'+sails.config.portSoketIo, {reconnect: true});
	    
		let decipher = crypto.createDecipheriv(algorithm, new Buffer(ENCRYPTION_KEY), iv);
		
		var dec = decipher.update(req.param('socket_id'),'hex','utf8')
		
		var split_data = dec.split(':',4);
		socket_id = split_data[0];
		var type = '';
		var user_id = ''; 
		if(split_data[2] != undefined && split_data[2] != '') {
			type = split_data[2];
		}
		if(split_data[3] != undefined && split_data[3] != '') {
			user_id = split_data[3];
		}
	    socket.on('connect', function () {	      
	      var msg = 'come from clitent to server';
	    });

	    Users.findOne({id:req.param('user_id')}).exec(function(err, _user){
			if(typeof _user != 'undefined' && typeof _user.loginid != 'undefined') {
				if(type == 'get_verified'){
					if(_user.id == user_id){
						socket.emit('CH01', {'user_id':req.param('user_id'),type:type}, socket_id);
						return res.json({'status':true,'msg':'login successfully for get verified!','data':{}});						
					} else {
						return res.json({'status':false,'msg':'Invalid user!','data':{}});	
					}
				} else if(type == 'forgot_password') {
					socket.emit('CH01', {'user_id':req.param('user_id'),type:type}, socket_id);					
					return res.json({'status':true,'msg':'Please enter new password on web!','data':{}});					
				} else {
					socket.emit('CH01', {'user_id':req.param('user_id'),type:type}, socket_id);					
					return res.json({'status':true,'msg':'Web login successfully done!','data':{}});
				}
			} else {
				return res.json({'status':false,'msg':'No user found','data':{}});
			}
		});
		
	},

    AttemptLogin : function (req, res) {

		passport.authenticate('local', function(err, users, info){

			if((err) || (!users)) {
				return res.json({ status:'Error', message: info['message'], users });
			}
			req.logIn(users, function(err) {
				if(err) res.json(err);
				//console.log(req.user);
				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'auth',
					action: 'login',
					type: 'web'
				});
				return res.json({
					status: "OK",
					message: info['message'],
					users
				});
			});
		})(req, res);
    },

	AttemptQRLogin: function(req,res){
		passport.authenticate('local', function(err, users, info){
			if((err) || (!users)) {
				return res.json({ message: info.message, users });
			}
			req.logIn(users, function(err) {
				if(err) res.json(err);
				return res.json({
					message: info.message,
					users
				});
			});
		})(req, res);
	},	
	
	/**
	* `AuthController.logout()`
	*/
	logout: function(req, res) {
		/* Activity Log Insert */
		ActivityLogsService.addActivityLog({
			owner_id: req.user.id,
			module: 'auth',
			action: 'logout',
			type: 'web'
		});
		req.logout();

		req.session.last_login_id = '';

		res.redirect('/');
	},

	logoutFromAll: function(req, res) {
		if(typeof req.user!='undefined' && req.user!=''){
			Users.findOne({id:req.user.id}).exec(function(err,data){
				if(data.password!=req.user.password){
					return res.json({
						status:"Error",
						message:"Need to re-login"
					});
				}
				return res.json({
					status:"OK",
					message:"No need to redirect"
				});
			});
		}else{
			return res.json({
				status:"OK",
				message:"No need to redirect"
			});			
		}
	},

	testdata:function(req, res){
		// return res.json(req.session);
		var condition = {
			is_organized:1,
			'companydata':{
				id : {
					"$exists" : true,
					"$ne" : ""
				}
			}
		};

		Companies.find(condition).populate("companydata").exec(function(err,_companies){
			var members = [];
			_companies.forEach(function(_company, index){
				var _companyMember = {
					company_id:_company.id,
					user_id:_company.companydata[0].parent_id,
					allow_verify:1,
					allow_job_post:1,
					user_admin:1,
					super_user:1,
					download:1,
					is_mainuser:1,
					status:1
				};
				CompanyTeamMembers.find({company_id:_company.id,user_id:_company.companydata[0].parent_id}).exec(function(err,count){
					if(count.length==0){
						CompanyTeamMembers.create(_companyMember).exec(function(err,_mainUser){
							members.push(_mainUser.id);
						});
					}else{
						if(count.is_mainuser){

						}else{
							var _updcompanyMember = {
								allow_verify:1,
								allow_job_post:1,
								user_admin:1,
								super_user:1,
								download:1,
								is_mainuser:1,
								status:1
							};
							CompanyTeamMembers.update({id:count[0].id},_updcompanyMember).exec(function(err,sa){

							});
						}
					}
				});
            });
			return res.json({status:"Done"});
		});
	},

	fetch_url:function(req, res){

		var http = require("http");
		var https = require("https");
		var getMeta = require("lets-get-meta")

		var url = req.param("feed_details").trim();
		var array = url.split("//");
		var urlPrefix = url.match(/.*?:\/\//g);
		req.query.url = url.replace(/.*?:\/\//g, "");
		
		var options = {
			host: array[1].replace(/\/$/, ""),
		    path: '/'
		};


		if(urlPrefix !== undefined && urlPrefix !== null && urlPrefix[0] === "https://") {
		    https.get(options, function(result) {
		        processResponse(result);
		    }).on('error', function(e) {
		        res.send({message: e.message});
		    });
		} else {
		    http.get(options, function(result) {
		        processResponse(result);
		    }).on('error', function(e) {
		        res.send({message: e.message});
		    });
		}

		var processResponse = function(result) {
		    var data = "";
		    result.on("data", function(chunk) {
		        data += chunk;
		    });
		    result.on("end", function(chunk) {
		    	return res.render('linkFormat',{
		    		website: url,
		    		data: getMeta(data)
		    	});
		    });
		}
	}
};

