/**
 * UserVerifyDataRequest.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
		owner_id: {
			model: 'users',
        },
        user_id:{
            model:'users',
        },
		verify_id: {
			model: 'userverifydata'
		},
        to_verify_data: {
			type: 'integer',
			defaultsTo:0
        },
        to_verify_doc: {
			type: 'integer',
			defaultsTo:0
        },
        hash: { 
            type: 'string',
            defaultsTo:''
        },
        txnno: {
            type: 'string',
            defaultsTo:''
        },
        doc_hash: { 
            type: 'string',
            defaultsTo:''
        },
        doc_txnno: {
            type: 'string',
            defaultsTo:''
        },
        verifydate: {
            type: 'string',
            defaultsTo:''
        },
        verifiercomments: {
            type: 'string',
            defaultsTo:''
        },
        status: {
            type: 'integer',
            defaultsTo:0
        },
    }
};