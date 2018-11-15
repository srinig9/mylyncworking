/**
 * UserConnectionController
 *
 * @description :: Server-side logic for managing userconnections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	send: function(req, res){
		var _newConnection = {
            user_id: req.user.id,
            to_user_id: req.param("to_user_id"),
            status: 0
        };

        UserConnection.count({user_id: req.user.id,to_user_id: req.param("to_user_id")}).exec(function(err,found){
            if(found>0){
                return res.json({
                    status: 'Error',
                    message: "Request already sent"
                });
            }
            return UserConnection.create(_newConnection).then(function (_userconnection) {
                UserConnection.findOne({id:_userconnection.id}).populateAll().exec(function(err,data){
                    /* Activity Log Insert */
                    ActivityLogsService.addActivityLog({
                        owner_id: req.user.id,
                        module: 'connection',
                        action: 'request_send',
                        object_id: _userconnection.id,
                        type: 'web'
                    });


                    /* Add Send Request Notification */
                    var textdata = "<a href='/profile/"+data.user_id.slug+"'>"+data.user_id.name+"</a> sent you a connection request.";
                    NotificationService.addNotification({
                        user_id: data.to_user_id.id,
                        feed_id: "",
                        from_user_id: data.user_id.id,
                        notification_text: textdata,
                        notification_type: "myconnection",
                        type: 'web'
                    });

                    return res.json({
                        status: 'OK',
                        user_id : data.to_user_id.id,
                        message: "Request has been sent successfully."
                    });
                });

            }).catch(function (error) {
                return res.json({
                    connections: _newConnection,
                    status: 'Error',
                    errors: error
                });
            });
        });
	},

    cancel: function(req,res){
        //console.log("Inside cancel..............");
        var to_user_id = req.param("to_user_id");
        UserConnection.find().where({user_id: req.user.id, to_user_id: to_user_id}).then(function (_connection) {
            //console.log(_connection);
            if (_connection && _connection.length > 0) {
				if(typeof _connection[0].id != 'undefined') {
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'connection',
						action: 'request_cancel',
						object_id: _connection[0].id,
						type: 'web'
					});
				}
                _connection[0].destroy().then(function (_connection) {
                    return res.json({ message: "Connection Request deleted", status : 'OK' });
                }).catch(function (err) {
                    return res.json({ message: "Something went wrong. Please try again", status:"Error" });
                });
            }else{
                return res.json({ message: "Something went wrong. Please try again", status:"Error" });
            }
        });
    },

    reject: function(req,res){
        //console.log("Inside reject..............");
        var user_id = req.param("user_id");
        UserConnection.find().where({user_id: user_id, to_user_id: req.user.id}).then(function (_connection) {
            //console.log(_connection);
            if (_connection && _connection.length > 0) {
				if(typeof _connection[0].id != 'undefined') {
					/* Activity Log Insert */
					ActivityLogsService.addActivityLog({
						owner_id: req.user.id,
						module: 'connection',
						action: 'request_reject',
						object_id: _connection[0].id,
						type: 'web'
					});
				}
                _connection[0].destroy().then(function (_connection) {
                    return res.json({ message: "Connection Request rejected", status : 'OK' });
                }).catch(function (err) {
                    return res.json({ message: "Something went wrong. Please try again", status:"Error" });
                });
            }else{
                return res.json({ message: "Something went wrong. Please try again", status:"Error" });
            }
        });
    },

    accept: function(req,res){
        //console.log("Inside accept..............");
        var user_id = req.param("user_id");
        //console.log(user_id);
        UserConnection.update({user_id: user_id, to_user_id: req.user.id}, { status : "1" }).then(function (_connection){
            
            UserConnection.findOne({id:_connection[0].id}).populateAll().exec(function(err,data){
                /* Add Send Request Notification */
                var textdata = "<a href='/profile/"+data.to_user_id.slug+"'>"+data.to_user_id.name+"</a> accepted your connection request.";
                NotificationService.addNotification({
                    user_id: data.user_id.id,
                    feed_id: "",
                    from_user_id: data.to_user_id.id,
                    notification_text: textdata,
                    type: 'web'
                });
				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'connection',
					action: 'request_accept',
					object_id: _connection[0].id,
					type: 'web'
                });

                return res.json({ message: "Request accept successfully", status:"OK",user_id: data.user_id.id });
			});

        }).catch(function (err) {
            return res.json({ message: "Something went wrong. Please try again", status:"Error" });
        });
    },
	
};

