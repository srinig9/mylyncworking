module.exports = {
    _config: {
        model: ['Users']
    },
	
	/**
	* UpdateVerifyStatusService Service to Log activity by Owner as User
	*
	* owner_id: Login User ID
	* module: {'referral', 'auth', 'connection', 'feedlike', 'feedcommentlike', 'company', 'company_authorized', 'blog', 'event', 'group', 'poll', 'job', 'feed', 'profile_education', 'profile_project', 'profile_experience', 'profile_social', 'user_privacy', 'user', 'company'}
	* action: {'used', 'login', 'logout', 'request_send', 'request_cancel', 'request_reject', 'request_accept', 'like_dislike', 'follow', 'unfollow', 'accept', 'reject', 'label_create', 'create', 'left', 'join', 'answer', 'bookmark', 'update', 'cover_update', 'profile_pic_update', 'forgot_password_reqest', 'password_change'}
	* object_id: Related ID (eg. blog or tnx id)
	* type: {'web', 'api'}
	*
	*/

    VerifyStatus:function(res) {
        var user_id = res.user_id,
            phone_verify = res.phone,
			email_verify = res.email;
        
		var _updateData = {};

		if(phone_verify!=''){
          _updateData.is_verify_phone =phone_verify
       	}

       	if(email_verify!=''){
          _updateData.is_verify_email =email_verify
       	}
       	if(phone_verify!='' || email_verify!=''){
	        Users.update({id:user_id},_updateData).exec(function afterwards(err, updated){
	        	if(typeof updated!='undefined'){
	        		return true;
	        	}else{
	        		return false;
	        	}
			});
    	}
    },
};    