const controller = require('./../controller');
const _ = require("lodash");

const jwt = require('jsonwebtoken')
module.exports = new (class extends controller {
    async users(req,res ){
        console.log("lmp"+req);
        let users = await this.User.find() 
        this.response({res, message:"",
        data:users
         });
    }
    // *********************login**********************
    async userDetail(req,res ){
        this.response({res,data:_.pick(req.user,["name","email"])})
    }

}) ();