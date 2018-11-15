/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const bcrypt = require('bcrypt-nodejs');

module.exports = {

	attributes: {
		name:{
			type: 'string',
			required: true,
		},
		parentUsers:{
			collection: 'users',
			via: 'parent_id'
		},
		parent_id:{
			model: 'users',
		},
		email: {
			type: 'email',
			unique: true
		},
		loginid :{
			type: 'string',
			minLength:4,
			alphanumeric:true,
			required: true,
			unique: true
		},
		mobile: {
			type: 'string',
		},
		password: {
			type: 'string',
			// minLength:8,
			checkPassword: true, // << defined below			
			required: true
		},
		slug: {
			type: 'string',
		},
		email_verification_code: {
			type: 'string',
		},
		email_verified: {
			type: 'string',
		},
		mobile_verification_code: {
			type: 'string',
		},
		mobile_verified: {
			type: 'string',
		},
		last_login_at: {
			type: 'date',
		},
		is_guest:{
			type: 'string'
		},
		status:{
			type: 'string',
			defaultsTo:"1"
		},
		company_id:{
			model: 'companies',
		},
		role_id:{
			type: 'string',
		},
		device_id :{
			type: 'string',
		},
		address:{
			type: 'text',
		},
		socket_id : {
			type: 'string',
		},
		receivemessage:{
			collection: 'messages',
			via: 'to_user_id'
		},
		sendmessage:{
			collection: 'messages',
			via: 'user_id'
		},
		chatuser:{
			collection: 'Chat',
			via: 'user_id'
		},

		groupmembers: {
			collection: 'GroupUsers',
			via: 'user_id'
		},
		ethaddress:{
			type: 'string',
		},
		is_verify_phone: {
			type: 'integer',
			defaultsTo:0
        },
        is_verify_email: {
			type: 'integer',
			defaultsTo:0
        },
		// This defines the other half of our association with ideas.  This is the 'many' side.	
		feeduser: {
	      collection: 'Feeds',
	      via: 'user_id'
	    },
		feedtouser: {
	      collection: 'Feeds',
	      via: 'to_user_id'
	    },
		// This defines the other half of our association with ideas.  This is the 'many' side.	
		applyjobuser: {
	      collection: 'Applyjob',
	      via: 'user_id'
	    },
		// This defines the other half of our association with ideas.  This is the 'many' side.	
		feedcommentuser: {
	      collection: 'FeedComment',
	      via: 'user_id'
	    },
		pollanswerusers: {
	      collection: 'pollanswer',
	      via: 'user_id'
	    },
		commentreplyuser: {
	      collection: 'FeedComment',
	      via: 'user_id'
	    },
		// This defines the other half of our association with ideas.  This is the 'many' side.	
		feedlikes: {
	      collection: 'Feedlike',
	      via: 'feed_id'
	    },
		usereducations: {
	      collection: 'UserEducations',
	      via: 'user_id'
	    },
	    userprojects: {
	      collection: 'UserProjects',
	      via: 'user_id'
	    },
	    userexperiences: {
	      collection: 'UserExperiences',
	      via: 'user_id'
	  	},
		usersociallinks: {
			collection: 'UserSocials',
			via: 'user_id'
		},
		followusers: {
	      collection: 'follow',
	      via: 'user_id'
	    },

		usergiverecommendation: {
			collection: 'UserRecommendations',
			via: 'recommended_id'
		},

		userreceiverecommendation: {
			collection: 'UserRecommendations',
			via: 'user_id'
		},
		userprivacysettings: {
			collection: 'UserPrivacySettings',
			via: 'user_id'
		},

		receiverequest:{
			collection: 'UserConnection',
			via: 'user_id'
		},
		sendrequest:{
			collection: 'UserConnection',
			via: 'to_user_id'
		},

		user_contact_verify:{
			collection: 'UserContactVerifyData',
			via: 'user_id'
		},

		BlockBy:{
			collection: 'BlockUser',
			via: 'user_id'
		},

		BlockTo:{
			collection: 'BlockUser',
			via: 'to_user_id'
		},

		VerifyRequestReceiver:{
			collection:'UserVerifyDataRequest',
			via:'user_id'
		},

		VerifyRequestSender:{
			collection:'UserVerifyDataRequest',
			via:'owner_id'
		},

		UserVerifyData:{
			collection:'UserVerifyData',
			via:'user_id'
		},

		InviteUser:{
			collection:'InviteContact',
			via:'user_id'
		},
		
		RewardUser:{
			collection:'EarnRewards',
			via:'user_id'
		},
		companyMember:{
	    	collection: 'CompanyTeamMembers',
			via: 'user_id'
	    },
		Notifications:{
			collection:'Notifications',
			via:'user_id'
		},
		NotificationFrom:{
			collection:'Notifications',
			via:'from_user_id'
		},

		DataRequestReceiver:{
			collection:'UserDataAccessRequest',
			via:'user_id'
		},

		DataRequestSender:{
			collection:'UserDataAccessRequest',
			via:'owner_id'
		},
		UserSocketid:{
			collection:'UserSocketid',
			via:'user_id'
		},
		FeedSpamUser:{
			collection:'FeedSpams',
			via:'user_id'
		},
		userOrganizations:{
			collection:'companies',
			via:'user_id'
		},
		UserCloseAccount:{
			collection:'Usercloseaccount',
			via:'user_id'
		}
	},

	//model validation messages definitions
	validationMessages: { //hand for i18n & l10n
		name:{
			required: 'Name is required',
		},
		loginid:{
			required: 'Login id is required',
			minLength: 'Login id has minimum 4 character in length',
			unique: 'Login id is already taken',
			alphanumeric: 'Login id allow only alphanumeric value'
		},		
		password:{
			required: 'Password is required',
			minLength: 'Your password must be at least 8 characters',
			checkPassword: 'Your password must be at least 8 characters, 1 number and 1 character.',
		},
	},
	customToJSON: function() {
		return _.omit(this, ['password'])
	},
	beforeCreate: function(users, cb){
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(users.password, salt, null, function(err, hash){
				if(err) return cb(err);
				users.password = hash;
				return cb();
			});
		});
	},
	beforeUpdate: function(users, cb){
		bcrypt.genSalt(10, function(err, salt){
			if(users.password != undefined){
				bcrypt.hash(users.password, salt, null, function(err, hash){
					if(err) return cb(err);
					users.password = hash;
					return cb();
				});
			} else {
				return cb();
			}
		});
	},

	types: {
		checkPassword: function(value){
			var regex = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,}$/);
			if(!regex.test(value)) {
				return false;
			}
			return true;
		},
	}
};

