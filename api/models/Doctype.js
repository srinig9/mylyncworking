/**
 * DocType.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
		title: {
			type: 'string'
		},
		type: {
			type: 'string'
		},
		country: {
			model: 'countries'
		},
		verify_doc_type:{
			collection:'UserVerifyData',
			via:'doc_type_id'
		},
    }
};