/**
 * PrivacyOptions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
  
	privacy_id: {
		model: 'privacy',
		required: true,
	},
	option_val:{
		type:'string',
		required:true
	},
	status: {
		type: 'integer',
		required: true
	},

  }
};