/**
 * MessagesController
 *
 * @description :: Server-side logic for managing messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var moment = require("moment");
module.exports = {

	myconnections: function(req, res) {
		var user_id = req.user.id;
		//console.log(user_id);
		return new Promise(function (fulfill, reject){
			UserConnection.find({user_id : user_id, status:'1'}).exec(function(err, result){
				UserConnection.find({to_user_id : user_id, status:'1'}).exec(function(err, result2){
					array = [];
					array1 = [];
					result.forEach(function(factor, index){
						array.push(factor.to_user_id);
					});
					result2.forEach(function(factor, index){
						array1.push(factor.user_id);
					});

					var connection_ids = array.concat(array1);
					Users.find({id: connection_ids}).exec(function(error,user){
						fulfill(user);
					});
				});
			});
		});
	},

	index: function(req,res){
		var self = this;
		var user_id = req.user.id;
		var to_user_id = '';
		var to_user_name = '';
		var app = require('express')();
		var http = require('http').Server(app);
		var io = require('socket.io')(http);
		var port = process.env.PORT || 3000;

		io.on('connection', function (socket){
			//console.log("++++++++++");
			//console.log("HELLO");
			//console.log("++++++++++");
		});
		var page_no = req.param("page_no") != undefined ? req.param("page_no") : 1;
		
		self.myconnections(req).then(function(data){
			var filter = { "$or" : [ { "user_id" : user_id }, { "to_user_id" : user_id } ] };
			Messages.find({ "$or" : [ {user_id : user_id}, { to_user_id : user_id }] })
				.populate('user_id', { select: ['name', 'id', 'slug', 'profile_image'] })
				.populate('to_user_id', { select: ['name', 'id', 'slug', 'profile_image'] })
				.populate('conversions',{ limit: 1, sort: 'createdAt DESC'})
				.sort("updatedAt DESC")
				.paginate({page: page_no, limit: 2})
				.exec(function(err,conversions){
					//return res.json(conversions);
					data = {
						title: 'Messages',
						connections:data,
						userData:'',
						messages:conversions,
						to_user_id :to_user_id,
						user : []
					};
					if (req.xhr) {
						for(i=0;i<conversions.length;i++){
							if(conversions[i].conversions.length > 0){
								conversions[i].conversions[0]['time'] =  DateDifferentService.time_ago(conversions[i].conversions[0].createdAt);
							}
						}
						return res.json(conversions);
					} else {
						if(req.param("slug") != undefined){
							slug = req.param("slug");
							UserDataService.UserDetails(req.user.id).then(function(userInfo){	
								Users.findOne({slug : slug}).exec(function(err,user){
									if(user){
										data.to_user_id = user.id;
										data.userData = userInfo;
										data.user = user;
										return res.view("message/index",data);
									} else {
										return res.redirect("/messages");
									}
								});
							});
						} else {
							UserDataService.UserDetails(req.user.id).then(function(userInfo){	
								data.userData = userInfo;
								return res.view("message/index",data);
							});
						}
					}
			});
		});
	},

	create: function(req,res){
		var user_id = req.user.id;
		var to_users = req.param("to_user_id");

		_newmessage = {
			user_id: user_id,
			to_user_id: to_users
		};

		var filter = {"$or" : [ { "$and" : [{ "user_id" : user_id }, { "to_user_id" : to_users } ] }, { "$and" : [ { "user_id" :  to_users, "to_user_id":user_id } ] } ] };

		Messages.find(filter).exec(function(err,_message){
			if(_message.length > 0){
				// Create New Chat
				var _newchat = {
					message_id:_message[0].id,
					user_id:user_id,
					message:req.param("message"),
					read :0 
				};
				Messages.update(_message[0].id,{status:'1'}).exec(function(err,_message){
					Chat.create(_newchat).exec(function(err,_chat){
						Chat.findOne({'id':_chat.id}).populate('user_id').exec(function(err,chat){
							var profile_image = '/themes/frontend/images/default-user.png';
							if(chat.user_id.profile_image != undefined && chat.user_id.profile_image &&  chat.user_id.profile_image!=''){
								profile_image = '/uploads/users/'+chat.user_id.profile_image;
							}
							html = '';
							html += '<div data-id="'+_chat.id+'" user_id="'+user_id+'" class="p26_m1000_li">'
								html += '<a class="p26_m1001" href="'+sails.config.appUrlwPort+'/profile/'+chat.user_id.slug+'"><img src="'+profile_image+'" alt="'+chat.user_id.name+'" height="20" width="20" /></a>';
								html += '<div class="p26_m1002">';
										html += '<div class="p26_m1005"><i class="fa fa-clock-o" aria-hidden="true"></i> <span class="p26_m1006"title="'+moment(chat.createdAt).format('Do MMM, YYYY')+'">'+moment(chat.createdAt).format('H:mm') +'</span></div>';
									html += '<div class="p26_m1003">'+chat.message+'</div>';
									
								html += '</div>';
							html += '</div>';
							if (req.xhr) {
								return res.json({
									status    	: "OK",
									view	  	: html,
									chat	  	: chat
								});
							} 
						});
					});
				});
			}else{
				// Create New Message
				Messages.create(_newmessage).exec(function(err,_message){
					// Create New Chat
					var _newchat = {
						message_id:_message.id,
						user_id:user_id,
						message:req.param("message")
					};
					Chat.create(_newchat).exec(function(err,_chat) {
						if (req.xhr) {
							return res.json({
								status    	: "OK",
								redirect_url: '/messages'});
						}
					});
				});
			}
		});
		//return res.redirect("/messages");
	},

	getconversion: function(req,res) {		
		var page_no = (req.param("page_no") != undefined) ? req.param("page_no") : 1;
		Messages.find({id:req.param("message_id")})
			.populate('user_id', { select: ['name', 'id', 'slug', 'profile_image'] })
			.populate('to_user_id', { select: ['name', 'id', 'slug', 'profile_image'] })
			
			.exec(function(err,chatdata){

				Chat.find({'$or':[{'block_user' : 
					{"$exists" : false}
					},{user_id :req.user.id}],message_id : req.param("message_id")})
					.populate('user_id', { select: ['name', 'id', 'slug', 'profile_image'] })
					.paginate({page:page_no , limit: 100})
					.exec(function(err,chatdata_convarsation) {

					if(chatdata.length == 0){
						return res.json({
							status    	: "OK",
							view	  	: '',
							socket_id 	: '',
							to_user_id 	: '',
							chat_count  : 0
						});
					}
					if(req.user.id == chatdata[0]['user_id']['id']){
						user_id 	= chatdata[0]['to_user_id']['id'];
						to_user_id 	= chatdata[0]['user_id']['id'];
					} else {
						user_id 	= chatdata[0]['user_id']['id'];
						to_user_id 	= chatdata[0]['to_user_id']['id'];
					}
					socket_id 	= req.param("socket_id");
					
					Users.findOne({id:to_user_id}).exec(function afterwards(err, to_user_list){
						var update_read_status = [];
						var html = "";
						chatdata.forEach(function(conversion, index){

						if(conversion.user_id.id == req.user.id){
							username = conversion.to_user_id.name;
							username_slug = conversion.to_user_id.slug;
							to_user_id = conversion.to_user_id.id;
						}else{
							username = conversion.user_id.name;
							username_slug = conversion.user_id.slug;
							to_user_id = conversion.user_id.id;
						}

						html += '<div class="section_title p26_title" data-user_id="'+to_user_id+'">';
							html += '<div class="p51_feed_post_user_block dropdown_selection">';
								html += '<div class="dropdown p51_feed_post_more_info">';
									html += '<button class="dropdown-toggle" data-toggle="dropdown"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></button>';
									html += '<ul class="dropdown-menu p51_feed_fpa">';
										html += '<li><button class="p51_feed_fpa1" type="button">Its spam</button></li>';
										html += '<li><button class="p51_feed_fpa2" type="button">Annoying</button></li>';
										html += '<li><button class="p51_feed_fpa3" type="button">Hide now</button></li>';
									html += '</ul>';
								html += '</div>';
							html += '</div>';
							html += '<a href="'+sails.config.appUrlwPort+'/profile/'+username_slug+'"><h3>'+username+'</h3></a>';
						html += '</div>';
						html += '<div class="p26_content"><div class="message_container">';

						var chats = chatdata_convarsation;
						
						chats.forEach(function(chat, index){
							var profile_image = '/themes/frontend/images/default-user.png';
							
							if(chat.user_id.profile_image &&  chat.user_id.profile_image!=''){
								profile_image = '/uploads/users/'+chat.user_id.profile_image;
							}
							
							html += '<div class="p26_m1000_li chat_id '+chat.id+' '+((req.user.id == chat.user_id.id) ? 'myself' : '')+'">'
								if(req.user.id != chat.user_id.id){	
									html += '<a class="p26_m1001" href="'+sails.config.appUrlwPort+'/profile/'+chat.user_id.slug+'"><img src="'+profile_image+'" alt="'+chat.user_id.name+'" height="20" width="20" /></a>';
								}
								html += '<div class="p26_m1005"><i class="fa fa-clock-o" aria-hidden="true"></i> <span class="p26_m1006" title="'+moment(chat.createdAt).format('Do MMM, YYYY')+'">'+moment(chat.createdAt).format('H:mm') +'</span></div>';
								html += '<div class="p26_m1003">'+chat.message+'</div>';
							html += '</div>';
						});
						
						
						html += '</div>';
						html += '<p id="typing">&nbsp;</p>';
						html += '<div class="p26_m1000_li message-box">';
							html += '<div class="p6_comment_content">';
								html += '<form method="POST" action="" class="sendMessage">';
								html += '<div class="form-group">';
									html += '<label class="label hidden" for="">Type Message here</label>';
									html += '<textarea name="message" id="" class="form-control textMessage" placeholder="Type a message..." rows="5" required="required"></textarea>';
								html += '</div>';
								html += '<div class="form-group">';
									html += '<input type="hidden" name="to_user_id" value="'+to_user_id+'" />';
									html += '<input type="hidden" name="message_id" value="'+req.param("message_id")+'" />';
									html += '<input type="hidden" name="user_id" value="'+req.user.id+'" />';
									html += '<input type="submit" value="Send Message" class="btn btn-primary" />';
								html += '</div>';
							html += '</div>';
							html += '</form>';
						html += '</div>';
						html += '</div>';
					});
				
					Chat.update({message_id : req.param("message_id")},{'read' : 1}).exec(function(err, updated){
						MessageService.getUnreadmessage(res,req.user.id).then(function(chat_count){
							return res.json({
								status    	: "OK",
								view	  	: html,
								chat_count  : chat_count,
								socket_id 	: to_user_list.socket_id,
								to_user_id 	: to_user_list.id
							});
						});
					});
				});
			});
		});
	},
	read_message : function(req,res){
		chat_id = req.param("chat_id");
		if(chat_id != undefined && chat_id!= ''){
			Chat.update({id : chat_id},{'read' : 1}).exec(function(err, updated){
				res.json({'status' : 'OK'});
			});
		}
	},
	getUnreadmessage : function(req,res){
		user_id = req.user.id;
		if(user_id != undefined && user_id != ''){
			MessageService.getUnreadmessage(res,user_id).then(function(chat_count){
				return res.json({'status' : 'OK','count':chat_count});
			});
		}
	}
};