var Promise = require('promise');

module.exports = {
    _config: {
        model: ['Messages','Chat']
    },
    getUnreadmessage : function(res,user_id) {
       return new Promise(function (resolve, reject) {
        var user_list = [];
        var message_id = [];
        Messages.find({or : [{'user_id':user_id},{'to_user_id':user_id}]}).exec(function(err,message_data) 
			{
                for(var i = 0; i<message_data.length; i++){
					if(message_data[i]['user_id'] == user_id){
                        user_list.push(message_data[i]['to_user_id']);
                        message_id.push(message_data[i]['id']);
					} else {
                        user_list.push(message_data[i]['user_id']);
                        message_id.push(message_data[i]['id']);
					}
                }
               
                if(user_list.length > 0){ 
                    Chat.count({message_id:message_id,user_id : user_list,'block_user' :{
                            "$exists" : false
                    },'read' :{'!' : [1]}}).exec(function(err, chat_count){
                        if(chat_count == undefined){
                            resolve(0);
                        } else {
                            resolve(chat_count);
                        }
                    });
                } else {
                    resolve(0);
                }
            });
        });
    },
    messageHistory:function(req,user_id){
        var to_user_id = req.param("to_user_id");
        var page_no = req.param("page_no") != undefined ? req.param("page_no") : 1 ;

        return new Promise(function (resolve, reject) {
            Messages.findOne({'or' : [{user_id:user_id,to_user_id:to_user_id},{user_id:to_user_id,to_user_id:user_id}]}).exec(function(err,message_record){

                if(message_record != undefined){
                    Chat.find({message_id:message_record.id})
                        .paginate({page: page_no, limit: 100})
                        .populate("user_id",{select:['name','profile_image']})
                        .sort("createdAt DESC")
                        .exec(function(err,message_data) {                
                        resolve({
                            status:'OK',
                            msg:'chat list',
                            data:message_data
                        });
                    });
                } else {
                    resolve({
                        status:'OK',
                        msg:'chat list',
                        data:[]
                    });
                }
        });
    });
    },
    messageConversation:function(req,user_id) {
        var page_no = req.param("page_no") != undefined ? req.param("page_no") : 1 ;
        return new Promise(function (resolve, reject) {
            Messages.find({'or' : [{user_id:user_id},{to_user_id:user_id}]})
                .populate("to_user_id",{select:['name','profile_image']})
                .populate("user_id",{select:['name','profile_image']})
                .paginate({page: page_no, limit: 100})
                .sort("updatedAt DESC")
                .exec(function(err,message_data) {
                    var user_ids = []; 
                    for(i=0;i<message_data.length ;i++) {
                        if(message_data[i]['to_user_id']['id'] == user_id){
                            user_ids.push(message_data[i]['user_id']['id']);
                        } else {
                            user_ids.push(message_data[i]['to_user_id']['id']);
                        }
                    }
                    
                    BlockUser.find({'user_id':user_id,"to_user_id":user_ids}).exec(function(err,userBlock){
                        for(i=0;i<message_data.length ;i++) {
                            message_data[i]['block'] = 0;
                            for(j=0;j<userBlock.length;j++) {
                                if(message_data[i]['to_user_id']['id'] == user_id && message_data[i]['user_id']['id'] == userBlock[j]['to_user_id']){
                                    message_data[i]['block'] = 1;
                                    break;
                                } else if(message_data[i]['user_id']['id'] == user_id && message_data[i]['to_user_id']['id'] == userBlock[j]['to_user_id']){
                                    message_data[i]['block'] = 1;
                                    break;
                                }
                            }
                        }

                        resolve({
                            status:'OK',
                            msg:'message conversation list',
                            data:message_data
                        });
                    });
                })
                    
        });
    },
    chatSave:function(data){
        data['read'] = 0;
		return new Promise(function (resolve, reject) {
            if(data.message_id != undefined && data.message_id !=""){
                Messages.update({id:data.message_id},{status:'1'}).exec(function(err,_message){
                   if(_message.length > 0) {

                        to_user_id = _message[0]['to_user_id'];
                        user_id = _message[0]['user_id'];
                        BlockUser.find({"$or":[{'user_id':data.user_id},{'to_user_id':data.user_id}],"$or":[{'user_id':data.to_user_id},{'to_user_id':data.to_user_id}]}).exec(function(err,block_user){
                          
                        if(block_user != undefined && block_user.length > 0){
                                data['block_user'] = 1;
                           }
                            Chat.create(data)
                            .then(function(message_data) {
                                Chat.findOne({id:message_data.id})
                                .populate("user_id",{select:['name','profile_image','createdAt','slug']})
                                .exec(function(err,chat_data) {
                                    resolve(chat_data);
                                });
                            });
                        });
                    }
                });
            } else {
                Messages_data ={"$or":[{"user_id" : data.user_id,
                                        "to_user_id" :data.to_user_id},{"user_id" : data.to_user_id,
                                        "to_user_id" :data.user_id}]};
                Messages.findOne(Messages_data).exec(function(err,_message_data){
                    if(_message_data == undefined){
                        Messages.create(Messages_data).exec(function(err,_message){
                            var message_chat_data = {};
                            //BlockUser.find([{'$or':[{'user_id':data.user_id},{'to_user_id':data.to_user_id}]},{'$or':[{'user_id':data.to_user_id},{'to_user_id':data.user_id}]}]).exec(function(err,block_user){
                                BlockUser.find({"$or":[{'user_id':data.user_id},{'to_user_id':data.user_id}],"$or":[{'user_id':data.to_user_id},{'to_user_id':data.to_user_id}]}).exec(function(err,block_user){
                        
                                if(typeof data.chat_timestamp != 'undefined' && data.chat_timestamp != ''){
                                    message_chat_data = {message_id:_message.id,'chat_timestamp' : data.chat_timestamp,'user_id':data.user_id,"message":data.message,"read":0};
                                } else {
                                    message_chat_data = {message_id:_message.id,'user_id':data.user_id,"message":data.message,"read":0};
                                }
                                if(block_user.length > 0){
                                    message_chat_data['block_user'] = 1;
                                }
                            Chat.create(message_chat_data)
                                .exec(function(err,message_data) {
                                    Chat.findOne({id:message_data.id})
                                    .populate("user_id",{select:['name','profile_image','createdAt','slug']})
                                    .sort("createdAt DESC")
                                    .exec(function(err,chat_data) {
                                        resolve(chat_data);
                                    });
                                });
                            });
                        });
                    } else {
                        //BlockUser.find([{'$or':[{'user_id':data.user_id},{'to_user_id':data.to_user_id}]},{'$or':[{'user_id':data.to_user_id},{'to_user_id':data.user_id}]}]).exec(function(err,block_user){
                        BlockUser.find({"$or":[{'user_id':data.user_id},{'to_user_id':data.user_id}],"$or":[{'user_id':data.to_user_id},{'to_user_id':data.to_user_id}]}).exec(function(err,block_user){
                        
                            var message_chat_data = {};
                            if(typeof data.chat_timestamp != 'undefined' && data.chat_timestamp != ''){
                                message_chat_data = {message_id:_message_data.id,'chat_timestamp' : data.chat_timestamp,'user_id':data.user_id,"message":data.message,"read":0};
                            } else {
                                message_chat_data = {message_id:_message_data.id,'user_id':data.user_id,"message":data.message,"read":0};
                            }
                            if(block_user.length > 0){
                                message_chat_data['block_user'] = 1;
                            }
                            Messages.update({id:_message_data.id},{status:'1'}).exec(function(err,_message){
                                Chat.create(message_chat_data)
                                    .exec(function(err,message_data) {
                                        Chat.findOne({id:message_data.id})
                                        .populate("user_id",{select:['name','profile_image','createdAt','slug']})
                                        .sort("createdAt DESC")
                                        .exec(function(err,chat_data) {
                                            resolve(chat_data);
                                        });
                                });
                            });
                        });
                    } 
                });
            }
        });
    },
}