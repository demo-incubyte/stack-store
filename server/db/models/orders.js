'use strict';
var crypto = require('crypto');
var _ = require('lodash');
var Sequelize = require('sequelize');

// Order model is for both carts and orders

var Order = function(db) {
    return db.define('orders', {
        status: {
            type: Sequelize.ENUM('Shipped', 'Delivered', 'Cancelled', 'Returned', 'Pending'),
            defaultValue: 'Pending'
        },
        confirmation: {
            // confirmation number
            type: Sequelize.INTEGER
        },
        total: {
            type: Sequelize.DECIMAL(10, 2)
                // ,
                // get: function(){
                //     return this.getDataValue('total');
                // },
                // set: function(price){
                //     return this.setDataValue('total', this.getDataValue('total') + price);
                // }
        }
    }, {
        instanceMethods: {
            getTotal: function() {
                return this.getDreams()
                    .then(function(dreams) {
                        return dreams.reduce(function(a, b) {
                            return a + b.price;
                        }, 0);
                    });
            }
        }
    });
};

module.exports = Order;
