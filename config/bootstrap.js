/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
	sails.on('lifted', function() {
  // Your post-lift startup code here
  var app = require('express')();
  var http = require('http').Server(app);
  var io = require('socket.io')(http);		

	  io.on('connection', function (socket){
		
		 socket.on('CH01', function (from, msg) {
			  Users.findOne({id:from.user_id}).exec(function(err, _user){
				  if(from.type == ''){
					  io.to(msg).emit('received_p_msg',{"user_id" : from.user_id,"user_req":{'loginid':_user.loginid,'password':_user.password}});
				  } else {
					  io.to(msg).emit('received_p_msg',{"user_id" : from.user_id});
				  }
			  });
		 });

		 // Get New Notification
		 socket.on('send_notification', function (user_id) {
			  Notifications.find({user_id:user_id,status:0}).exec(function(err,_notifications) {
				  UserSocketid.find({user_id:user_id}).exec(function(err,result) {
					  if(result != undefined && result.length >0) {
						  var message = _notifications.length;
						  for(i=0;i<result.length;i++) {
							  var UserSocketidRecord = result[i];
							  if(typeof io.sockets.sockets[UserSocketidRecord.socket_id] != 'undefined'){
								  io.to(UserSocketidRecord.socket_id).emit('NOTIFY',message);
							  } else {
								  UserSocketid.destroy({id:UserSocketidRecord.id}).exec(function(err){

								  });
							  }
						  }
					  }
				  });
			  });
		 });

			//receiving typing message.
		  socket.on('typing',function(data,msg) {
			  Users.findOne({id:data.toUser}).populate('UserSocketid').exec(function(err,result){
				  Users.findOne({id:data.from}).exec(function(err,user_result){
					  BlockUser.find([{'$or':[{'user_id':data.from},{'to_user_id':data.toUser}]},{'$or':[{'user_id':data.toUser},{'to_user_id':data.from}]}]).exec(function(err,block_user){
						if(block_user.length == 0){
							var name = user_result.name;
							var message = name + " is typing...";
							if(typeof result != 'undefined' && typeof result.UserSocketid != 'undefined' && result.UserSocketid.length > 0) {
								if(result.UserSocketid.length > 0) {
									for(var typing_i=0;typing_i<result.UserSocketid.length;typing_i++){
										var UserSocketidRecord = result.UserSocketid[typing_i];
										if(typeof io.sockets.sockets[UserSocketidRecord.socket_id] != 'undefined'){
											io.to(UserSocketidRecord.socket_id).emit('typing',{message : message,user_id : user_result.id});
										} else {
											UserSocketid.destroy({socket_id:UserSocketidRecord.socket_id}).exec(function(err){

											});
										}
									}
								}
							}

						}
					});
				  });
			  });				
		  }); //end of typing event.
		  socket.on('data_transfer',function(user_id,data){
			  Users.findOne({id:user_id}).populate('UserSocketid').exec(function(err,result){
				  if(typeof result != 'undefined' && typeof result.UserSocketid != 'undefined' && result.UserSocketid.length > 0) {
					  if(result.UserSocketid.length > 0) {
						  for(i=0;i<result.UserSocketid.length;i++){
							  var UserSocketidRecord = result.UserSocketid[i];
							  if(typeof io.sockets.sockets[UserSocketidRecord.socket_id] != 'undefined'){
								  io.to(UserSocketidRecord.socket_id).emit('data_received',data);
							  } else {
								  UserSocketid.destroy({socket_id:UserSocketidRecord.socket_id}).exec(function(err){

								  });
							  }
						  }
					  }
				  }					
			  });				
		  }); //end of typing event.
		  
		socket.on('send_message_by_server',function(data){ 
			Users.findOne(data.user_id).populate('UserSocketid').exec(function(err,result){
				if(typeof result != 'undefined' && typeof result.UserSocketid != 'undefined' && result.UserSocketid.length > 0) {
					if(result.UserSocketid.length > 0) {
						Chat.findOne({'id':data.chat_id}).populate('user_id',{select:['name','profile_image','createdAt','slug']}).exec(function(err,chat_data){
							Messages.findOne({id:chat_data.message_id})
								.populate('user_id')
								.populate('user_id.UserSocketid')
								.populate('to_user_id')
								.populate('to_user_id.UserSocketid')
								.exec(function(err,message_responce){
									
								if(typeof message_responce != 'undefined') {
									var UserSocketList = [];
									if(chat_data.user_id.id == message_responce.user_id.id){
										UserSocketList = message_responce.user_id.UserSocketid;
									} else {
										UserSocketList = message_responce.to_user_id.UserSocketid;
									}
									
									if(UserSocketList != undefined && UserSocketList.length > 0) {
										for(var send_i=0;send_i<UserSocketList.length;send_i++) {
											var UserSocketidRecord = UserSocketList[send_i];
											if(typeof io.sockets.sockets[UserSocketidRecord.socket_id] != 'undefined') {	
												io.to(UserSocketidRecord.socket_id).emit('my_message_receive',chat_data);
											} else {
												UserSocketid.destroy({socket_id:UserSocketidRecord.socket_id}).exec(function(err){
			
												});
											}
										}
									}	
								}
							});
							for(var send_i=0;send_i<result.UserSocketid.length;send_i++) {
								var UserSocketidRecord = result.UserSocketid[send_i];
								if(typeof io.sockets.sockets[UserSocketidRecord.socket_id] != 'undefined') {	
									io.to(UserSocketidRecord.socket_id).emit('chat-msg',data.msg);
									io.to(UserSocketidRecord.socket_id).emit('mobile_chat_receive',chat_data);	
								} else {
									UserSocketid.destroy({socket_id:UserSocketidRecord.socket_id}).exec(function(err){

									});
								}
							}
						});
					}					  
				}
			});
		});
			  
		socket.on('send_message_by_mobile',function(data){ //data{user_id,message_id,message}
			MessageService.chatSave(data).then(function(chat_data) {
				Messages.findOne({"or":[{user_id:data.user_id},{to_user_id:data.user_id}],id:chat_data.message_id}).exec(function(err,message_master){
					var UserSocketUserId = '';
					var ToUserSocketUserId = '';
					if(message_master.to_user_id == data.user_id){
						UserSocketUserId = message_master.user_id;
						ToUserSocketUserId = message_master.to_user_id;
					} else {
						UserSocketUserId = message_master.to_user_id;
						ToUserSocketUserId = message_master.user_id;
					}
				    Users.findOne({id:ToUserSocketUserId}).populate('UserSocketid').exec(function(err,result){
						var UserSocketList = result['UserSocketid'];
						if(UserSocketList != undefined && UserSocketList.length > 0) {
							for(var send_i=0;send_i<UserSocketList.length;send_i++) {
								var UserSocketidRecord = UserSocketList[send_i];
								if(typeof io.sockets.sockets[UserSocketidRecord.socket_id] != 'undefined') {	
									io.to(UserSocketidRecord.socket_id).emit('my_message_receive',chat_data);
								} else {
									UserSocketid.destroy({socket_id:UserSocketidRecord.socket_id}).exec(function(err){

									});
								}
							}
						}	
					});
					BlockUser.findOne({"user_id":UserSocketUserId,"to_user_id":data.user_id}).exec(function(err,block_user){	
						if(block_user == undefined){
							Users.findOne({id:UserSocketUserId}).populate('UserSocketid').exec(function(err,result){
								if(typeof result != 'undefined' && typeof result.UserSocketid != 'undefined' && result.UserSocketid.length > 0) {
									if(result.UserSocketid.length > 0) {
										for(var send_m_i=0;send_m_i<result.UserSocketid.length;send_m_i++){
											var UserSocketidRecord = result.UserSocketid[send_m_i];
											if(typeof io.sockets.sockets[UserSocketidRecord.socket_id] != 'undefined'){

												var moment = require("moment");
												var chat = chat_data;
												var profile_image = '/themes/frontend/images/default-user.png';
												if(chat.user_id.profile_image != undefined && chat.user_id.profile_image &&  chat.user_id.profile_image!=''){
													profile_image = '/uploads/users/'+chat.user_id.profile_image;
												}
											var html = '';
												html += '<div data-id="'+chat.id+'" user_id="'+chat.user_id.id+'" class="p26_m1000_li">'
													html += '<a class="p26_m1001" href="'+sails.config.appUrlwPort+'/profile/'+chat.user_id.slug+'"><img src="'+profile_image+'" alt="'+chat.user_id.name+'" height="20" width="20" /></a>';
													html += '<div class="p26_m1002">';
															html += '<div class="p26_m1005"><i class="fa fa-clock-o" aria-hidden="true"></i> <span class="p26_m1006"title="'+moment(chat.createdAt).format('Do MMM, YYYY')+'">'+moment(chat.createdAt).format('H:mm') +'</span></div>';
														html += '<div class="p26_m1003">'+chat.message+'</div>';														
													html += '</div>';
												html += '</div>';
											io.to(UserSocketidRecord.socket_id).emit('chat-msg',html);
											io.to(UserSocketidRecord.socket_id).emit('mobile_chat_receive',chat_data);
											} else {
												UserSocketid.destroy({socket_id:UserSocketidRecord.socket_id}).exec(function(err){

												});
											}
										}
									}
									
								}
							});
						}
					});
				});
			});
		});
		  socket.on('connect_io',function(data){
			if(data['fcm_key'] != undefined) {
				var user_data = {device_id : data['fcm_key'],'user_id':data['user_id'],'socket_id':data['socket_id']};
				UserSocketid.destroy({device_id : data['fcm_key']}).exec(function(err){
					if(err){
						console.log('error in destroy',JSON.stringify(err));
					} else {
						UserSocketid.find({'socket_id':data['socket_id']}).exec(function(err,userFound){
							if(userFound.length == 0) {
								console.log(user_data);
								UserSocketid.create(user_data).exec(function(err,userdata){
			
								});
							}
						});
					}
				});
			} else {
				var user_data = {'user_id':data['user_id'],'socket_id':data['socket_id']};
				UserSocketid.count(user_data).exec(function(err,userFound){
					if(userFound == 0) {
						UserSocketid.create(user_data).exec(function(err,userdata){
	
						});
					}
				});
			}
			if(data['fcm_key'] != undefined){
				var fmc_data = {'user_id':data['user_id'],'fcm_key':data['fcm_key']};
				UserFcmkey.destroy({'fcm_key':data['fcm_key']}).exec(function(){
					UserFcmkey.create(fmc_data).exec(function(){

					});
				});
			}
		  });
		  socket.on('authorizeAllowDenyServer',function(data){
			Users.findOne({id:data.user_id}).populate('UserSocketid').exec(function(err,result){
				if(typeof result != 'undefined' && typeof result.UserSocketid != 'undefined' && result.UserSocketid.length > 0) {
					if(result.UserSocketid.length > 0) {	
						
						for(var send_m_i=0;send_m_i<result.UserSocketid.length;send_m_i++){
							var UserSocketidRecord = result.UserSocketid[send_m_i];
							if(typeof io.sockets.sockets[UserSocketidRecord.socket_id] != 'undefined') {
								io.to(UserSocketidRecord.socket_id).emit('authorizeAllowDeny',data);
							} else {
								UserSocketid.destroy({socket_id:UserSocketidRecord.socket_id}).exec(function(err){

								});
							}
						}
					}
				}
			});					
		  });

		  socket.on('connect_mobile',function(){
		  });
	  });
	  http.listen(sails.config.portSoketIo,function () {     
	  });
   });

// It's very important to trigger this callback method when you are finished
// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
cb();
};
