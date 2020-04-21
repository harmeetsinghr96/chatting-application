// const User = require('../models/user/user.model');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
// const Chat = require('../models/chats/chat.model');
// const Friend = require('../models/friends/friends.model');


// exports.sendMessage = async (req, res, next) => {

//     try {

//         var loggedInUser = req.user.id;
//         var toUserId = req.body.toId;
//         var msg = req.body.msg;

//         const isLoggedInUser = await User.findByPk(loggedInUser);

//         if (isLoggedInUser.verified === true) {

//             const toUser = await User.findByPk(toUserId);

//             if (!toUser) {
                
//                 return res.status(400).json({
//                     status: "400",
//                     message: 'toUser id is invalid id.!!'
//                 });

//             } else {

//                 const isExistingUserFriend = await Friend.findOne({
//                     where: { 
//                         toId: { [Op.like]: toUser.id },
//                         fromId: { [Op.like]: isLoggedInUser.id },
//                      }
//                 });

//                 let createMessage = {
//                     toId: toUser.id,
//                     fromId: isLoggedInUser.id,
//                     toUser: {
//                         id: toUser.id,
//                         firstName: toUser.firstName,
//                         lastname: toUser.lastName
//                     },
//                     fromUser: {
//                         id: isLoggedInUser.id,
//                         firstName: isLoggedInUser.firstName,
//                         lastname: isLoggedInUser.lastName
//                     },
//                     msg: msg,
//                     createdAt: Date.now(),
//                     ischatList: isExistingUserFriend.id
//                 };

//                 isExistingUserFriend.createChatListItem( {...createMessage} ).then((result) => {

//                     return res.status(200).json({
//                         status: "200",
//                         message: 'Message sent.!!',
//                         results: result
//                     });

//                 }).catch((error) => {

//                     return res.status(400).json({
//                         status: "400",
//                         message: 'Failed.!!',
//                         error: error
//                     });

//                 })
//             }

//         } else {

//             return res.status(400).json({
//                 status: "400",
//                 message: 'Please verify your account first'
//             });

//         }

//     } catch(error) {
       
//         console.log(error);
//         return res.status(500).json({
//             status: "500",
//             message: 'Error.!!',
//             error: error
//         });
        
//     };

// }

// exports.newMessage = async (req, res, next) => {

//     try {

//         var loggedInUser = req.user.id;
//         var toUserId = req.body.toId;
//         var msg = req.body.msg;

//         const isLoggedInUser = await User.findByPk(loggedInUser);

//         if (isLoggedInUser.verified === true) {

//             const toUser = await User.findByPk(toUserId);

//             if (!toUser) {
                
//                 return res.status(400).json({
//                     status: "400",
//                     message: 'toUser id is invalid id.!!'
//                 });

//             } else {

//                 let createMessage = {
//                     toId: toUser.id,
//                     fromId: isLoggedInUser.id,
//                     toUser: {
//                         id: toUser.id,
//                         firstName: toUser.firstName,
//                         lastname: toUser.lastName
//                     },
//                     fromUser: {
//                         id: isLoggedInUser.id,
//                         firstName: isLoggedInUser.firstName,
//                         lastname: isLoggedInUser.lastName
//                     },
//                     msg: msg,
//                     createdAt: Date.now(),
//                 };
                
//                 isLoggedInUser.getChats().then((chatRoom) => {
//                     if (chatRoom.length <= 0) {
//                         console.log('here');
//                         let createRoom = {
//                             toId: toUser.id,
//                             fromId: isLoggedInUser.id,
//                             toUser: {
//                                 id: toUser.id,
//                                 firstName: toUser.firstName,
//                                 lastname: toUser.lastName
//                             },
//                             fromUser: {
//                                 id: isLoggedInUser.id,
//                                 firstName: isLoggedInUser.firstName,
//                                 lastname: isLoggedInUser.lastName
//                             },
//                             createdAt: Date.now(),
//                         };

                        

//                         isLoggedInUser.createChat({...createRoom}).then((chatRoom) => {
                            
//                         })
//                     } else {

//                         Chat.findByPk(1).then(chat => {
//                             chat.createMessage({...createMessage}).then((res) => console.log(res));
//                         })
//                     }
//                 });

//             }

//         } else {

//             return res.status(400).json({
//                 status: "400",
//                 message: 'Please verify your account first'
//             });

//         }

//     } catch(error) {
       
//         console.log(error);
//         return res.status(500).json({
//             status: "500",
//             message: 'Error.!!',
//             error: error
//         });
        
//     };

// }