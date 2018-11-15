/**
 * NotificationsController
 *
 * @description :: Server-side logic for managing notifications
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	load_more_notification:function(req,res){
        var page = 1;
        var limit = 10;
        if(req.param("page_no") != undefined){
            page = req.param("page_no");
        }
		Notifications.find({user_id:req.user.id}).populateAll().paginate({page: page, limit: limit}).sort("createdAt DESC").exec(function(err,_notifications){
			if(_notifications.length == 0){
				return res.json({notifications:false});
			}
			return res.render('notification/load_more_notification',{
				notifications:_notifications
			});
		});
	},

	list:function(req,res){
        var page = 1;
        var limit = 10;
        if(req.param("page_no") != undefined){
            page = req.param("page_no");
        }

		Notifications.count({user_id:req.user.id}).sort("createdAt DESC").exec(function(err,count){
			Notifications.find({user_id:req.user.id}).populateAll().paginate({page: page, limit: limit}).sort("createdAt DESC").exec(function(err,_notifications){
				UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
					Notifications.update({user_id:req.user.id,status:0},{status:1}).exec(function(err,data){
						return res.view("notification/list",{
							title:"Notifications",
							notifications:_notifications,
							count:count,
							userData:userInfo
						});
					})
				});
			});
		});
	},

	unreadNotificationCount:function(req,res){
		var user_id = "0";
		if(typeof req.user != 'undefined'){
			user_id = req.user.id;
		}
		Notifications.count({user_id:user_id,status:0}).exec(function countCB(error, count) {
			return res.json(count);
		});
	},
};

