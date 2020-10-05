const { create, getUsers, getUsersById, updateUser, deleteUser, getUserByEmail } = require("./user.service");
const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

function errorCallBack(err,res){
    console.log(err);
    return res.status(500).json({
        success:0,
        message:"Database Connection error"

    });
}

module.exports = {
    createUser: (req,res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        create(body, (err,results) => {
            if(err){
                errorCallBack(err,res)
            }
            return res.status(200).json({
                success:1,
                data:results
            })
        });
    },
    findUser: (req,res) => {
        const id = req.params.id;
        getUsersById(id,(err,results) => {
            if(err){
                errorCallBack(err,res)
            }

            if(!results){
                return res.json({
                    success:0,
                    message:"Record not found"
                })
            }

            return res.status(200).json({
                success:1,
                data:results
            })
        })
    },
    getUsers: (req,res) => {
        getUsers((err,results) => {
            if(err){
                errorCallBack(err,res)
            }

            return res.status(200).json({
                success:1,
                data:results
            })
        })
    },
    updateUser: (req,res) => {
        const body = req.body;
        const salt = genSaltSync(10);
        body.password = hashSync(body.password, salt);
        updateUser(body, (err,results) => {
            if(err){
                errorCallBack(err,res)
            }
            return res.status(200).json({
                success:1,
                message: "updated successfully",
                data:results
            })
        });
    },
    deleteUser :  (req,res) => {
        const data = req.body;
        deleteUser(data, (err,results) => {
            if(err){
                errorCallBack(err,res)
            }
    
            if(!results){
                return res.json({
                    success:0,
                    message:"Record not found"
                })
            }
    
            return res.status(200).json({
                success:1,
                data:results
            })
        });
        
    },
    login: (req,res) => {
        const body = req.body;
        getUserByEmail(body.email,(err,results) => {
            if(err){
                errorCallBack(err,res)
            }
    
            if(!results){
                return res.json({
                    success:0,
                    message:"Invalid email pr password"
                })
            }

            const result = compareSync(body.password, results.password);
            if(result){
                results.password = undefined;
                const jwt = sign({result: results}, process.env.JWT_KEY,{
                    expiresIn : "1h"
                });
                
                return res.json({
                    success:1,
                    message:"login successfully",
                    token : jwt
                });
            }else{
                return res.json({
                    success:0,
                    message:"Invalid email pr password"
                })
            }
    
        })
    }
};