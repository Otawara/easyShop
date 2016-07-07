'use strict';

const Shop = require('../../../models/shop');

exports.validateShop = (req, res, next) => {
    req.checkBody('nom', 'The name is required').notEmpty();
    req.checkBody('edition', 'The edition number is required').notEmpty().isLength({
        min: 1,
        max: 16
    });
    req.checkBody('date_debut', 'Start date is required').notEmpty().isDate();
    req.checkBody('date_fin', 'End date is required').notEmpty().isDate();
    req.checkBody('email', 'Email is required').notEmpty().isEmail();

    let errors = req.validationErrors();

    if(errors) {
        return res.send(500, {
            ok: false,
            message: errors[0].msg,
            errors: errors
        });
    } else {
        next();
    }
};

exports.getShopById = (req, res, next) => {
    let shopId = req.params.shopId;

    Shop.find({"_id" : shopId, "deleted" : false})
        .exec((err, shop) => {
        if(err || !shop) {
            return res.send({
                ok: false,
                message: 'Shop not found'
            });
        }
        return res.send({
            ok: true,
            data: shop
        });
    });
};

exports.getShops = (req, res, next) => {
    Shop.find({})
        .exec((err, shops) => {
        if(err || !shops) {
            return res.send({
                ok: false,
                message: 'Shops not found'
            });
        }
        return res.send({
            ok: true,
            data: shops
        });
    });
};

exports.newShop = (req, res, next) => {
    let shop = new Shop({
        nom: req.body.nom,
        owner: req.user._id,
        location: req.body.location,
        description: req.body.description,
        open: req.body.open,
        close: req.body.close,
        site: req.body.site,
        email: req.body.email,
        phone: req.body.phone,
        created: new Date()
    });

    shop.save((err) => {
        if(err) {
            return res.send({
                ok: false,
                message: 'Something went wrong!',
                error: err
            });
        } else {
            return res.send({
                ok: true,
                message: 'Your conference has been successfully created'
            });
        }
    });
};

exports.updateShop = (req, res, next) => {
    let shopId = req.params.shopId;

    Shop.findById(shopId)
        .exec((err, shop) => {
        if(err || !shop) {
            return res.send({
                ok: false,
                message: 'Publication not found'
            });
        }
        shop.nom = req.body.nom || shop.nom;
        shop.location = req.body.location || shop.location;
        shop.description = req.body.description || shop.description;
        shop.open = req.body.open || shop.open;
        shop.close = req.body.close || shop.close;
        shop.description = req.body.description || shop.description;
        shop.site = req.body.site || shop.site;
        shop.email = req.body.email || shop.email;
        shop.phone = req.body.phone || shop.phone;
        shop.gallery = req.body.gallery || shop.gallery;
        shop.reviews = req.body.reviews || shop.reviews;
        shop.category = req.body.category || shop.category;
        shop.updated = new Date();

        shop.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error while updating'
                });
            }
            return res.send({
                ok: true,
                data: shop
            });
        });
    });
};

exports.deleteShop = (req, res, next) => {
    let shopId = req.params.shopId;

    Shop.findById(shopId)
        .exec((err, shop) => {
        if(err || !shop) {
            return res.send({
                ok: false,
                message: 'Shop not found'
            });
        }
        shop.deleted = true;
        shop.updated = new Date();
        shop.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error while deleting'
                });
            }
            return res.send({
                ok: true,
                data: shop
            });
        });
    });
};
