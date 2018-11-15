/**
 * BlockUserController
 *
 * @description :: Server-side logic for managing Blockusers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	bloguser:function(req,res){
		_new = {
			user_id: req.user.id,
			to_user_id:req.param("to_user_id")
		};
		BlockUser.create(_new).exec(function(err,_user){
			return res.redirect("/connection/blocklist")
		});
	},

	list:function(req,res){
		BlockUser.find({user_id:req.user.id}).populate('to_user_id', {select : ['id','name','slug','profile_image']}).sort('createdAt Desc').exec(function(err,_blockusers){
	        UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				return res.view('connection/blocklist',{
					title: "Block List",
					blockusers: _blockusers,
					userData:userInfo,
				});
			});
		});
	},

	unblockuser:function(req,res){
		BlockUser.find().where({ id: req.param("id") }).then(function (_delete) {
			if (_delete && _delete.length > 0) {
				_delete[0].destroy().then(function (_delete) {
					return res.redirect("/connection/blocklist");
				}).catch(function (err) {
					return res.redirect("/connection/blocklist");
				});
			} else {
				return res.redirect("/connection/blocklist");
			}
		}).catch(function (err) {
			return res.redirect("/connection/blocklist");
		});
	},
	user_is_block:function(req,res){
		var user_id = req.param('user_id'),
		to_user_id = req.param('to_user_id');
		console.log({user_id:user_id,to_user_id:to_user_id});
		BlockUser.count({user_id:user_id,to_user_id:to_user_id}).exec(function(err,_BlockUser){
			console.log(_BlockUser);
			if(_BlockUser == 0){
				return res.json({'status':'OK'});
			} else {
				return res.json({'status':'Error',msg:"Unblock user to send message"});
			}
		});
	}
};