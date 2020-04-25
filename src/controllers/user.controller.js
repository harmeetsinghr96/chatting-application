const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const mail = require('../shared/nodemail.shared');
const crypto = require("crypto");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* Register api */
exports.Register = async (req, res, next) => {

    try {

        var email = req.body.email;
        var password = req.body.password;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var deviceType = req.body.deviceType;

        if (email, password, firstName, lastName, deviceType) {

            const isExistingUser = await User.findOne({ where: { email: email } });

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

                        bcrypt.hash(password, 12).then((hashed) => {

                            let newUser = {
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                password: hashed,
                                deviceType: deviceType,
                                createdAt: Date.now(),
                                accountVerificationToken: cryptedToken
                            };

                            User.create({ ...newUser }).then((user) => {

                                let mailing = {
                                    from: 'Admin',
                                    to: user.email,
                                    subject: 'Account Verification',
                                    html: `<section>
                                            <h1> Welcome ${user.firstName} </h1>
                                            <p>
                                                <a href="http://localhost/chat/src/public/email-verification.php?token=${cryptedToken}">Click me..1!</a>
                                            </p>
                                       </section>`
                                };

                                mail.nodeMail(mailing);

                                return res.status(200).json({
                                    status: "200",
                                    message: 'Registered Successfully, Please check your email to verify your account, Thank you.!!',
                                    user: user
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

        } else {

            return res.status(400).json({
                status: "400",
                message: 'All fields are required..!!',
                error: [
                    'firstName is required',
                    'lastNamse is required',
                    'password is required',
                    'email is required',
                    'deviceType is required'
                ]
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

/* Login api */
exports.Login = async (req, res, next) => {

    try {

        var email = req.body.email;
        var password = req.body.password;
        var deviceType = req.body.deviceType;

        console.log(req.body.email)
        if (email, password, deviceType) {

            const registeredUser = await User.findOne({ where: { email: email } });

            if (!registeredUser) {

                return res.status(404).json({
                    status: "404",
                    message: 'User does not exist.!!'
                });

            } else {

                if (registeredUser.active === false) {
                    return res.status(400).json({
                        status: "400",
                        message: 'You are not allowed to access features.!!'
                    });

                } else {

                    if (registeredUser.verified === false) {
                        console.log('register');

                        let mailing = {
                            from: 'Admin',
                            to: registeredUser.email,
                            subject: 'Account Verification',
                            html: `<section>
                                    <h1> Welcome ${registeredUser.firstName} </h1>
                                    <p>
                                        <a href="http://localhost/chat/src/public/email-verification.php?token=${registeredUser.accountVerificationToken}">Click me..1!</a>
                                    </p>
                               </section>`
                        };

                        mail.nodeMail(mailing);

                        return res.status(400).json({
                            status: "400",
                            message: 'Verify your account first, before Login..!!',
                        });

                    } else {

                        bcrypt.compare(password, registeredUser.password).then((compared) => {

                            if (!compared) {

                                return res.status(400).json({
                                    status: "400",
                                    message: 'Incorrect Password'
                                });

                            } else {

                                const token = jwt.sign({

                                    id: registeredUser.id,
                                    firstName: registeredUser.firstName,
                                    lastName: registeredUser.lastName,
                                    email: registeredUser.email,
                                    verified: registeredUser.verified,
                                    active: registeredUser.active,
                                    userRole: registeredUser.userRole,
                                    createdAt: registeredUser.createdAt,
                                    updatedAt: registeredUser.updatedAt,
                                    deviceType: registeredUser.deviceType

                                }, process.env.JWT_KEY);

                                return res.status(200).json({
                                    status: "200",
                                    message: 'Logged in Successfully',
                                    results: {
                                        user: {
                                            id: registeredUser.id,
                                            userRole: registeredUser.userRole
                                        },

                                        token: token
                                    }
                                });

                            }

                        });

                    }

                }

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'All fields are required.!!',
                error: [
                    'email is required',
                    'password is required',
                    'deviceType is required'
                ]
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

/* Account Verification api */
exports.accountVerification = async (req, res, next) => {

    try {

        var token = req.body.token;
        var deviceType = req.body.deviceType;

        if (token, deviceType) {
            console.log(token);
            const isAccountToken = await User.findOne({ where: { accountVerificationToken: token } });

            if (!isAccountToken) {

                return res.status(400).json({
                    status: "400",
                    message: 'Verification link has expired.!!'
                });

            } else {

                let user = isAccountToken;

                if (user.verified === true) {

                    return res.status(400).json({
                        status: "400",
                        message: 'Account is already verified.!!'
                    });

                } else {

                    let updateUser = {
                        verified: true,
                        accountVerificationToken: null
                    }

                    user.update({ ...updateUser }).then((user) => {

                        const token = jwt.sign({

                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            verified: user.verified,
                            active: user.active,
                            userRole: user.userRole,
                            createdAt: user.createdAt,
                            updatedAt: user.updatedAt,
                            deviceType: user.deviceType

                        }, process.env.JWT_KEY);

                        return res.status(200).json({
                            status: "200",
                            message: 'Verified Successfuly',
                            results: {
                                user: {
                                    id: user.id,
                                    userRole: user.userRole
                                },

                                token: token
                            }
                        });

                    }).catch((error) => {

                        return res.status(400).json({
                            status: "400",
                            message: 'Verified Failed',
                            error: error
                        });

                    })

                }

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'All fields are required.!!',
                error: [
                    'Token is required',
                    'deviceType is required'
                ]
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

/* Forgot Password api */
exports.forgotPassword = async (req, res, next) => {

    try {

        var email = req.body.email;
        var deviceType = req.body.deviceType;

        if (email, deviceType) {

            const isUser = await User.findOne({ where: { email: email } });

            if (!isUser) {

                return res.status(404).json({
                    status: "404",
                    message: 'Email does not exist.!!'
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

                        let user = isUser;

                        let updateUser = {
                            forgotPasswordToken: cryptedToken,
                            forgotPasswordTokenExpire: Date.now() + 3600000
                        };

                        user.update({ ...updateUser }).then((user) => {

                            let mailing = {
                                from: 'Admin',
                                to: user.email,
                                subject: 'Password Reset Link',
                                html: `<section>
                                        <h1> Welcome ${user.firstName} </h1>
                                        <p>
                                            <a href="http://localhost/chat/src/public/recovery-password.php?token=${cryptedToken}">Click me..1!</a>
                                        </p>
                                   </section>`
                            };

                            mail.nodeMail(mailing);

                            return res.status(200).json({
                                status: "200",
                                message: 'Recovery Password has sent to requested Email.',
                                user: user
                            });

                        }).catch((error) => {

                            return res.status(400).json({
                                status: "400",
                                message: 'Forgot Password Failed..!!',
                                error: error
                            });

                        });
                    }

                });

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'All fields are required.!!',
                error: [
                    'Email is required.',
                    'deviceType is required'
                ]
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

/* Recovery Password api */
exports.recoveryPassword = async (req, res, next) => {

    try {

        var token = req.body.token;
        var deviceType = req.body.deviceType;
        var password = req.body.password;

        if (token, deviceType, password) {

            const isRecoveryToken = await User.findOne({ where: { forgotPasswordToken: token, forgotPasswordTokenExpire: { [Op.gt]: Date.now() } } });

            if (!isRecoveryToken) {

                return res.status(400).json({
                    status: "400",
                    message: 'Recovery Link has Expired.!!',
                });

            } else {

                let user = isRecoveryToken;
                
                bcrypt.hash(password, 12).then((hashed) => {

                    let recoveryPassword = {
                        password: hashed,
                        forgotPasswordToken: null,
                        forgotPasswordTokenExpire: null
                    };

                    user.update( {...recoveryPassword} ).then((user) => {

                        return res.status(200).json({
                            status: "200",
                            message: 'Password has Updated Successfully.!!'
                        });

                    }).catch((error) => {
                        
                        return res.status(400).json({
                            status: "400",
                            message: 'Reset Password Failed.!!',
                            error: error
                        });

                    });

                }).catch((error) => {

                    return res.status(400).json({
                        status: "400",
                        message: 'hashing error.!!',
                        error: error
                    });
                    
                });

            }

        } else {

            return res.status(400).json({
                status: "400",
                message: 'All fields are required.!!',
                error: [
                    'Email is required.',
                    'deviceType is required',
                    'Password is required'
                ]
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


