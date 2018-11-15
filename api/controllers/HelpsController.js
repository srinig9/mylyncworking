/**
 * HelpsController
 *
 * @description :: Server-side logic for managing Helps
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function(req,res){
		return res.view('pages/helps/create',{
			data:[],
			status:"OK",
			title:"Create New Help"
		});
	},

	store: function(req,res){
		var _newHelp = {
			question:req.param("question"),
			answer:req.param("answer"),
			status:req.param("status"),
		};

		Helps.create(_newHelp).exec(function(err,_help){
			if(err){
				return res.redirect("/helps/create")
			}
			return res.redirect("/helps/list")
		});
	},

	list: function(req,res){
		var user_id = (typeof req.user !='undefined' && req.user !='') ? req.user.id : 0;

		Helps.find().sort("createdAt DESC").exec(function(err,data){
			UserDataService.UserDetails(req,user_id).then(function(userInfo){
				return res.view('pages/helps/list',{
					data:data,
					userData:userInfo,
					status:"OK",
					title:"Create New Help"
				});
			});
		});
	},

	edit:function(req,res){

		Helps.findOne({id:req.param("id")}).exec(function(err,data){
			return res.view('pages/helps/create',{
				data:data,
				status:"OK",
				title:"Edit Help"
			});
		});

	},

	update: function(req,res){
		var _newHelp = {
			question:req.param("question"),
			answer:req.param("answer"),
			status:req.param("status"),
		};
		// return res.json(_newHelp);
		Helps.update({id:req.param("id")},_newHelp).exec(function(err,_help){
			if(err){
				return res.redirect("/helps/create")
			}
			return res.redirect("/helps/list")
		});
	},

};
