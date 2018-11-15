/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		user_id:{
			model:'users'
		},
		message_id:{
			model:'messages'
		},
		message:{
			type: 'text',
			required: true,
		},
		read : {
			type: 'integer'
		},
		chat_timestamp : {
			type: 'string'
		},
		user_block : {
			type: 'string'
		}
	}
};

