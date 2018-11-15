// api/services/FollowService.js
var Promise = require('promise');
module.exports = {
    _config: {
        model: ['Follow']
    },

    /**
     *
     * @required {String} emailAddress
     *   The email address of the recipient.
     */
     
    Follow: function(res) {
		var user_id = res.user_id,
		company_id= res.company_id;

        if (company_id != '' && user_id != '') {
            Follow.find({ company_id: company_id,user_id: user_id}).exec(function(err, found) {
            	if(err){ return false;}

                if (found.length == 0) {
                    var _newfollow = {
                      	user_id: user_id,
						company_id: company_id,
                        status: '0',
                        is_authorized: '0',
                        is_member: '0'
                    };
                    Follow.create(_newfollow).exec(function(err, _follow) {
                    	if(err){return false;}
                      if(_follow){
                      	return true;
                      }
                    });
                }else{
                	return true;
                }
            });
        }
    },
    companyFollowCount :  function(res,company_id) {
        return new Promise(function (resolve, reject){ 
            Follow.count({}).exec(function(err, _follow_count) {
                if(err) resolve(0);
                if(_follow_count != undefined && _follow_count > 0){
                    resolve(_follow_count);
                } else {
                    resolve(0);
                }
            });
        });
    }
};