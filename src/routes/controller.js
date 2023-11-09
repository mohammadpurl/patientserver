const autoBind = require("auto-bind-inheritance");

const { validationResult } = require('express-validator');

const User = require('./../modeles/user')
module.exports = class{
    constructor(){
        autoBind(this)
        this.User =  User;
    }
    validationBody(req,res){
        console.log('validationBody')
        const result = validationResult(req);
        if(!result.isEmpty()){
            const errors = result.array();
            const message = [];
            errors.forEach(err => message.push(err.msg));
            res.status(400).json({
                message: 'validation error',
                data: message
            })
            return false
        }
        return true
    }
    validate(req,res,next){
        console.log("validationBody")
        if(!this.validationBody(req,res)){
            return
        }
        next()
    }
    response({res, message, code=200, data={}}){
        res.status(code).json({
            message,
            data
        })
    }
}