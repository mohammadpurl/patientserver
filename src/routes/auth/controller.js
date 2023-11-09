const controller = require('./../controller');
const _ = require("lodash");
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')
require('dotenv').config();
// const redis_client = require('./../../../redis_connect');

module.exports = new (class extends controller {
    async register(req, res) {

        let user = await this.User.findOne({ email: req.body.email })
        if (user) {
            return this.response({
                res, code: 400, message: 'this user already register'
            })
        }

        user = new this.User(_.pick(req.body, ["name", "email", "password"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const response = await user.save();
        console.log(response)
        this.response({
            res, message: "the user successfully registered",
            data: _.pick(user, ["_id", "name", "email"])
        });
    }
    // *********************login**********************
    async login(req, res) {
        // console.log(req);
        let user = await this.User.findOne({ email: req.body.email })
        //    console.log(`user:${user}`)
        if (!user) {
            console.log("!user")
            return this.response({ res, code: 400, message: "Invalid email or password" })
        }
        console.log(user);
        console.log(user)
        const isvalid = await bcrypt.compare(req.body.password, user?.password);
        console.log(`isvalid ${isvalid}`)
        if (!isvalid) {
            return this.response({ res, code: 400, message: "Invalid  password" })
        }

        const access_token = jwt.sign({ sub: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });

        const refresh_token = await this.GenerateRefreshToken(user._id);

        console.log(refresh_token)

        this.response({ res, message: "successfuly loged in", data: { access_token, refresh_token } })
    }
    // *********************login**********************
    async logout(req, res) {

        const token = req.headers.authorization.split(' ')[1];
        console.log(`logout:${req.headers.authorization}`)
        if (!token) res.status(401).send('access denied')
        try {
            console.log(`token:${token}`)

            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            req.userData = decoded;
            const result = await this.User.findOneAndUpdate({ _id: decoded.sub }, { $set: { lastRefreshToken: "" } })

            return res.json({ status: true, message: "success." });

        } catch (error) {
            return res.status(401).json({ status: true, message: "Your session is not valid.", data: error });
        }

    }
    async GetAccessToken(req, res) {

        const user_id = req.userData.sub;

        const access_token = jwt.sign({ sub: user_id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_TIME });
        console.log(`GetAccessToken${access_token}`)
        const refresh_token = await this.GenerateRefreshToken(user_id);
        console.log(`GetAccessToken${refresh_token}`)
        return res.json({ status: true, message: "success", data: { access_token, refresh_token } });
    }

    async GenerateRefreshToken(user_id) {
        const refresh_token = jwt.sign({ sub: user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIME });

        const result = await this.User.findOneAndUpdate({ _id: user_id }, { $set: { lastRefreshToken: refresh_token } })

        return refresh_token;
    }

    async verifyRefreshToken(req, res, next) {
        const token = req.body.token;
        console.log(`tokenffff:${token}`)
        if (token === null) return res.status(401).json({ status: false, message: "Invalid request." });
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            req.userData = decoded;
            console.log(`decoded${decoded.sub}`)

            const user = await this.User.findById(decoded.sub)
            console.log("lmp")
            if (!user || !user.lastRefreshToken) {
                return res.status(401).json({ status: false, message: "Invalid request. Token is not in store." });
            }
            console.log("ssssss")
            if (user.lastRefreshToken != token) {
                console.log("user.lastRefreshToken != token")
                return res.status(401).json({ status: false, message: "Invalid request. Token is not same in store." });
            }
            console.log("ddddd")
            next()

        } catch (error) {
            return res.status(401).json({ status: true, message: "Your session is not valid.55", data: error });
        }
    }


})();