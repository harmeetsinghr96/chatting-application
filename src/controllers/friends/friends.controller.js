/* Importing packages and models */
const User = require('../../models/user/user.model');
const FriendRequest = require('../../models/friends/friends.model');
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
                };

                isLoggedInUser.createFriendRequest({ ...sendRequest }).then((friendRequest) => {

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
                let actionFriendRequest;

                if (accept) {

                    actionFriendRequest = {
                        pending: false,
                        accept: true,
                        reject: false
                    }

                } else if (reject) {

                    actionFriendRequest = {
                        pending: false,
                        accept: false,
                        reject: true
                    }

                }

                friendRequest.update( {...actionFriendRequest} ).then((acceptReject) => {

                    if (accept) {
                        
                        return res.status(200).json({
                            status: "200",
                            message: 'Accepted',
                            results: acceptReject 

                        });

                    } else {

                        return res.status(200).json({
                            status: "200",
                            message: 'Rejected',
                            results: acceptReject 
                        });

                    };

                }).catch((error) => {
                    console.log(error);
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

        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    }

}

exports.getAcceptedList = async (req, res, next) => {
    
    try {

        var loggedInUser = req.user.id;

        const isLoggedInUser = await User.findByPk(loggedInUser);

        if (isLoggedInUser.verified === true) {

            const listOfAcceptedFriends = await isLoggedInUser.getFriendRequests({
                where: { accept: { [Op.like]: true } },
                attributes: [ 'id', 'toId', 'fromId', 'toUser', 'fromUser', 'accept', 'createdAt' ]
            });

            if (listOfAcceptedFriends) {

                return res.status(400).json({
                    status: "200",
                    message: 'Fetched',
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

        return res.status(500).json({
            status: "500",
            message: 'Error.!!',
            error: error
        });

    }

}