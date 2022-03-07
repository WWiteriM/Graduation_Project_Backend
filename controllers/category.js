const Category = require('../models/category');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        await res.json(await new Category({ name, slug: slugify(name) }).save());

    } catch (err) {
        res.status(400).send('Create category failed');
    }
};

exports.list = async (req, res) => {

};

exports.read = async (req, res) => {

};

exports.update = async (req, res) => {

};

exports.remove = async (req, res) => {

};
