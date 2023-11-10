const controller = require('./../controller');
const _ = require("lodash");

const jwt = require('jsonwebtoken')
module.exports = new (class extends controller {
    async dashboard(req,res ){
        
        let users = await this.User.find() 
        this.response({res, message:"",
        data:users
         });
    }
    // *********************login**********************
    async profile(req,res ){
        this.response({res,data:_.pick(req.user,["name","email"])})
    }

}) ();