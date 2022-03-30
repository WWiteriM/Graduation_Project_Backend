const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');
const stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.createPaymentIntent = async (req, res) => {
    const user = await User.findOne({ email: req.user.email }).exec();

    const { cartTotal } = await Cart.findOne({ orderdBy: user._id }).exec();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: cartTotal * 100,
        currency: 'usd',
    });

    await res.send({
        clientSecret: paymentIntent.client_secret,
    })
};
