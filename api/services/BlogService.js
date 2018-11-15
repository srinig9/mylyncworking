/**
 * BlogsService
 *
 * @description :: Server-side logic for managing blogs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var path = require("path");
var datetime = require('node-datetime');

module.exports = {

	blogcategory: function(req, user_id) {
		return new Promise(function (fulfill, reject){
			if(req.param("category_name")!=''){
				var _newBlogCategory = {
					name:req.param("category_name")
				}
				BlogCategory.create(_newBlogCategory).exec(function (err,found) {
					if(typeof found.id != 'undefined') {
						/* Activity Log Insert */
						ActivityLogsService.addActivityLog({
							owner_id: user_id,
							module: 'blog',
							action: 'label_create',
							object_id: found.id,
							type: 'api'
						});
					}
					fulfill(found);
				});
			}else{
				fulfill("");
			}
		});
	},

	bloglist: function(req, user_id, type) {
		var user_id = user_id;
		var page = 1;
		var limit = 10;
		if(req.param("page_no") != undefined){
			page = req.param("page_no");
		}
		var filter = '';

		return new Promise(function (fulfill, reject){
			
			if(type == 'A'){
				filter = {type:"B", is_deleted : { "!" : 1 }};
			}else{
				filter = {type:"B",user_id:user_id, is_deleted : { "!" : 1 }};
			}
			Feeds.count(filter).exec(function countCB(err,count){
				Feeds.find(filter)
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
				.paginate({page: page, limit: limit})
				.sort('createdAt DESC')
				.exec(function(err,found){
					fulfill({bloglist:found,totalblogs:count});
				});
			});
		});
	},

	bloglabels: function(req,res){
		return new Promise(function (fulfill, reject){
			BlogCategory.find().populate("blogcategories").sort("name ASC").exec(function(err,response){
				fulfill(response);
			});
		});
	},

	blogarchive: function(req,res){
		var mL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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

	index: function(req,user_id) {
        var self = this;
        
        return new Promise(function (fulfill, reject) {
            self.bloglist(req,user_id,'A').then(function(data) {
                fulfill({
                    blogs:data.bloglist,
                    totalblogs:data.totalblogs,
					'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url,
					'feedmedia_url':sails.config.appUrlwPort + sails.config.feedmedia_url,
                });
            });
        });
	},

	getBlogCatagory: function(req,user_id){
		return new Promise(function (fulfill, reject) {
            BlogCategory.find().sort("createdAt DESC").exec(function(err,categories){
                if(err) fulfill(false);
                fulfill(categories);
            })
        })
	},

	store: function(req,user_id){

        return new Promise(function (fulfill, reject) {
		// console.log("Inside Store");
		
        // Check Slug
        
        var slug = req.param("title").replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, '-').toLowerCase();
		Feeds.find({slug:slug}).exec(function(err,found){
			var blog_slug = "";
			if(found.length > 0){
				blog_slug =  slug + Math.floor(Math.random()*(1-10000+1)+1);
			}else{
				blog_slug =  slug;
			}

			BlogService.blogcategory(req,user_id).then(function(blogcategory){
				category_id = req.param("category_id");
				if(blogcategory){
					category_id = blogcategory.id;
				}
				var _newFeed = {
					status: 1,
					type: "B",
					user_id: user_id,
					group_id: "",
					title: req.param("title"),
					feed_details: req.param("feed_details"),
					slug: blog_slug,
					category_id: category_id,
					privacy: req.param("privacy")
				};

				Feeds.create(_newFeed).then(function (_feed) {
					var feed_id = _feed.id;
                    /* Upload Image */
                    try{
                        req.file('avatar').upload({
                            dirname: path.resolve(sails.config.appPath, 'assets/uploads/feeds')
                        },function (err, uploadedFiles) {
                            if(uploadedFiles.length > 0){
                                var fd = uploadedFiles[0].fd;
                                var myarr = fd.split("\\");
                                var filename = path.basename(myarr[myarr.length-1]);

                                var _newMedia = {
                                    feed_id: feed_id,
                                    image: filename
                                };

                                FeedMedia.create(_newMedia).exec(function (err, _image) {
                                    if(err){
                                        fulfill(false);
                                    }
                                });
                            }
                        });
                        fulfill(feed_id);
                    }catch(e){
                        fulfill(feed_id);
                    }
		        }).catch(function (err) {
                    fulfill(false);
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
		var user_id = req.user.id;
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
					UserDataService.UserDetails(req,req.user.id).then(function(userInfo){
						array = [];
						found.forEach(function(factor, index){
							temp = [];
							temp = factor;
							totalLikes = 0;
							totaldislikes = 0;
							isliked = 0;
							isdisliked = 0;
							feedlikes = factor.feedlikes;
							
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
						return res.view('blog/details',{
							status:"OK",
							title:"Blog",
							blogs:array,
							labels:_labels,
							archives:_archives,
							userData:userInfo
						});
					});
				});
			});
		});
	},

	myblogs: function(req,user_id){
        console.log("vome");
        return new Promise(function (fulfill, reject) {
            BlogService.bloglist(req,user_id,'O').then(function(_blogs){
				fulfill({blogs:_blogs.bloglist,
					'profile_image_url': sails.config.appUrlwPort + sails.config.profile_image_url,
					'feedmedia_url':sails.config.appUrlwPort + sails.config.feedmedia_url});
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
		console.log(req.file('file'));
		req.file('file').upload({
			dirname: path.resolve(sails.config.appPath, 'assets/uploads/wysiwyg')
		},function (err, uploadedFiles) {
			console.log(uploadedFiles);
			if(uploadedFiles.length > 0){
				var fd = uploadedFiles[0].fd;
				var myarr = fd.split("\\");
				var filename = path.basename(myarr[myarr.length-1]);
				var imgUrl = {"link":sails.config.appUrlwPort+'/uploads/wysiwyg/'+filename};
				return res.json(imgUrl);
			}else{
				return res.json("Error");
			}
		});
	}
};

