/**
 * Ids.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
  
	   username: { 
			type: 'string'
		},
	  ethaddress: { 
			type: 'string',
	  },
		type: { 
			type: 'string',
	  },
		value: { 
			type: 'string',
	  },
		status: { 
			type: 'string',
	  },
		txnno: { 
			type: 'string',
	  },
		hash: { 
			type: 'string',
		},
		formattedDate: {
			type: 'string'
		},		
		verifier: { 
			type: 'string',
	  },
		 verifiername: { 
			type: 'string',
		},    
		verifiercomments: { 
			type: 'string',
		},    
		verifydate: { 
			type: 'string',
	  },    
	}
};
  
  