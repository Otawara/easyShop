'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: String,
    description: String,
    products: [{
        name: String,
        quantity: Number,
        price: String,
        image: String,
        components: [{
            name: String,
            quantity: Number
        }]
    }],
    shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Category', CategorySchema);
