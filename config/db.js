const {createPool} = require("mysql");

const pool = createPool({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME_Lola,
    // connectionLimit:10
});

const pool2 = createPool({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME_Backadmin,
    // connectionLimit:10
});

const pool3 = createPool({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME_Lola_Redeem,
    // connectionLimit:10
});

const pool4 = createPool({
    port:process.env.DB_PORT,
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME_LOG,
    // connectionLimit:10
});


module.exports.lolaDB = pool;
module.exports.backadminDB = pool2;
module.exports.lolaRedeemDB = pool3;
module.exports.logDB = pool4;
//module.exports = pool;
//module.exports = pool2;