const User = require('../models/user.model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Chat = require('../models/chat.model');

exports.newMessage = async (req, res, next) => {

    try {

        var loggedInUser = req.user.id;
        var toUserId = req.body.toId;
        var msg = req.body.msg;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            const toUser = await User.findByPk(toUserId);

            if (!toUser) {

                return res.status(400).json({
                    status: "400",
                    message: 'toUser id is invalid id.!!'
                });

            } else {

                let createMessage = {
                    toId: toUser.id,
                    fromId: isLoggedInUser.id,
                    toUser: {
                        id: toUser.id,
                        firstName: toUser.firstName,
                        lastname: toUser.lastName
                    },
                    fromUser: {
                        id: isLoggedInUser.id,
                        firstName: isLoggedInUser.firstName,
                        lastname: isLoggedInUser.lastName
                    },
                    msg: msg,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };


                // socket.getIO().on('new_message', (data) => {
                //     console.log(data);
                // });

                isLoggedInUser.createChat({ ...createMessage }).then((message) => {

                    return res.status(200).json({
                        status: "200",
                        message: 'Message sent.!!',
                        results: message
                    });

                }).catch((error) => {

                    return res.status(400).json({
                        status: "400",
                        message: 'Error in sending.!!',
                        error: error
                    });

                });

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'Please verify your account first'
            });

        }

    } catch (error) {

        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    };

}

exports.getMessages = async (req, res, next) => {

    try {


        var loggedInUser = req.user.id;
        var toUserId = req.query.toId;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            const toUser = await User.findByPk(toUserId);
            if (!toUser) {

                return res.status(400).json({
                    status: "400",
                    message: 'toUser id is invalid id.!!'
                });

            } else {

                Chat.findAll({
                    where: {
                        [Op.or]: [
                            {
                                toId: toUser.id,
                                fromId: isLoggedInUser.id
                            },
                            {
                                toId: isLoggedInUser.id,
                                fromId: toUser.id
                            },
                        ]
                    }
                }).then((message) => {

                    return res.status(200).json({
                        status: "200",
                        message: 'Message sent.!!',
                        results: message
                    });

                }).catch((error) => {

                    return res.status(400).json({
                        status: "400",
                        message: 'Error in sending.!!',
                        error: error
                    });

                });

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'Please verify your account first'
            });

        }

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    };

}
