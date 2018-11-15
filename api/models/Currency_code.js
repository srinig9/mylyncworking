/**
 * Currency_code.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    attributes: {
        symbol: {
            type: 'string',
            required: true,
        },
        name: {
            type: 'string',
            required: true,
        },
        symbol_native: {
            type: 'string',
            required: true,
        },
        decimal_digits: {
            type: 'string',
            required: true,
        },
        rounding: {
            type: 'string',
            required: true,
        },
        code: {
            type: 'string',
            required: true,
        },
        name_plural: {
            type: 'string',
            required: true,
        },
    }
};