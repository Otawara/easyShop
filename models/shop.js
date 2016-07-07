'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
    nom: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        address: String,
        country: String,
        city: String,
        geo: []
    },
    paid: {
        type: Boolean,
        default: false
    },
    description: String,
    open: Number,
    close: Number,
    site: String,
    email : String,
    phone: String,
    image: String,
    gallery: [],
    reviews: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        content: String,
        like: Number,
        created: {
            type: Date,
            default: Date.now
        }
    }],
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }],
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

module.exports = mongoose.model('Shop', ShopSchema);
