const { verify } = require("jsonwebtoken");

module.exports = {
    checkToken : (req,res,next) => {
        let token = req.get("authorization");
        if(token){

            token = token.slice(7);
            console.log(token);
            verify(token, process.env.JWT_KEY, (err,decoded) => {
                console.log(decoded);
                if(err){
                    res.json({
                        success: 0,
                        message : "Invalid Token"
                    });
                }else{
                    next();
                }

            })

        }else{
            res.json({
                success : 0,
                message : "Access denied! Unauthorized user"
            })
        }
    }
}