/* Importing packages and models */
const User = require('../models/user/user.model');
const FriendRequest = require('../models/friends/friendShip.model');
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
        var toUserId = req.body.toUserId;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            const isToUser = await User.findByPk(toUserId);

            console.log(isToUser);

            if (!isToUser) {

                return res.status(400).json({
                    status: "400",
                    message: 'User id is wrong'
                });

            } else {

                let sendRequest = {
                    toId: isToUser.id,
                    fromId: isLoggedInUser.id,
                    toUser: {
                        id: isToUser.id,
                        firstName: isToUser.firstName,
                        lastName: isToUser.lastName,
                    },
                    fromUser: {
                        id: isLoggedInUser.id,
                        firstName: isLoggedInUser.firstName,
                        lastName: isLoggedInUser.lastName
                    },
                    pending: true,
                    createdAt: Date.now(),
                    updatedAt: Date.now()
                };

                isLoggedInUser.addFriend(isToUser, { through: { ...sendRequest } }).then((friendRequest) => {

                    return res.status(200).json({
                        status: "200",
                        message: 'Friend request sent.!!',
                        results: friendRequest
                    });

                }).catch((error) => {

                    return res.status(400).json({
                        status: "400",
                        message: 'Friend request sending failed.!!',
                        error: error
                    });

                });

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'Pleaase verify your account first.!!'
            });

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    }

}

/* Accept or reject requests */
exports.acceptOrReject = async (req, res, next) => {
    try {

        var loggedInUser = req.user.id;
        var friendRequestId = req.body.friendRequestId;
        var accept = req.body.accept;
        var reject = req.body.reject;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            const isFriendRequest = await FriendRequest.findByPk(friendRequestId);

            if (!isFriendRequest) {

                return res.status(400).json({
                    status: "400",
                    message: 'Incorrect Friend request id.!!',
                });

            } else {

                let friendRequest = isFriendRequest;
                const isFromUser = await User.findByPk(friendRequest.fromId);
                const isToUser = await User.findByPk(friendRequest.toId);

                let takeActionOnFriendRequest;
                let acceptOrReject;

                if (isLoggedInUser.id === isToUser.id) {
                    if (accept) {

                        acceptOrReject = {
                            pending: false,
                            accept: true,
                            reject: false
                        }

                        takeActionOnFriendRequest = {
                            toId: isFromUser.id,
                            fromId: isLoggedInUser.id,
                            toUser: {
                                id: isFromUser.id,
                                firstName: isFromUser.firstName,
                                lastName: isFromUser.lastName,
                            },
                            fromUser: {
                                id: isLoggedInUser.id,
                                firstName: isLoggedInUser.firstName,
                                lastName: isLoggedInUser.lastName
                            },
                            pending: false,
                            accept: true,
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        }

                    } else if (reject) {

                        acceptOrReject = {
                            pending: false,
                            accept: false,
                            reject: true
                        }

                        takeActionOnFriendRequest = {
                            toId: isFromUser.id,
                            fromId: isLoggedInUser.id,
                            toUser: {
                                id: isFromUser.id,
                                firstName: isFromUser.firstName,
                                lastName: isFromUser.lastName,
                            },
                            fromUser: {
                                id: isLoggedInUser.id,
                                firstName: isLoggedInUser.firstName,
                                lastName: isLoggedInUser.lastName
                            },
                            pending: false,
                            accept: false,
                            reject: true,
                            createdAt: Date.now(),
                            updatedAt: Date.now()
                        }

                    }

                }

                friendRequest.update({ ...acceptOrReject }).then((acceptReject) => {

                    isLoggedInUser.addFriend(isFromUser, { through: { ...takeActionOnFriendRequest } })
                        .then((resp) => {

                            if (accept) {

                                return res.status(200).json({
                                    status: "200",
                                    message: 'Accepted',

                                });

                            } else {

                                return res.status(200).json({
                                    status: "200",
                                    message: 'Rejected',
                                });

                            };

                        }).catch((error) => {
                            
                            return res.status(400).json({
                                status: "400",
                                message: 'Error in accept or reject.!!',
                                error: error
                            });

                        })


                }).catch((error) => {

                    return res.status(400).json({
                        status: "400",
                        message: 'Error in accept or reject.!!',
                        error: error
                    });

                });

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'Please verify your account first',
            });

        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    }

}

/* List of friend requests */
exports.getFriendRequests = async (req, res, next) => {

    try {

        var loggedInUser = req.user.id;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            const getFriendRequestsList = await FriendRequest.findAll({
                where: { 
                    toId: { [Op.like]: isLoggedInUser.id }, 
                    pending: { [Op.like]: true } 
                },
                attributes: [ 'id', 'toId', 'fromId', 'toUser', 'fromUser', 'pending', 'createdAt' ]
            });

            if (getFriendRequestsList.length < 0) {

                return res.status(400).json({
                    status: "400",
                    message: 'No records found',
                });

            } else {
                
                return res.status(200).json({
                    status: "200",
                    message: 'Fetched Friend Request List.!!',
                    results: getFriendRequestsList
                });

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'Please verify your account first',
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

/* List of accepted users belongs to user */
exports.getAcceptedList = async (req, res, next) => {
    
    try {

        var loggedInUser = req.user.id;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            const listOfAcceptedFriends = await isLoggedInUser.getFriends({
                include: [{ 
                        model: User, as: 'Friends', 
                        attributes: [ 'id', 'firstName', 'lastName' ], 
                }],
                attributes: [ 'id', 'firstName', 'lastName'  ],
            });

            if (listOfAcceptedFriends) {

                return res.status(400).json({
                    status: "200",
                    message: 'Fetched accepted list',
                    results: listOfAcceptedFriends
                });
                

            } else {

                return res.status(400).json({
                    status: "200",
                    message: 'No records Found',
                });

            }
            
        } else {

            return res.status(400).json({
                status: "400",
                message: 'Please verify your account first',
            });
            
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    }

}
