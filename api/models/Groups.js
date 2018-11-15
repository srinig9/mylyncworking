/**
 * Groups.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		group_name: {
			type: 'string',
			required:true
		},
		slug: {
			type: 'string',
			required:true,
			unique: true
		},
		group_description: {
			type: 'text'
		},
		privacy: {
			type: 'string'
		},
		group_icon:{
			type: 'string'
		},
		groupusers:{
	      collection: 'GroupUsers',
	      via: 'group_id'
	  	},
		groupfeeds:{
	      collection: 'Feeds',
	      via: 'group_id'
		}
	}
};

