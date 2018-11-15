/**
 * ApplyjobController
 *
 * @description :: Server-side logic for managing applyjobs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var path = require("path");
var fs = require('fs');

module.exports = {

	follow: function(req, res) {
		return new Promise(function (fulfill, reject){
			var _newfollow = {
			    company_id: req.param("company_id"),
			    user_id: req.user.id,
			    status: '0',
			    is_authorized: '0',
			    is_member: '0'
			};
			if(req.param("isFollowed")=='1'){
		        Follow.find({company_id: req.param("company_id"), user_id: req.user.id}).exec(function(err,found){
		        	if(found.length < 0 && req.param("company_id")!=""){
						Follow.create(_newfollow).exec(function(err,_follow){
							fulfill(_follow);
						});
		        	}
        			fulfill("");
		        });
			}else{
				fulfill("");
			}
		});
	},

	apply:function(req,res){
		var self = this;

		var _newapplyJob = {
				user_id: req.user.id,
				feed_id: req.param("job_id"),
				company_id: req.param("company_id"),
			};
		if(req.param("job_id")=='undefined' || req.param("job_id")==''){
			return res.json({
				status: "Error",
				msg: "Job ID can not blank"
			});
		}

		Applyjob.count({user_id:req.user.id,feed_id:req.param("job_id")}).exec(function countCB(error, found) {
			if(found>0){
				return res.json({
					status: "Error",
					msg: "You have already applied for this Job"
				});
			}

			req.file('filename').upload({
				dirname: require('path').resolve(sails.config.appPath, 'assets/uploads/applyjob'),
				maxBytes: 5000000,  //7mb
			},function (err, uploadedFiles) {
				if(err){
					return res.json({
						status: "Error",
						msg: "Something went wrong. Please try again."
					});
				}
				else if(uploadedFiles.length==0){
					_newapplyJob.resume='';
				}
				else{

	            	var allowedTypes = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/doc', 'application/docx', 'application/DOC', 'application/DOCX'];
	            	var extension = uploadedFiles[0].type;

	            	console.log(extension);

	            	if(allowedTypes.indexOf(extension)=== -1){
	              		return res.json({
	              			status:'Error',
	             			msg: 'File type is not valid'
	            		});
	            	}

	            	var fd = uploadedFiles[0].fd;
	                var myarr = fd.split("\\");
	                var filename = path.basename(myarr[myarr.length-1]);
	                _newapplyJob.resume = filename;
				}

				Applyjob.create(_newapplyJob).exec(function(err,_data){
					if(err){
						return res.json({
							status: "Error",
							msg: "Something went wrong. Please try again111."
						});
					}

					self.follow(req,req.param("type")).then(function(data){
						return res.json({
							status: "OK",
							msg: "Job has been applied successfully"
						});
					});
				});
			});
		});
	},

	delete:function(req,res){
		Applyjob.find().where({ id: req.param("id") }).then(function (_delete) {
			if (_delete && _delete.length > 0) {
				_delete[0].destroy().then(function (_delete) {
					return res.redirect("/jobs/myapplication");
				}).catch(function (err) {
					return res.redirect("/jobs/myapplication");
				});
			} else {
				return res.redirect("/jobs/myapplication");
			}
		}).catch(function (err) {
			return res.redirect("/jobs/myapplication");
		});
	},
};