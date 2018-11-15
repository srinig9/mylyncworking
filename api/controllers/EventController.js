/**
 * EventController
 *
 * @description :: Server-side logic for managing events
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var datetime = require('node-datetime');

module.exports = {
	

	eventlist:function(req,res){

		var user_id = req.user.id;
		var page = 1;
		var limit = 10;
		if(req.param("page_no") != undefined){
			page = req.param("page_no");
		}

		var filter = {type:"E",user_id:user_id, is_deleted : { "!" : 1 }};

		return new Promise(function (fulfill, reject){
			Feeds.count(filter).exec(function countCB(err,count){
				Feeds.find(filter)
					.populate('user_id')
					.populate('user_id.company_id',{select:['company_name','slug']})
					.populate('group_id')
					.populate('feedcomments', { sort: 'createdAt ASC' })
					.populate('feedcomments.user_id.company_id')
					.populate('feedcomments.commentlikes')
					.populate('feedcomments.commentreply')
					.populate('feedcomments.commentreply.commentlikes')
					.populate('feedcomments.commentreply.user_id.company_id')
					.populate('feedmedias')
					.populate('feedlikes')
					.paginate({page: page, limit: limit})
					.sort('createdAt DESC')
					.exec(function(err,_events){
						fulfill({eventlist:_events,totalevents:count});
				});
			});
		});
	},

	load_more_event: function(req,res){
		var self = this;
		self.eventlist(req,res,req.param("type")).then(function(data){
			if(data.eventlist.length == 0){
				return res.json({blogs:false});
			}
			return res.render('ajax/load_more_event',{
				events:data.eventlist
			});
		});
	},

	index: function(req,res){
		var self = this;
		self.eventlist(req).then(function(_events){
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				return res.view('event/list',{
					events: _events.eventlist,
					totalevents: _events.totalevents,
					userData:userInfo
				});
			});
		});
	},

	create: function(req,res){

		var _event = {
			title:"",
			feed_details:"",
			start_date:"",
			end_date:"",
			organiser:"",
			location:"",
			city:"",
			state:"",
			country:""
		};

		UserExperiences.find({user_id:req.user.id}).exec(function(err,result){
			array = [];
			result.forEach(function(factor, index){
				array.push(factor.company_name);
			});
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				return res.view('event/create',{
					organisers:array,
					userData:userInfo,
					event:_event,
					btnAction: "Create Event",
					formAction: "/event/create"
				});
			});
		});
	},

	store: function(req,res){
		_newevent = {
			title:req.param('title'),
			slug:req.param('slug'),
			privacy:req.param('privacy'),
			feed_details:req.param('feed_details'),
			location:req.param('location'),
			city:req.param('city'),
			state:req.param('state'),
			organiser:req.param('organiser'),
			country:req.param('country'),
			group_id:"",
			user_id:req.user.id,
			status:"1",
			type:"E",
			start_date: new Date(req.param("start_date")),
			end_date: new Date(req.param("end_date")),
		};
		Feeds.create(_newevent).exec(function (err,_event) {
			if(typeof _event.id != 'undefined') {
				/* Activity Log Insert */
				ActivityLogsService.addActivityLog({
					owner_id: req.user.id,
					module: 'event',
					action: 'create',
					object_id: _event.id,
					type: 'web'
				});
			}
			var feed_id = _event.id;
			/* Upload Image */
			req.file('avatar').upload({
				dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/feeds')
			},function (err, uploadedFiles) {
				if(uploadedFiles.length > 0){
					var fd = uploadedFiles[0].fd;
					var myarr = fd.split("\\");
					var filename = myarr[myarr.length-1];
					FeedMedia.create({ feed_id: feed_id, image: filename }).exec(function (err, image) {

					});
				}
				return res.redirect("/event");
			});
		});
	},

	details: function(req,res){
		Feeds.findOne({slug: req.param("slug")}).populate("feedmedias").exec(function(err,_event){
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				// return res.json(_event);
				return res.view('event/details',{
					events: _event,
					userData:userInfo
				});
			});
		});
	},

	edit: function(req,res){
		Feeds.findOne({id:req.param("id")}).exec(function(err,_event){
			
			if(_event.user_id!=req.user.id){
				return res.redirect("/events");
			}

			var sd = datetime.create(_event.start_date);
			var start_date = sd.format('Y-m-d H:M');
			_event.start_date = start_date;

			var ed = datetime.create(_event.end_date);
			var end_date = ed.format('Y-m-d H:M');
			_event.end_date = end_date;

			UserExperiences.find({user_id:req.user.id}).exec(function(err,result){
				array = [];
				result.forEach(function(factor, index){
					array.push(factor.company_name);
				});
				UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
					return res.view('event/create',{
						organisers:array,
						userData:userInfo,
						event:_event,
						btnAction: "Update Event",
						formAction: "/event/edit/"+req.param("id")
					});
				});
			});
		})
	},

	update: function(req,res){
		var _updateEvent = {
			title:req.param('title'),
			feed_details:req.param('feed_details'),
			location:req.param('location'),
			city:req.param('city'),
			state:req.param('state'),
			organiser:req.param('organiser'),
			country:req.param('country'),
			status:"1",
			start_date: new Date(req.param("start_date")),
			end_date: new Date(req.param("end_date")),
		};

		Feeds.update(req.param("id"),_updateEvent).exec(function(err,_event){

			var feed_id = _event[0].id;

			FeedMedia.find({feed_id: feed_id}).exec(function(err,_media){
				/* Upload Image */
				req.file('avatar').upload({
					dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/feeds'),
					maxBytes: 7000000,  //7mb
				},function (err, uploadedFiles) {
					array = [];
					if(uploadedFiles.length > 0){
						var fd = uploadedFiles[0].fd;
						var myarr = fd.split("\\");
						var filename = myarr[myarr.length-1];
						if(_media.length > 0){
							FeedMedia.update(_media[0].id, {image: filename}).exec(function (err, image) {
							});
						}else{
							FeedMedia.create({ feed_id: feed_id, image: filename }).exec(function (err, image) {
							});
						}
					}
				});
			});
			return res.redirect("/events");
		});
	},

	delete: function(req,res){
		Feeds.findOne({id:req.param('id')}).exec(function(err,_event){
			if(req.user.id!=_event.user_id){
				return res.view('500', { message: "Internal server error." });
			}

			Feeds.update(req.param('id'),{is_deleted:1}).exec(function(err,_delete){
				return res.redirect("/events");
			});

		});
	},
};