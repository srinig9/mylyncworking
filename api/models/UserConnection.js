/**
 * UserConnection.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		user_id:{
			model: 'users',
		},
		to_user_id:{
			model: 'users',
		},
		status:{
			type: 'string',
			required: true,
		}
	},

	getRequestUsers: function(user_id,cb){
		//console.log(user_id);
		UserConnection.find().exec(function(err, found){      
			if(err)  return cb(null, false, {message: 'Username not found'});
			//console.log(found);
			return cb(null, found, {message: 'Username not found'});
			let userDetails = {
				to_user_id: found.to_user_id
			};
			//console.log(userDetails);
		});
	}

};

