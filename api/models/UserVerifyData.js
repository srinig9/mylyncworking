/**
 * UserVerifyData.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
		user_id: {
			model: 'users'
		},
		doc_type_id: {
			model: 'doctype'
		},
		doc_id: {
			type: 'string'
		},
		doc_num: {
			type: 'string'
		},
		legal_name: {
			type: 'string'
		},
		comment: {
			type: 'string'
		},
		issue_country: {
			type: 'string'
		},
		issue_date: {
			type: 'string'
		},
		expiry_date: {
			type: 'string'
		},
		address_line_1: {
			type: 'string'
		},
		address_line_2: {
			type: 'string'
		},
		city: {
			type: 'string'
		},
		zip: {
			type: 'string'
		},
		state: {
			type: 'string'
		},
		country: {
			type: 'string'
		},
		dob: {
			type: 'string'
		},
		birth_place: {
			type: 'string'
		},
		doc_hash: {
			type: 'string'
		},
		color_scan: {
			type: 'integer',
			defaultsTo:0
		},
		govt_issue_id: {
			type: 'integer',
			defaultsTo:0
		},
		doc_has_dob: {
			type: 'integer',
			defaultsTo:0
		},
		has_expirey_date: {
			type: 'integer',
			defaultsTo:0
		},
		doc_url:{
			type: 'string',
		},
		tab_type:{
			type: 'string',
		},
		edu_id:{
			model: 'usereducations',
		},
		study_field:{
			type: 'string',
		},
		exp_id:{
			model: 'userexperiences',
		},
		project_id:{
			model: 'userprojects',
		},
		designation:{
			type: 'string',
		},
		gender:{
			type: 'integer'
		},
		identity_flag:{
			type: 'integer',
			defaultsTo:0
		},
		dob_flag:{
			type: 'integer',
			defaultsTo:0
		},
		address_flag:{
			type: 'integer',
			defaultsTo:0
		},
		other_doc_info:{
			type: 'string',
		},
		doc_country:{
			model: 'countries'
		},
		first_name: {
			type: 'string'
		},
		last_name: {
			type: 'string'
		},
		issue_place: {
			type: 'string'
		},
		verify_request_id: {
			collection: 'UserVerifyDataRequest',
			via: 'verify_id'
		}
    }
};