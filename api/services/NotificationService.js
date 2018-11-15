var Promise = require('promise');

module.exports = {
	
    _config: {
        model: ['Users','Notifications']
    },

    addNotification: function(res){
        var promise = new Promise(function (resolve, reject) {
            var user_id = res.user_id,
            from_user_id = res.from_user_id,
            type = res.type,
            notification_text = res.notification_text;

            var _newNotification = {
                user_id:user_id,
                from_user_id:from_user_id,
                notification_text:notification_text,
                type:type,
                status:0,
            };

            if(typeof res.feed_id !='undefined' && res.feed_id != ''){
                _newNotification.feed_id = res.feed_id;
            }
            
            if(typeof res.notification_type !='undefined' && res.notification_type != ''){
                _newNotification.notification_type = res.notification_type;
            }
            
            Notifications.create(_newNotification).exec(function(err,data){
                if(err){
                    resolve(err);
                }
                resolve(data);
            });
        });
        return promise;
    },
	
    unreadNotificationCount: function(req,user_id){
        
		return new Promise(function (resolve, reject) {
            Notifications.count({user_id:user_id,status:0}).exec(function countCB(error, count) {
                console.log(count);
                MessageService.getUnreadmessage(req,user_id).then(function(messageCount){
                    if(error) {
                        resolve({status: 'Error',
                        msg: 'Error unread notification counter !',
                        data : 0});
                    } else {
                        resolve({status: 'OK',
                        msg: 'Notification counter!',
                        data :{ NotificationCount:count,
                            messageCount:messageCount,
                            AndriodVersion : "1.11",
                            iOSVersion: "1.02",
                            AndriodFouceUpdate : true,
                            iOSForceUpdate:false,
                        }});
                    }
                });
            });
        });
    },
	
    list: function(req,user_id){
        return new Promise(function (resolve, reject) {
            var page_no = req.param("page_no") ? req.param("page_no") : 1;
            var limit = 10;
            Notifications.find({user_id:user_id})
                .populate('from_user_id',{select : ['name','slug',"profile_image"]})
                .populate('feed_id',{select : ['feed_details','title']})
                .sort("createdAt DESC")
                .paginate({page: page_no, limit: limit})
                .exec(function(err,_notifications){
                if(err){
                    resolve({
                        status: 'Error',
                        msg:"Error Notifications list !",
                        data:{},
                    });
                }
				
                for(i=0;i<_notifications.length ;i++){
                    if(_notifications[i]['user_id'] != undefined){
                        delete _notifications[i]['user_id'] 
                    }
                    if(_notifications[i]['type'] != undefined){
                        delete _notifications[i]['type']; 
                    }
                    if(_notifications[i]['status'] != undefined){
                      delete _notifications[i]['status'];
                    }
					
                    if(_notifications[i]['notification_text'] != undefined && _notifications[i]['notification_text'] == 'liked'){
                        _notifications[i]['notification_text'] =  _notifications[i]['from_user_id']['name']+' '+_notifications[i]['notification_text']+' your post.';
                        var feed_text = '';
                        if(_notifications[i].feed_id != undefined){
                            if(typeof _notifications[i].feed_id.title != 'undefined' && _notifications[i].feed_id.title != '') {
                                feed_text = _notifications[i].feed_id.title.substring(0,100);
                            } else {
                                feed_text = _notifications[i].feed_id.feed_details.substring(0,100);
                            }
                            delete _notifications[i].feed_id;
                        }
                        _notifications[i]['notification_details'] = feed_text;
                    }
                    if(_notifications[i]['updatedAt'] != undefined){
                        delete _notifications[i]['updatedAt'];
                    }
                    if(_notifications[i]['createdAt'] != undefined){
                        _notifications[i]['createdAt'] = DateDifferentService.time_ago(_notifications[i]['createdAt']);
                    }
                }
                Notifications.update({user_id:user_id,status:0},{status:1}).exec(function(err,data){
                    if(err){
                        resolve({
                            status: 'Error',
                            msg:"Error Notifications list !",
                            data:{},
                        });
                    } else {
                        resolve({
                            status: 'OK',
                            msg:"Notifications list",
                            data:_notifications,
                        });
                    }
                });
            });
        });
	},
};