const controller = require('./../controller');
const _ = require("lodash");
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken')
const nations = require('./../../Data/nationality.json')
const languages = require('./../../Data/languages.json')
const religiones = require('./../../Data/religions.json')
const mstatuses = require('./../../Data/MStatus.json')

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

        user = new this.User(_.pick(req.body, [ "email", "password"]));
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        const response = await user.save();
        console.log(response)
        this.response({
            res, message: "the user successfully registered",
            data: _.pick(user, ["_id",  "email"])
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

    // *********************************     Nationalities ************************************
    async GetAllNationality(req, res) {
        try {

            let nationalities = await this.Nationality.find()
            this.response({
                res, message: "",
                data: nationalities
            });
            
        } catch (error) {
            return res.status(401).json({ status: true, message: "Your session is not valid.55", data: error });
        }
    }
    async InsertNationality(req, res) {
        try {

            
            for (var i = 0; i < nations.length; i++) {
                console.log(nations[i].name)
                let nationality = new this.Nationality();
                nationality.name = nations[i].name ;
                nationality.code = nations[i].code

                const response = await nationality.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(401).json({ status: true, message: "Your session is not valid.", data: error });
        }
    }
    // *********************************     Languages ************************************
    async GetAllLanguages(req, res) {
        try {

            let languages = await this.Language.find()
            this.response({
                res, message: "",
                data: languages
            });
            
        } catch (error) {
            return res.status(401).json({ status: true, message: "Your session is not valid.55", data: error });
        }
    }
    async InsertLanguages(req, res) {
        try {

            
            for (var i = 0; i < languages.length; i++) {
                console.log(languages[i].name)
                let language = new this.Language();
                language.name = languages[i].name ;
                language.code = languages[i].code

                const response = await language.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(401).json({ status: true, message: "Your session is not valid.", data: error });
        }
    }
    // *********************************     religions ************************************
    async GetAllReligions(req, res) {
        try {

            let religions = await this.Religions.find()
            this.response({
                res, message: "",
                data: religions
            });
            
        } catch (error) {
            return res.status(401).json({ status: true, message: "Your session is not valid.", data: error });
        }
    }
    async InsertReligion(req, res) {
        try {

            
            for (var i = 0; i < religiones.length; i++) {
                console.log(religiones[i].name)
                let religion = new this.Religion();
                religion.name = religiones[i].name ;
                religion.code = religiones[i].code

                const response = await religion.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(401).json({ status: true, message: "Your session is not valid.", data: error });
        }
    }
     // *********************************     mstatus ************************************
     async GetAllMStatuss(req, res) {
        try {

            let mstatuses = await this.MStatus.find()
            this.response({
                res, message: "",
                data: mstatuses
            });
            
        } catch (error) {
            return res.status(401).json({ status: true, message: "Your session is not valid.", data: error });
        }
    }
    async InsertMstatuses(req, res) {
        try {

            
            for (var i = 0; i < mstatuses.length; i++) {
                console.log(mstatuses[i].name)
                let mstatus = new this.MStatus();
                mstatus.name = mstatuses[i].name ;
                mstatus.code = mstatuses[i].code

                const response = await mstatus.save();
            }
            return res.status(200).json({ status: true, message: "success.", data: {} });

        } catch (error) {
            console.log(error)
            return res.status(401).json({ status: true, message: "Your session is not valid.", data: error });
        }
    }
    // *********************************     GetSexuality ************************************
    async GetSexuality(req, res) {
        try {

            let sexuality = await this.Sexuality.find()
            this.response({
                res, message: "",
                data: sexuality
            });
        } catch (error) {
            return res.status(401).json({ status: true, message: "Your session is not valid.55", data: error });
        }
    }


})();