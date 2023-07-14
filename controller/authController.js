const UserModel = require('../model/userModel');
const { sendResponse } = require('../helper/helper')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const  AuthController = {
    register: async (req, res) => {
        try{
            let {firstName, lastName, email, password, contact} = req.body;
            const obj = {firstName, lastName, email, password, contact};
            const requiredArr = ["firstName", "lastName", "email", "password", "contact"];
            const errArr = [];
            requiredArr.forEach((x)=>{
                if(!obj[x]){
                    errArr.push(x)
                }
            })
            if(errArr.length > 0){
                res.send(sendResponse(false, errArr, "All fields should be filled")).status(404);
            }
            else{
                const hashPassword = await bcrypt.hash(obj.password, 10);
                console.log(hashPassword);
                obj.password = hashPassword;
                const existingUser = await UserModel.findOne({email})
                if(existingUser){
                    res.send(sendResponse(false, null, "user already exist")).status(403)
                } else{
                    UserModel.create(obj)
                    .then((result) => {
                    res.send(sendResponse(true, result, "user saved successfully")).status(200)
                    })
                    .catch((err) => {
                        res.send(sendResponse(false, err, "Internal server error")).status(400)
                    })
                }
            }
        }
        catch(err){
            console.log(err);
            res.send(sendResponse(false, err, "All fields should be filled catch block")).status(404);
        }
    },

    login: async (req, res) => {
        try{
            let {email, password} = req.body;
            const obj = {email, password};
            let userObj = await UserModel.findOne({email})
            if(userObj){
                let isConfirm = await bcrypt.compare(obj.password,userObj.password)
                console.log(isConfirm);
                if(isConfirm){
                    console.log("inside isConfirm");
                    let token =  jwt.sign({...userObj}, process.env.SECURITY_KEY, {
                        expiresIn: "24h",})
                        console.log(token);
                        res.send(sendResponse(true, {user: userObj, token}, "Login Successfully")).status(200);
                }else{
                        res.send(sendResponse(false, null, "Credential Error")).status(403);
                }
            }
            else{
                res.send(sendResponse(false, err, "User Doesn't Exist"));
            }
        }
        catch(err){
            console.log(err);
            res.send(sendResponse(false, err, "User Doesn't Exist"));
           
        }

    },

    getUsers: async (req, res) => {
        UserModel.find().then((result)=>{
           res.send(sendResponse(true, result))
        }).catch((err)=>{
           console.log(err)
        })
    },

    protected: async (req, res, next) => {
        let token = req.header.authorization;
        if (token){
            token = token.split(" ")[1];
            jwt.verify(token, process.env.SECURITY_KEY, (err, decoded) => {
                if(err){
                    res.send(sendResponse(false, null, "Unauthorized")).status(403);
                }
                else{
                    console.log(decoded)
                    next();
                }
            })
        }
        else{
            res.send(sendResponse(false, null, "Unauthorized")).status(403);
        }

      }
}

module.exports = AuthController;
