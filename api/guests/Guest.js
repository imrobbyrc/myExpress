const pool = require("../../config/db");
//const pool2 = require("../../config/db");
const {lolaDB, lolaRedeemDB, logDB, backadminDB} = require("../../config/db");

module.exports = {

    getGuests : (date,callBack) => {
        let query = `select uid,google from guests where origin_game_id= 2 and uid != '' and ((uid like '%$%' and left(uid,1) != '$' and right(uid,1) != '$') OR (uid not like '%$%' and uid != '' and uid not like '%158%') OR right(uid,1)='$' and left(uid,1) != '$')`
        if(date!="") {
            query = `select uid,created_at,block,google from guests where left(created_at,10) >= "2020-06-30" and created_at <= NOW() and origin_game_id= 2 and uid != '' and ((uid like '%$%' and left(uid,1) != '$' and right(uid,1) != '$') OR (uid not like '%$%' and uid != '' and uid not like '%158%') OR right(uid,1)='$' and left(uid,1) != '$')`
        }

        lolaDB.query(
            query, [date],
            (error,results,fields) => {
                if(error){
                    //console.log(error)
                    return callBack(error);
                }
                return callBack(null,results);
            }
        )
    },

    //Data redeem
    getRedeemCode : callBack => {
        lolaRedeemDB.query(
            `select id, code, sponsor from redeem where game_id = 2 and (end_date >= NOW() and type = 1 or expired = 0)`,
            (error,results,fields) => {
                if(error){
                    //console.log(error)
                    return callBack(error);
                }
                return callBack(null,results);
            }
        )
    },

    getRedeemCodeById : (id,weekAgo,callBack) => {
        logDB.query(
            `select count(id) as total, DATE(created_at) as day from log_redeem where left(created_at,10) >= "2020-09-07" and redeem_id = 3 group by day, redeem_id`,[id],
            (error,results,fields) => {
                if(error){
                   // console.log(error)
                    return callBack(error);
                }
                
                return callBack(null,results);
            }
        )
    },

    getDiamondGuest : callBack => {
        lolaDB.query(
            `select guests.uid, premium.premium from premium join guests on premium.guest_id = guests.id where guests.block = 0 and game_id = 2 and guests.uid != ''`,
            (error,results,fields) => {
                if(error){
                    // console.log(error)
                     return callBack(error);
                 }
                 
                 return callBack(null,results);
            }
        )
    },

    getGuestsBlocked : callBack => {
        lolaDB.query(
            `select count(id) as block from guests where block = 1 and origin_game_id = 2`,
            (error,results,fields) => {
                if(error){
                    console.log(error)
                    //return callBack(error);
                }
                return callBack(null,results);
            }
        )
    },

    getTrx : callBack => {
        logDB.query(
            `select guest_id from log_trx where game_id = 2 and status in (1,11,-6) and ((platform = 'AppleAppStore' and camp = 'Production') OR (platform = 'GooglePlay' and purchase_type = '3'))`,
            (error,results,fields) => {
                if(error){
                    //console.log(error)
                    callBack(error);
                }
                return callBack(null,results);
            }
        )
    },

    getDau : callBack => {
        backadminDB.query(
            `select right(date,2) as date, new_register, active_user from sta
            `,(error,results,fields) => {
                if(error){
                    callBack(error);
                }
                return callBack(null,results);
            }
        )
    }


    // getUsersById : (id,callBack) => {
    //     pool.query(
    //         `select * from guests where id = ?`,
    //         [id],
    //         (error,results,fields) => {
    //             if(error){
    //                 return callBack(error);
    //             }
    //             return callBack(null,results[0]);
    //         }
    //     )
    // },
    
}

