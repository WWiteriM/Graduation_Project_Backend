const Product = require('../models/product');
const User = require('../models/user');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.title);
        await res.json(await new Product(req.body).save());

    } catch (err) {
        // res.status(400).send('Create product failed');
       await res.status(400).json({
            err: err.message,
       });
    }
};

exports.listAll = async (req, res) => {
    const products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subs')
        .sort([['createdAt', 'desc']])
        .exec();
    await res.json(products);
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({ slug: req.params.slug }).exec();
        await res.json(deleted);
    } catch (err) {
        res.status(400).send('Delete product failed');
    }
};

exports.read = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate('category')
        .populate('subs')
        .exec();
    await res.json(product);
};

exports.update = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate(
            { slug: req.params.slug },
            req.body,
            { new: true }
        ).exec();
        await res.json(updated);
    } catch (err) {
        await res.status(400).json({
            err: err.message,
        });
    }
};

// Method without pagination
// exports.list = async (req, res) => {
//     try {
//         const { sort, order, limit } = req.body;
//         const products = await Product.find({})
//             .populate('category')
//             .populate('subs')
//             .sort([[sort, order]])
//             .limit(limit)
//             .exec();
//         await res.json(products);
//     } catch (err) {
//         await res.status(400).json({
//             err: err.message,
//         });
//     }
// };

exports.list = async (req, res) => {
    try {
        const { sort, order, page } = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
            .skip((currentPage - 1) * perPage)
            .populate('category')
            .populate('subs')
            .sort([[sort, order]])
            .limit(perPage)
            .exec();
        await res.json(products);
    } catch (err) {
        await res.status(400).json({
            err: err.message,
        });
    }
};

exports.productsCount = async (req, res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    await res.json(total);
};

exports.productStar = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();
    const user = await User.findOne({ email: req.user.email }).exec();
    const { star } = req.body;

    let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
    );

    if (existingRatingObject === undefined) {
        let ratingAdded = await Product.findByIdAndUpdate(
            product._id,
            {
                $push: { ratings: { star, postedBy: user._id }},
            },
            { new: true }
        ).exec();
        console.log('ratingAdded', ratingAdded);
        await res.json(ratingAdded);
    } else {
        const ratingUpdated = await Product.updateOne(
            {
                ratings: { $elemMatch: existingRatingObject },
            },
            { $set: { "ratings.$.star": star }},
            { new: true}
        ).exec();
        console.log('ratingUpdated', ratingUpdated);
        await res.json(ratingUpdated);
    }
};

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        _id: { $ne: product._id },
        category: product.category,
    })
        .limit(3)
        .populate('category')
        .populate('subs')
        .populate('postedBy')
        .exec()

    await res.json(related);
};

const handleQuery = async (req, res, query) => {
    const products = await Product.find({ $text: { $search: query }})
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()

    await res.json(products);
};

const handlePrice = async (req, res, price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec()

        await res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleCategory = async (req, res, category) => {
    try {
        let products = await Product.find({ category })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('postedBy', '_id name')
            .exec()

        await res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleStar = (req, res, stars) => {
    Product.aggregate([
        {
            $project: {
                document: '$$ROOT',
                floorAverage: {
                    $floor: { $avg: '$ratings.star' },
                },
            },
        },
        { $match: { floorAverage: stars }},
    ])
        .limit(12)
        .exec((err, aggregates) => {
            if (err) console.log('AGGREGATE ERROR', err)
            Product.find({ _id: aggregates })
                .populate('category', '_id name')
                .populate('subs', '_id name')
                .populate('postedBy', '_id name')
                .exec((err, products) => {
                    res.json(products);
                });
        });
};

const handleSub = async (req ,res ,sub) => {
    const products = await Product.find({ subs: sub })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()

    await res.json(products);
};

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({ shipping })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()

    await res.json(products);
};

const handleColor = async (req, res, color) => {
    const products = await Product.find({ color })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()

    await res.json(products);
};

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({ brand })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .populate('postedBy', '_id name')
        .exec()

    await res.json(products);
};

exports.searchFilters = async (req, res) => {
    const { query, price, category, stars, sub, shipping, color, brand } = req.body;

    if (query) {
        await handleQuery(req, res, query);
    }

    if (price !== undefined) {
        await handlePrice(req, res, price);
    }

    if (category) {
        await handleCategory(req, res, category);
    }

    if (stars) {
        await handleStar(req, res, stars);
    }

    if (sub) {
        await handleSub(req, res, sub);
    }

    if (shipping) {
        await handleShipping(req, res, shipping);
    }

    if (color) {
        await handleColor(req, res, color);
    }

    if (brand) {
        await handleBrand(req, res, brand);
    }
};
