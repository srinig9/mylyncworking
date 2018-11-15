/**
 * Feeds.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {  
	attributes: {
		status : {
			type: 'integer'
		},
		group_id: {
			model:'groups'
		},
		to_user_id: {
			model: 'users'
		},
		user_id: {
			type: 'string',
		},
		type: {
			type: 'string',
		},
		feed_details: {
			type: 'text'
		},
		privacy: {
			type: 'integer'
		},
		is_deleted: {
			type: 'integer'
		},
		// This defines the other half of our association with Feed Media.  This is the 'many' side.	
		polloptions: {
			collection: 'polloption',
			via: 'feed_id'
		},		
		pollanswers: {
			collection: 'pollanswer',
			via: 'feed_id'
		},
		// This defines the other half of our association with Feed Media.  This is the 'many' side.	
		feedmedias: {
			collection: 'feedmedia',
			via: 'feed_id'
		},
		// This defines the other half of our association with Feed Comments. This is the 'many' side.	
		feedcomments: {
			collection: 'feedcomment',
			via: 'feed_id'
		},
		// This defines the other half of our association with Feed Comments. This is the 'many' side.	
		feedlikes: {
			collection: 'feedlike',
			via: 'feed_id'
		},
		// This defines the other half of our association with Feed Comments. This is the 'many' side.	
		applyjob: {
			collection: 'Applyjob',
			via: 'feed_id'
		},
		user_id: {
			model: 'users'
		},
		category_id: {
			model: 'blogCategory'
		},
			/* job parameter*/
		company_id:{
			model: 'Companies'
		},
		location:{
				type: 'string',
			},
		job_type_id:{
				model: 'Job_type',
			},
		experience_id:{
				model: 'Job_experience',
			},
		salary:{
			type: 'string',
		},
		contact_job_poster:{
			type: 'string',
		},
		is_feature_job:{
			type: 'integer',
			defaultsTo:0
		},
		jobBookmarks: {
			collection: 'Job_bookmark',
			via: 'job_id'
		},
		jobSkills: {
			collection: 'Job_skills',
			via: 'job_id'
		},
		industrie_id : {
			model: 'industries',
		},
		notificationFeed: {
			collection: 'Notifications',
			via: 'feed_id'
		},
		SpamsFeed: {
			collection: 'FeedSpams',
			via: 'feed_id'
		},

	}, 
};