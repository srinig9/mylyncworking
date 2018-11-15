// api/services/BlockUserService.js

module.exports = {
	_config: {
		model: ['BlockUser']
	},

	getBlockUsers: function (user_id) {
        var promise = new Promise(function (resolve, reject) {
        	BlockUser.find({user_id:user_id}).exec(function(err,data){
        		BlockUser.find({to_user_id:user_id}).exec(function(err,data1){
	        		if(err){
	        			resolve(false);
	        		}
					resultArray = [];
					resultArray1 = [];
					data.forEach(function(factor, index){
						resultArray.push(factor.to_user_id);
					});
					data1.forEach(function(found, index){
						resultArray1.push(found.user_id);
					});
                    finalArray = resultArray.concat(resultArray1);
	        		resolve(finalArray);
        		});
        	});
        });
        return promise;
    },

    unblockUser: function (block_id) {
    	var promise = new Promise(function (resolve, reject) {
	        BlockUser.find().where({ id:block_id}).then(function (_delete) {
				if (_delete && _delete.length > 0) {
					_delete[0].destroy().then(function (_delete) {
						resolve(true);
					}).catch(function (err) {
						resolve(false);
					});
				} else {
					resolve(false);
				}
			}).catch(function (err) {
				resolve(false);
			});
        });
        return promise;
    },

    BlockUserList:function(req,user_id){
    	var page_no=(typeof req.param('page_no')!='undefined' && req.param('page_no')!='')?req.param('page_no'):1;
	    return new Promise(function (resolve, reject) {
	      BlockUser.find({user_id:user_id})
	      .populate('to_user_id', {select : ['id','name','slug','profile_image']})
	      .populate('to_user_id.userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
	      .populate('to_user_id.userexperiences.company_id',{select: ['company_name','slug'],sort:{display_status:-1,current_work:-1},limit:1})
	      .sort('createdAt DESC')
	      .paginate({page: page_no, limit: 5})
	      .exec(function(err,blockusers){
	        if(err){
	          resolve({
	            error:err,
	            status: 'Error',
	            message:'Error found'
	          });
	        }

        if(blockusers.length>0){
            blockusers.forEach(function(factor, index){
              if(typeof blockusers[index].to_user_id!='undefined'){

                if(typeof blockusers[index].to_user_id.cover_image != 'undefined'){
                  delete blockusers[index].to_user_id.cover_image;
                }
                if(typeof blockusers[index].to_user_id.headline != 'undefined'){
                  delete blockusers[index].to_user_id.headline;
                }
                if(typeof blockusers[index].to_user_id.about_me != 'undefined'){
                  delete blockusers[index].to_user_id.about_me;
                }
                if(typeof blockusers[index].to_user_id.location != 'undefined'){
                  delete blockusers[index].to_user_id.location;
                }
                if(typeof blockusers[index].to_user_id.country != 'undefined'){
                  delete blockusers[index].to_user_id.country;
                }
                if(typeof blockusers[index].to_user_id.state != 'undefined'){
                  delete blockusers[index].to_user_id.state;
                }
                if(typeof blockusers[index].to_user_id.city != 'undefined'){
                  delete blockusers[index].to_user_id.city;
                }
                if(typeof blockusers[index].to_user_id.industry_id != 'undefined'){
                  delete blockusers[index].to_user_id.industry_id;
                }
                if(typeof blockusers[index].to_user_id.language_id != 'undefined'){
                  delete blockusers[index].to_user_id.language_id;
                }
                if(typeof blockusers[index].to_user_id.socket_id != 'undefined'){
                  delete blockusers[index].to_user_id.socket_id;
                }
                if(typeof blockusers[index].to_user_id.is_verify_phone != 'undefined'){
                  delete blockusers[index].to_user_id.is_verify_phone;
                }
                if(typeof blockusers[index].to_user_id.ethaddress != 'undefined'){
                  delete blockusers[index].to_user_id.ethaddress;
                }
                if(typeof blockusers[index].to_user_id.loginid != 'undefined'){
                  delete blockusers[index].to_user_id.loginid;
                }
                if(typeof blockusers[index].to_user_id.password != 'undefined'){
                  delete blockusers[index].to_user_id.password;
                }
                if(typeof blockusers[index].to_user_id.referral != 'undefined'){
                  delete blockusers[index].to_user_id.referral;
                }
                if(typeof blockusers[index].to_user_id.createdAt != 'undefined'){
                  delete blockusers[index].to_user_id.createdAt;
                }
                if(typeof blockusers[index].to_user_id.updatedAt != 'undefined'){
                  delete blockusers[index].to_user_id.updatedAt;
                }
                if(typeof blockusers[index].to_user_id.referral != 'undefined'){
                  delete blockusers[index].to_user_id.referral;
                }
                if(typeof blockusers[index].to_user_id.status != 'undefined'){
                  delete blockusers[index].to_user_id.status;
                }
                
                if(typeof blockusers[index].to_user_id.userexperiences!='undefined' && blockusers[index].to_user_id.userexperiences.length>0){
                    if(typeof blockusers[index].to_user_id.userexperiences[0].description!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].description;
                    }
                    if(typeof blockusers[index].to_user_id.userexperiences[0].from_month!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].from_month;
                    }
                    if(typeof blockusers[index].to_user_id.userexperiences[0].from_year!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].from_year;
                    }
                    if(typeof blockusers[index].to_user_id.userexperiences[0].to_year!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].to_year;
                    }
                    if(typeof blockusers[index].to_user_id.userexperiences[0].to_month!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].to_month;
                    }
                    if(typeof blockusers[index].to_user_id.userexperiences[0].display_status!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].display_status;
                    }
                    if(typeof blockusers[index].to_user_id.userexperiences[0].createdAt!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].createdAt;
                    }
                    if(typeof blockusers[index].to_user_id.userexperiences[0].updatedAt!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].updatedAt;
                    }
                    if(typeof blockusers[index].to_user_id.userexperiences[0].user_id!='undefined'){
                      delete blockusers[index].to_user_id.userexperiences[0].user_id;
                    }
                  }
                }
                delete blockusers[index].user_id;
            });
          }
        resolve({blockusers});
      });
    });
  },

blockUser: function (owner_id,to_user_id) {
  var _new = {
        user_id: owner_id, //req.user.id,
        to_user_id:to_user_id
      };
	var promise = new Promise(function (resolve, reject) {
	  	BlockUser.create(_new).exec(function(err,_user){
				if(err){
					resolve(false);
				}
				resolve(true);
			});
		});
		return promise;
  },
}
