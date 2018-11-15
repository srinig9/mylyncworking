/**
 * FeedComment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		parent_id: {
			model: 'feedcomment',
		},
		comments: {
			type: 'text',
			required: true,
		},
		feed_id: {
			model: 'feeds'
		},
		user_id: {
			model: 'users'
		},
		commentlikes: {
	      collection: 'feedlike',
	      via: 'comment_id'
	    },
		commentreply: {
	      collection: 'feedcomment',
	      via: 'parent_id'
	    },
	}
};