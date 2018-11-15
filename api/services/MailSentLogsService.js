module.exports = {
    _config: {
        model: ['EmailSentLogs']
    },
	
    EmailLogs:function(res) {
        var owner_id = res.owner_id,
            to_email = res.to_email,
			message = res.message,
			email_type = res.email_type;
        
		var _newActivity = {
			user_id: owner_id,
			to_email: to_email,
			message: message,
			email_type: email_type,
			status: 1
        };

		EmailSentLogs.create(_newActivity).then(function (activity) {
			if(typeof activity != 'undefined') {
				return true;
			} else {
				return false;
			}
		});
    },
};    
