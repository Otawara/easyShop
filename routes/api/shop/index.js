'use strict';

const route = require('express').Router();
const auth = require('../../core/auth/auth.service');
const controller = require('./controller');

route
    .post('/', auth.hasRole('owner'), controller.newShop)
    .put('/:shopId', auth.isAuthenticated(), controller.updateShop)
    .delete('/:shopId', auth.hasRole('owner'), controller.deleteShop)
    .get('/:shopId', controller.getShopById)
    .get('/', controller.getShops);

module.exports = route;
