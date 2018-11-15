var Promise = require('promise');

module.exports = {
    _config: {
        model: []
    },
    getUserPrivacy : function(req,user_id) {
        return new Promise(function (resolve, reject) {
            UserPrivacySettings.find({select:['privacy_option_id'],user_id:user_id}).exec(function(err,userprivacy){
                if(err) resolve(false);
                if(userprivacy == undefined){
                    resolve([]);
                } else {
                    resolve(userprivacy);
                }
            });
        });
    },
    getUserPrivacyOption : function(req,user_id) {
        return new Promise(function (resolve, reject) {
            Privacy.find().populate('privacyoptions').exec(function(err,privacy) {
                if(err) resolve(false)
                resolve(privacy);
            });
        });
    },
    StorePrivacySetting: function(req,user_id){
        var user_setting    = [];
        var privacy_option  = req.param('privacy_option_id');
        var userID          = user_id;
        //user setting array
        
        return new Promise(function (resolve, reject) {
            privacy_option.forEach(function(ids, index){
                var _newRecord = {
                    user_id             : userID,
                    privacy_option_id   : ids
                };
                if(userID!='') {
                    user_setting.push(_newRecord);
                }
            });
            //delete all and store user settings
            UserPrivacySettings.destroy({user_id:userID}).exec(function (err){
                if(err){ 
                    return res.negotiate(err); 
                }
                UserPrivacySettings.create(user_setting).then(function (data) {
                    data.forEach(function(single_data, index){
                        if(typeof single_data.id != 'undefined') {
                            /* Activity Log Insert */
                            ActivityLogsService.addActivityLog({
                                owner_id: user_id,
                                module: 'user_privacy',
                                action: 'update',
                                object_id: single_data.id,
                                type: 'web'
                            });
                        }
                    });
                    resolve({
                        status: 'OK',
                        msg:'Privacy settings save successfully'
                    });
                }).catch(function (error) {
                   resolve({
                        status: 'Error',
                        msg: '* fields are required'
                    });
                });
            });
        });
    },
}