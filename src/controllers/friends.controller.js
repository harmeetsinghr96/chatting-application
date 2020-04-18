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

        const listOfUsers = await User.findAll({
            where: search != '*' || '' ? { firstName: { [Op.like]: `%${search}%`  } } : {},
            attributes: ['id', 'firstName', 'lastName', 'email', 'verified', 'active' , 'userRole', 'createdAt', 'updatedAt' ],
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

    } catch (error) {

        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    }

}