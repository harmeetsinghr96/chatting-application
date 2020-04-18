/* Importing packages and models */
const User = require('../models/user.model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


/* Get all users api */
exports.getAllUsers = async (req, res, next) => {

    try {

        var pageQuery = +req.query.page - 1;
        var pageSizeQuery = +req.query.pageSize;
        var search = req.body.search;
        var loggedInUser = req.user.id;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            const listOfUsers = await User.findAll({
                where: search != '*' || '' ? { firstName: { [Op.like]: `%${search}%` } } : {},
                attributes: ['id', 'firstName', 'lastName', 'email', 'verified', 'active', 'userRole', 'createdAt', 'updatedAt'],
                offset: pageQuery * pageSizeQuery,
                limit: pageSizeQuery
            });
            // 
            if (!listOfUsers) {

                return res.status(400).json({
                    status: "400",
                    message: 'No records found.!!'
                });

            } else {

                return res.status(200).json({
                    status: "200",
                    message: 'Fetched list of users.!!',
                    results: listOfUsers
                });

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'Pleaase verify your account first.!!'
            });

        }

    } catch (error) {

        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    }

}

/* Send friend request api */
exports.friendReqesutSent = async (req, res, next) => {

    try {

        var loggedInUser = req.user.id;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            isLoggedInUser.getFriend().then((friend) => {
                console.log(friend);
            })

        } else {

            return res.status(400).json({
                status: "400",
                message: 'Pleaase verify your account first.!!'
            });

        }

    } catch (error) {

        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    }

}