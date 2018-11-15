var moment = require('moment');
var Promise = require('promise');
module.exports = {
    _config: {
        model: ['UserSmsLogs']
    },
	
	/**
	* StoreSmsLogs Service to Log activity by Owner as User
	*
	* owner_id: Login User ID
	* module: {'referral', 'auth', 'connection', 'feedlike', 'feedcommentlike', 'company', 'company_authorized', 'blog', 'event', 'group', 'poll', 'job', 'feed', 'profile_education', 'profile_project', 'profile_experience', 'profile_social', 'user_privacy', 'user', 'company'}
	* action: {'used', 'login', 'logout', 'request_send', 'request_cancel', 'request_reject', 'request_accept', 'like_dislike', 'follow', 'unfollow', 'accept', 'reject', 'label_create', 'create', 'left', 'join', 'answer', 'bookmark', 'update', 'cover_update', 'profile_pic_update', 'forgot_password_reqest', 'password_change'}
	* object_id: Related ID (eg. blog or tnx id)
	* type: {'web', 'api'}
	*
	*/
    StoreSmsLogs:function(res) {
        var msg_status='fail';
        if(res.status==false){
            msg_status='success';
        }
        var owner_id = res.owner_id,
            message_id = res.message_id,
			message = res.message,
			sendto = res.sendto,
			status = msg_status;
        
		var _newActivity = {
			user_id: owner_id,
			message_id: message_id,
			message: message,
			sendto: sendto,
			status: status
        };

        if (typeof res.sms_type!='undefined' && res.sms_type!='') {
          _newActivity.sms_type = res.sms_type;
        }
        
		UserSmsLogs.create(_newActivity).then(function (activity) {
			if(typeof activity != 'undefined') {
				return true;
			} else {
				return false;
			}
		});
    },

    checkSmsLog:function(user_id,sms_type){
    	var promise = new Promise(function (resolve, reject) {
	    	var now = new Date(),
			start = new Date(now.getTime());
			var start = moment().subtract(24, 'hours').toDate();

	    	UserSmsLogs.count().where({ "createdAt" : { ">": start },user_id:user_id,sms_type:sms_type}).exec(function countCB(error, found) {
	    		resolve(found);
	    	});
    	});
    	return promise;
    },
};    
