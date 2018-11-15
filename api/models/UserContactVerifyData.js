/**
 * UserContactVerifyData.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		user_id:{
			model: 'users'
        },
        email:{
			type: 'string',
        },
        is_email_verify:{
            type: 'integer',
            defaultsTo:0,
        },
		email_otp:{
			type: 'string',
        },
        email_hash:{
            type: 'string',
            defaultsTo:'0',
        },
        phone:{
			type: 'string',
        },
        is_phone_verify:{
            type: 'integer',
            defaultsTo:0,
		},
        phone_otp:{
			type: 'string',
        },
        phone_hash:{
            type: 'string',
            defaultsTo:'0',
		},
        dial_code:{
             type: 'string',
            defaultsTo:'',
        }
	}
};