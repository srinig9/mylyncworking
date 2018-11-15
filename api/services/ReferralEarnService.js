// api/services/ReferralEarnService.js

module.exports = {
	_config: {
		model: ['Users','UserReferralUsed','EarnRewards']
	},

	recursiveEarn: function (used_referral_id,referral_user_id,amount) {
        var self = this;
        var promise = new Promise(function (resolve, reject) {
            UserReferralUsed.find({user_id:referral_user_id}).exec(function(err,_referral){
                if(_referral.length > 0){
                    //console.log("Referal Found");
                    if(amount==0){
                        resolve("COMPLETE")
                    }else{
                        var _newEarnReward = {
                            used_referral_id:used_referral_id,
                            user_id:_referral[0].referral_user_id,
                            amount: amount,
							type: 'referral'
                        };
                        EarnRewards.create(_newEarnReward).exec(function(err,result){
                            /* Add Notification */
                            EarnRewards.findOne({id:result.id})
                            .populate("used_referral_id")
                            .populate("used_referral_id.user_id",{select:['name','slug','profile_image']})
                            .populate("used_referral_id.referral_user_id",{select:['name','slug','profile_image']})
                            .exec(function(err,data){
                                var textdata = "You have earned LBD("+data.amount+") From "+data.used_referral_id.user_id.name+" to "+data.used_referral_id.referral_user_id.name;

                                NotificationService.addNotification({
                                    user_id: data.user_id,
                                    feed_id: "",
                                    from_user_id: data.used_referral_id.referral_user_id.id,
                                    notification_text: textdata,
                                    type: 'web'
                                });

                                amount = amount-1;
                                self.recursiveEarn(used_referral_id,_referral[0].referral_user_id,amount);
                            });
                        });
                    }
                }else{
                    resolve("COMPLETE")
                }
            });
        });
        return promise;
    },

    referralEarning : function(user_id,referral){
        var self = this;
        var promise = new Promise(function (resolve, reject) {
        referral = referral.trim();
        referral = referral.replace(/\-/g,'');
        referral = referral.replace(/ /g, '');
        if(user_id!='' && referral!='')
        {
            Users.find({referral: referral}).exec(function(err, _user) {
                var referral_issues=0;
                if(_user.length > 0){
                    var user = _user[0];
                    if(typeof user.id == 'undefined'){
                        referral_issues=1;
                        resolve("FAIL");
                    }else {
                        var _newReferral = {
                        user_id: user_id,
                        referral_user_id: user.id
                        };
                    
                        UserReferralUsed.create(_newReferral).then(function (_userReferral) {
                            if(typeof _userReferral.id != 'undefined') {
                                var referral_id = _userReferral.id;

                                /* Earn from Referral */
                                var userIds = [user_id,user.id];
                                userIds.forEach(function(value, index){
                                    var _newEarnReward = {
                                        used_referral_id:_userReferral.id,
                                        user_id:value,
                                        amount: "5",
                                        type: 'referral'
                                    };

                                EarnRewards.create(_newEarnReward).exec(function(err,result){
                                    /* Add Notification */
                                    EarnRewards.findOne({id:result.id})
                                    .populate("used_referral_id")
                                    .populate("used_referral_id.user_id",{select:['name','slug','profile_image']})
                                    .populate("used_referral_id.referral_user_id",{select:['name','slug','profile_image']})
                                    .exec(function(err,data){
                                        var textdata = "You have earned LBD("+data.amount+") From "+data.used_referral_id.user_id.name+" to "+data.used_referral_id.referral_user_id.name;
                                        
                                        NotificationService.addNotification({
                                            user_id: data.user_id,
                                            feed_id: "",
                                            from_user_id: data.used_referral_id.referral_user_id.id,
                                            notification_text: textdata,
                                            type: 'web'
                                        });
                                        
                                        if(user_id!=value){
                                            self.recursiveEarn(referral_id,user.id,2).then(function(data){
                                            });
                                        }
                                    });
                                });
                            });
                        }
                            resolve("COMPLETE");
                    });
                }
            }
        });
    }else{
        resolve("FAIL");
    }
    });
    return promise;
    }
}