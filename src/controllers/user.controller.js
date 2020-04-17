const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const mail = require('../shared/nodemail.shared');
const crypto = require("crypto");

/* Register api */
exports.Register = async (req, res, next) => {
    try {
        const isExistingUser = await User.findOne({ where: { email: req.body.email } });


        if (isExistingUser) {

            return res.status(400).json({
                status: "400",
                message: 'Email is taken already..!!'
            });

        } else {

            crypto.randomBytes(20, (error, buffer) => {
                if (error) {

                    return res.status(500).json({
                        status: "500",
                        message: 'Crypto error..',
                        error: error
                    });

                } else {

                    let cryptedToken = buffer.toString('hex');

                    bcrypt.hash(req.body.password, 12).then((hashed) => {
                      
                        let newUser = {
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hashed,
                            deviceType: req.body.deviceType,
                            createdAt: Date.now(),
                            accountVerificationToken: cryptedToken
                        };

                        User.create({...newUser}).then((user) => {

                            let mailing = {
                                from: 'Admin',
                                to: user.email,
                                subject: 'Account Verification',
                                html: `<section>
                                            <h1> Welcome ${user.firstName} </h1>
                                            <p>
                                                <a href="http://localhost:3000?token=${cryptedToken}">Click me..1!</a>
                                            </p>
                                       </section>`
                            };

                            mail.nodeMail(mailing);

                            return res.status(200).json({
                                status: "200",
                                message: 'Registered Successfully..!!',
                            });
                            

                        }).catch((error) => {
                            
                            return res.status(400).json({
                                status: "400",
                                message: 'User creating failed',
                                error: error
                            });

                        });

                    }).catch((error) => {

                        return res.status(500).json({
                            status: "500",
                            message: 'Hasing error..',
                            error: error
                        });

                    });

                }

            });

        }
    } catch (error) {

        res.status(500).json({
            status: "500",
            message: 'Error!!',
            error: error
        });

    }
}

