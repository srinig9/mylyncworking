var Promise = require('promise');

module.exports = {
    _config: {
        model: ['Users','ActivityLogs']
    },
	
	/**
	* addActivityLog Service to Log activity by Owner as User
	*
	* owner_id: Login User ID
	* module: {'referral', 'auth', 'connection', 'feedlike', 'feedcommentlike', 'company', 'company_authorized', 'blog', 'event', 'group', 'poll', 'job', 'feed', 'profile_education', 'profile_project', 'profile_experience', 'profile_social', 'user_privacy', 'user', 'company'}
	* action: {'used', 'login', 'logout', 'request_send', 'request_cancel', 'request_reject', 'request_accept', 'like_dislike', 'follow', 'unfollow', 'accept', 'reject', 'label_create', 'create', 'left', 'join', 'answer', 'bookmark', 'update', 'cover_update', 'profile_pic_update', 'forgot_password_reqest', 'password_change'}
	* object_id: Related ID (eg. blog or tnx id)
	* type: {'web', 'api'}
	*
	*/
    addActivityLog:function(res) {
        var owner_id = res.owner_id,
			module = res.module,
			action = res.action,
			object_id = res.object_id,
			type = res.type;
        
		var _newActivity = {
			owner_id: owner_id,
			module: module,
			action: action,
			object_id: object_id,
			type: type
		};
		var promise = new Promise(function (resolve, reject) {
			ActivityLogs.create(_newActivity).then(function (activity) {
				if(typeof activity != 'undefined') {
					resolve(true);
				} else {
					resolve(false);
				}
			});
		});
        return promise;
    },
};    