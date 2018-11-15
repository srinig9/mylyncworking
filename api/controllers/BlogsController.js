/**
 * BlogsController
 *
 * @description :: Server-side logic for managing blogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require("path");
var datetime = require('node-datetime');
var fs = require('fs');
var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


module.exports = {

	blogcategory: function(req, res) {
		return new Promise(function (fulfill, reject){
			if(req.param("category_name")!=''){
				var _newBlogCategory = {
					name:req.param("category_name")
				}
				BlogCategory.create(_newBlogCategory).exec(function (err,found) {
					if(typeof found.id != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: req.user.id,
							module: 'blog',
							action: 'label_create',
							object_id: found.id,
							type: 'web'
						});
					}
					fulfill(found);
				});
			}else{
				fulfill("");
			}
		});
	},

	bloglist: function(req, res, type) {
		var user_id = (typeof req.user!='undefined' && req.user!='')?req.user.id:0;
		var page = 1;
		var limit = 10;
		if(req.param("page_no") != undefined){
			page = req.param("page_no");
		}
		var filter = '';
		return new Promise(function (fulfill, reject){
			var where_condition = '';

			if(type == 'A'){
				//filter = {type:"B", is_deleted : { "!" : 1 }};
				filter = {type:"B"};
				where_condition = {"user_id":{status:{"$ne":"0"}},"is_deleted":{ "!" : 1 }};
			}else{
				//filter = {type:"B",user_id:user_id, is_deleted : { "!" : 1 }};
				filter = {type:"B",user_id:user_id};

				where_condition = {"user_id":{status:{"$ne":"0"},id:user_id},"is_deleted":{ "!" : 1 }};
			}

			if(typeof req.param('label') !='undefined' && req.param('label') !=''){
				filter.category_id = req.param('label');
			}
			BlockUserService.getBlockUsers(user_id).then(function(blockusers){
				Feeds.count(filter).exec(function countCB(err,count){
					if(err){
						console.log("Blog List Count Error");
						console.log(error);
						fulfill({bloglist:[],totalblogs:0});
					}

					Feeds.find(filter)
					.where(where_condition)
					.populate('user_id', { select: ['name','id'] })
					.populate('user_id.company_id',{select:['company_name','slug']})
					.populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
					.populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
					.populate('feedcomments', { where:{'user_id':{id: {"!":blockusers},status: {"!":"0"}}}, sort: 'createdAt ASC' })
					.populate('feedcomments.user_id.company_id')
					.populate('feedcomments.commentlikes')
					.populate('feedcomments.commentreply')
					.populate('feedcomments.commentreply.commentlikes')
					.populate('feedcomments.commentreply.user_id.company_id')
					.populate('feedmedias')
					.populate('feedlikes', { where:{'user_id':{id: {"!":blockusers},status: {"!":"0"}}}, sort: 'createdAt ASC' })
					.paginate({page: page, limit: limit})
					.sort('createdAt DESC')
					.exec(function(err,found){
						if(err){
							fulfill({bloglist:[],totalblogs:0});
						}
						fulfill({bloglist:found,totalblogs:count});
					});
				});
			});
		});
	},

	load_more_blog: function(req,res){
		var self = this;
		self.bloglist(req,res,req.param("type")).then(function(data){
			if(data.bloglist.length == 0){
				return res.json({blogs:false});
			}
			return res.render('ajax/load_more_blog',{
				blogs:data.bloglist
			});
		});
	},

	bloglabels: function(req,res){
		return new Promise(function (fulfill, reject){
			var condition = {
				'blogcategories':{
					id : {
						"$exists" : true,
						"$ne" : ""
					},
				}
			};

			BlogCategory.find(condition)
			.populate("blogcategories",{select:['id']})
			.sort("name ASC")
			.exec(function(err,response){
				if(err){
					fulfill([]);
				}
				fulfill(response);
			});
		});
	},

	blogarchive: function(req,res){
		return new Promise(function (fulfill, reject){
			Feeds.native(function(err,collection) {
				collection.aggregate([
				{
					$match:{
						type:'B'
					}
				},
				{
					$group: {
						_id: { 
							month: { $month: "$createdAt" }, 
							year: { $year: "$createdAt" } 
						},
						numberofbookings: {$sum: 1}
					}
				}
				],function(err,_data) {
					if(err){
						console.log("Blog archives Error");
						console.log(err);
						fulfill([]);
					}

					var newArray = {};
					if(typeof _data != 'undefined' && _data.length > 0) {
						_data.forEach(function(factor, index){
							var year = JSON.stringify(_data[index]['_id']['year']);
							if(typeof newArray[year] == 'undefined') {
								newArray[year] = [];
							}
							newArray[year].push({ month: mL[factor._id.month-1], total: factor.numberofbookings });
						});
					}
					fulfill(newArray);
				});
			});
		});
	},

	index: function(req,res){
		var self = this;
		var user_id = (typeof req.user!='undefined' && req.user!='')?req.user.id:0;
		var isLogin = (user_id!=0)?1:0;

		self.bloglist(req,res,'A').then(function(data){
			self.bloglabels(req).then(function(_labels){
				self.blogarchive(req).then(function(_archives){
					 var responseArray = {
						 		status:"OK",
								title:"Blog list",
								blogs:data.bloglist,
								isLogin:isLogin,
								totalblogs:data.totalblogs,
								labels:_labels,
								archives:_archives
						 	};
					if(user_id!=0){
						UserDataService.UserDetails(req,user_id).then(function(userInfo){
            				BlockUserService.getBlockUsers(user_id).then(function(blockusers){
            					responseArray['userData'] = userInfo;
            					return res.view('blog/list',responseArray);
            				});
						});
					}else{
						responseArray['layout'] = 'layouts/profilelayout';
						return res.view('blog/list',responseArray);
					}
				});
			});
		});
	},

	create: function(req,res){
		var _blogs = {
			id:"",
			title:"",
			feed_details:"",
			category_id:"",
			slug:""
		};
		BlogCategory.find().sort("createdAt DESC").exec(function(err,categories){
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				return res.view('blog/create',{
					status:"OK",
					title:"Create Blog",
					actionurl:"/blogs/store",
					btnname:"Post Blog",
					categories:categories,
					blogs:_blogs,
					userData:userInfo
				});
			 });
		})
	},

	store: function(req,res){
		// console.log("Inside Store");
		var self = this;
		// Check Slug
		Feeds.find({slug:req.param("slug")}).exec(function(err,found){
			var blog_slug = "";
			if(found.length > 0){
				blog_slug =  req.param("slug") + Math.floor(Math.random()*(1-10000+1)+1);
			}else{
				blog_slug =  req.param("slug");
			}

			self.blogcategory(req).then(function(blogcategory){
				category_id = req.param("category_id");
				if(blogcategory){
					category_id = blogcategory.id;
				}
				var _newFeed = {
					status: 1,
					type: "B",
					user_id: req.user.id,
					group_id: "",
					title: req.param("title"),
					feed_details: req.param("feed_details"),
					slug: blog_slug,
					category_id: category_id,
					privacy: req.param("privacy")
				};

				Feeds.create(_newFeed).then(function (_feed) {
					if(typeof _feed.id != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: req.user.id,
							module: 'blog',
							action: 'create',
							object_id: _feed.id,
							type: 'web'
						});
					}
		        	var feed_id = _feed.id;
					/* Upload Image */
					if(typeof req.param("files")!='undefined' && req.param("files")!=''){
						var _newMedia = {
							feed_id: feed_id,
							image: req.param("files")
						};
						FeedMedia.create(_newMedia).exec(function (err, _image) {
							if(err){
			                    return res.view('500',{
			                    	message: err 
		                    	});
							}
						});
					}
					return res.redirect("/blogs")
		        }).catch(function (err) {
		            console.error(JSON.stringify(err));
		            return res.view("/blogs", {
		                contact: _newFeed,
		                status: 'Error',
		                statusDescription: err,
		                title: 'Add a new contact'
		            });
		        });
			});
		});
	},

	edit: function(req,res){
		var user_id = req.user.id;
		Feeds.findOne({id: req.param("id")}).exec(function(err,_blogs){
			BlogCategory.find().sort("createdAt DESC").exec(function(err,categories){
				if(_blogs.user_id != user_id){
					return res.redirect("/blogs/myblogs")
				}
				return res.view('blog/create',{
					blogs:_blogs,
					actionurl:"/blogs/update",
					btnname:"Update Blog",
					categories:categories
				});
			});
		});
	},

	update: function(req,res){
		var self = this;
		// console.log("INSIDE BLOG UPDATE");
		self.blogcategory(req).then(function(blogcategory){
			category_id = req.param("category_id");
			if(blogcategory){
				category_id = blogcategory.id;
			}
			var _updateFeed = {
				title: req.param("title"),
				feed_details: req.param("feed_details"),
				category_id: category_id
			};

			Feeds.update(req.param('id'),_updateFeed).exec(function(err,_blogs){
				if(err){
                    return res.view('500', {message: "Something went wrong. Please try again."});
				}

				var feed_id = _blogs[0].id;

				FeedMedia.find({feed_id: feed_id}).exec(function(err,_media){
					/* Upload Image */
					req.file('avatar').upload({
						dirname: path.resolve(sails.config.appPath, 'assets/uploads/feeds'),
						maxBytes: 7000000,  //7mb
					},function (err, uploadedFiles) {
						array = [];
						if(uploadedFiles.length > 0){
							var fd = uploadedFiles[0].fd;
							var myarr = fd.split("\\");
							var filename = path.basename(myarr[myarr.length-1]);
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
				return res.redirect("/blogs/myblogs");
			});
		});
	},

	details: function(req,res){
		var user_id = (typeof req.user!='undefined' && req.user!='')?req.user.id:0;
		var self = this;
		self.bloglabels(req).then(function(_labels){
			self.blogarchive(req).then(function(_archives){
				Feeds.find({slug:req.param("slug")})
				.populate('user_id', { select: ['name','id'] })
				.populate('user_id.company_id',{select:['company_name','slug']})
				.populate('user_id.userexperiences',{select:['title'],limit:1,sort:{display_status:-1,current_work:-1}})
				.populate('user_id.userexperiences.company_id',{select:['company_name'],limit:1,sort:{display_status:-1,current_work:-1}})
				.populate('feedcomments', { sort: 'createdAt ASC' })
				.populate('feedcomments.user_id.company_id')
				.populate('feedcomments.commentlikes')
				.populate('feedcomments.commentreply')
				.populate('feedcomments.commentreply.commentlikes')
				.populate('feedcomments.commentreply.user_id.company_id')
				.populate('feedmedias')
				.populate('feedlikes')
				.sort('createdAt DESC')
				.exec(function(err,found){
					
						array = [];
						var blog_title= '';

						found.forEach(function(factor, index){
							temp = [];
							temp = factor;
							totalLikes = 0;
							totaldislikes = 0;
							isliked = 0;
							isdisliked = 0;
							feedlikes = factor.feedlikes;
							blog_title = factor.title+' | Lynked World';

							feedlikes.forEach(function(factor1, index){
								temp2 = [];
								temp2 = factor1;
								if(factor1.status==1){
									totalLikes = totalLikes+1;
								}
								if(factor1.status==2){
									totaldislikes = totaldislikes+1;
								}
								if(factor1.status==2 && factor1.user_id==user_id){
									isdisliked = 1;
								}
								if(factor1.status==1 && factor1.user_id==user_id){
									isliked = 1;
								}
							});
							temp['totalLikes'] = totalLikes; 
							temp['totaldislikes'] = totaldislikes; 
							temp['isliked'] = isliked; 
							temp['isdisliked'] = isdisliked; 
							array.push(temp);
						});
						if(err){
							return res.view('500', {message: "Internal server error."});
						}

						 var responseArray = {
						 		status:"OK",
								title:"Blog",
								blogs:array,
								labels:_labels,
								title:blog_title,
								archives:_archives
						 };

						 if(user_id!=0){
						 	UserDataService.UserDetails(req,user_id).then(function(userInfo){
                                    responseArray['userData']=userInfo;
                                    responseArray['isLogin']=1;
                            	return res.view('blog/details', responseArray);
                        	});
                        }else{
                             	responseArray['isLogin']=0;
                                responseArray['layout'] = 'layouts/profilelayout';
                            return res.view('blog/details', responseArray);
                        }
				});
			});
		});
	},

	myblogs: function(req,res){
		var self = this;
		self.bloglist(req,res,'O').then(function(_blogs){
			UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
				return res.view('blog/myblog',{
					blogs:_blogs.bloglist,
					totalblogs:_blogs.totalblogs,
					userData:userInfo,
					title:'My Blog List'
				});
			});
		});
	},

	delete: function(req,res){
		Feeds.findOne({id:req.param('id')}).exec(function(err,_blog){
			if(req.user.id!=_blog.user_id){
				return res.view('500', {message: "Internal server error."});
			}

			Feeds.update(req.param('id'),{is_deleted:1}).exec(function(){
				return res.redirect("/blogs/myblogs");
			});

		});
	},	

	wysiwygUpload:function(req,res){
		
		var uploadPath = "./.tmp/public/uploads/wysiwyg";

		req.file('file').upload({
			dirname: path.resolve(sails.config.appPath, uploadPath)
		},function (err, uploadedFiles) {
			console.log(uploadedFiles);
			if(uploadedFiles.length > 0){
				var fd = uploadedFiles[0].fd;
				var myarr = fd.split("\\");
				var filename = path.basename(myarr[myarr.length-1]);
				var imgUrl = {"link":sails.config.appUrlwPort+'/uploads/wysiwyg/'+filename};
				/* Copy .tmp to upload folder*/
				fs.readFile(fd, function (err, data) {
					fs.writeFile(sails.config.appPath+'/assets/uploads/wysiwyg/'+filename, data, function (err) {

					});
				});

				return res.json(imgUrl);
			}else{
				return res.json("Error");
			}
		});
	},

    uploadFiles:function(req,res){
		req.file('avatar').upload({
			dirname: require('path').resolve(sails.config.appPath, './.tmp/public/uploads/feeds')
		},function (err, uploadedFiles) {

			var array = [];
			var insertData = [];
			if(uploadedFiles.length > 0){
				var fd = uploadedFiles[0].fd;
				uploadedFiles.forEach(function(factor, index){
					array.push(factor.fd);
				});
				array.forEach(function(imagepath, index){
					var myarr = imagepath.split("\\");
					var filename = path.basename(myarr[myarr.length-1]);
					fs.readFile(fd, function (err, data) {
						fs.writeFile(sails.config.appPath+'/assets/uploads/feeds/'+filename, data, function (err) {

						});
					});
					var _newMedia = { image: filename };
					insertData.push(_newMedia);
				});
			}
			return res.json(insertData);
		});
    },	
};

