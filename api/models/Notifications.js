/**
 * Notifications.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
	attributes: {
		user_id:{
			model: 'users',
		},
		from_user_id:{
			model: 'users',
		},
		notification_text:{
			type: 'text',
			required:true
		},
		status:{
			type:"integer"
		},
		feed_id:{
			model: 'feeds'
		}
	}
};

