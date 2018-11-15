// api/services/UserConnectionService.js

module.exports = {
	_config: {
		model: ['UserConnection','Follow','Users']
	},

	getUserConnection: function (user_id) {
        var promise = new Promise(function (resolve, reject) {
            BlockUserService.getBlockUsers(user_id).then(function(blockusers){
                UserConnection.find({to_user_id: user_id,status:'1' }).exec(function(err, connection){
                    UserConnection.find({user_id: user_id,status:'1' }).exec(function(err, connection1){
                        connarray = [];
                        connarray1 = [];
                        connection1.forEach(function(factor, index){
                            connarray1.push(factor.to_user_id);
                        });
                        connection.forEach(function(factor, index){
                            connarray.push(factor.user_id);
                        });
                        user_ids = connarray1.concat(connarray);
                        user_ids = user_ids.filter(val => !blockusers.includes(val));
                        Users.find({id:{"$in":user_ids},status:{"$ne":"0"}}).exec(function(err,_users){
                            userIDs = [];
                            _users.forEach(function(factor, index){
                                userIDs.push(factor.id);
                            });
                            resolve(userIDs);
                        })
                    });
                });
            });
        });
        return promise;
    },

    getCompanyYouFollow: function (user_id,page_no = 1,limit=null) {
        var limit = (limit==null) ? 9 : limit;
        var promise = new Promise(function (resolve, reject) {
            var follows = [];
            Follow.find({user_id:user_id,select:['status','company_id']}).populate('company_id.companydata').exec(function(err, res_follow){
                res_follow.forEach(function(factor, index){
                    if(typeof factor.company_id!='undefined' && typeof factor.company_id.companydata!='undefined'){
                        if(factor.company_id.companydata.length>0){
                            follows.push(factor.company_id.companydata[0].id);
                        }
                    }
                });
                var page = page_no;
                var condition = {
                    id: {"$nin" : follows},
                    'company_id':{
                        id : {
                            "$exists" : true,
                            "$ne" : ""
                        },
                    },
                    "$or" : [
                        {is_verify_phone : 1},
                        {is_verify_email : 1}
                    ]
                };
                Users.count(condition).exec(function countCB(error, count) {
                    Users.find(condition).populate('company_id',{select:['company_name','slug']}).paginate({page: page, limit: limit}).sort('company_id DESC').exec(function(err,result){
                            var finalresult = {companyyoufollow:result,totalcompany:count};
                            resolve(finalresult);
                    });
                });
            });
        });
        return promise;
    },

    getPeopleYouKnow: function (user_id,page_no = 1,limit=null) {
        var limit = (limit==null) ? 9 : limit;
        var promise = new Promise(function (resolve, reject) {
            var follows = [];
            BlockUserService.getBlockUsers(user_id).then(function(blockusers){
                UserConnection.find({to_user_id: user_id }).exec(function(err, connection){
                    UserConnection.find({user_id: user_id }).exec(function(err, connection1){
                        Follow.find({user_id:user_id,select:['status']}).populate('company_id.companydata',{select:['company_id']}).exec(function(err, res_follow){
                            res_follow.forEach(function(factor, index){
                                if(typeof factor.company_id!='undefined' && typeof factor.company_id.companydata!='undefined'){
                                    if(factor.company_id.companydata.length>0){
                                        follows.push(factor.company_id.companydata[0]['id']);
                                    }
                                }
                            });
                            connarray = [];
                            connarray1 = [];
                            connection1.forEach(function(factor, index){
                                connarray1.push(factor.to_user_id);
                            });
                            connection.forEach(function(factor, index){
                                connarray.push(factor.user_id);
                            });
                            myconnections = connarray1.concat(connarray);
                            blockusers = blockusers.concat([user_id]);
                            connection_ids = myconnections.concat(blockusers);
                            connection_ids = connection_ids.concat(follows);

                            var page = page_no;

                            var condition = {
                                id: {"$nin" : connection_ids},
                                status: {"$ne" : "0"},
                                'company_id': null,
                                "$or" : [
                                    {is_verify_phone : 1},
                                    {is_verify_email : 1}
                                ]
                            };

                            Users.count(condition).exec(function countCB(error, count) {
                                Users.find(condition).populate('company_id',{select:['id','company_name','slug']}).populate('userexperiences',{limit:1,select:['title','company_name'],sort:'current_work DESC'}).paginate({page: page, limit: limit}).sort('createdAt DESC').exec(function(err,result){
                                    var finalresult = {peopleyouknow:result,totalpeople:count};
                                    resolve(finalresult);
                                });
                            });
                        });
                    });
                });
            });
        });
        return promise;
    },

    getRequestReceived: function (user_id,page_no = 1) {
        var promise = new Promise(function (resolve, reject) {
            var page = page_no;
            BlockUserService.getBlockUsers(user_id).then(function(blockusers){
                UserConnection.find({to_user_id: user_id,status:'0','user_id.id':{'!':blockusers}})
                .where({"user_id":{status:{"$ne":"0"}}})
                .populate('user_id')
                .populate('user_id.receiverequest',{select:['createdAt'],sort:'createdAt DESC'})
                .populate('user_id.company_id',{select:['company_name','slug']})
                .populate('user_id.userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
                .populate('user_id.userexperiences.company_id',{select: ['company_name'],sort:{display_status:-1,current_work:-1},limit:1})
                .paginate({page: page, limit: 3}).sort('createdAt DESC').exec(function(err,result){

                    UserConnection.count().where({to_user_id: user_id,status:'0','user_id.id':{'!':blockusers},'user_id.status':{"$ne":"0"} }).populate('to_user_id').exec(function(err,counts){
                        resolve({requestreceived:result,totalrequestreceived:counts});
                    });
                });
            });
        });
        return promise;
    },

    getSentRequest: function (user_id,page_no = 1,no_of_record) {
        
        var promise = new Promise(function (resolve, reject) {
            var page = page_no;

            BlockUserService.getBlockUsers(user_id).then(function(blockusers){
                
                UserConnection.find({user_id: user_id,status:'0','to_user_id.id':{'!': blockusers}})
                .where({"to_user_id":{status:{"$ne":"0"}}})
                .populate('to_user_id')
                .populate('to_user_id.company_id',{select:['company_name','slug']})
                .populate('to_user_id.userexperiences',{select: ['title','location','current_work'],sort:{display_status:-1,current_work:-1},limit:1})
                .populate('to_user_id.userexperiences.company_id',{select: ['company_name'],sort:{display_status:-1,current_work:-1},limit:1})
                .paginate({page: page, limit: no_of_record}).sort('createdAt DESC')
                .exec(function(err,result){

                    UserConnection.count().where({user_id: user_id,status:'0',"to_user_id":{status:{"$ne":"0"},id:{'!': blockusers}}}).populate('to_user_id').exec(function(err,counts){
                        resolve({sentrequest:result,totalsentrequest:counts});
                    });
                });
            });
        });
        return promise;
    },

    getUserRelation: function (login_user_id,user_id) {
        console.log(login_user_id);
        console.log(user_id);
        var promise = new Promise(function (resolve, reject) {
            var array = [];
            var filter = {
                "$or" : 
                [
                    {user_id:login_user_id,to_user_id:user_id,status:"1"},
                    {user_id:user_id,to_user_id:login_user_id,status:"1"}
                ]
            };

            UserConnection.find(filter).exec(function(err,data){
                if(err){
                    resolve(array);
                }
                resolve(data);
            });
        });
        return promise;
    },

    getImportData: function (dataArray,user_id) {
        var array = [];
        var invites = [];
        var promise = new Promise(function (resolve, reject) {
            dataArray.forEach(function(factor,index){

                if(typeof factor.email!='undefined'){

                    var email = factor.email;
                    var name = (typeof factor.name !='undefined' ? factor.name : "");

                    Users.find({ "$or" : [{loginid : email}, { email : email }] }).exec(function(err,_users){
                        
                        if(_users.length < 0){
                            array.push(_users[0]);
                        }else{
                            invites.push({email:email,name:name});
                        }
                        
                        if(dataArray.length == (array.length + invites.length) ){
                            resolve({members:array,invites:invites});
                        }
                    });
                }
            });
        });
        return promise;
    }
}