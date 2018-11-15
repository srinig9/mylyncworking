/**
 * Applyjob.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		resume: {
			type: 'string',
		},
		feed_id:{
			model:"Feeds"
		},
		company_id:{
			model:"Companies"
		},
		user_id:{
			model:"Users"
		}
	}
};