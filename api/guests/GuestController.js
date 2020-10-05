const { getGuests, getRedeemCode,getRedeemCodeById,getDiamondGuest,getGuestsBlocked,getTrx } = require("./Guest");

//global function
function errorCallBack(err,res){
    console.log(err);
    return res.status(500).json({
        success:0,
        message:"Database Connection error"

    });
}

function getWeekAgo(now){
    //Get today's date using the JavaScript Date object.
    var weekAgo = now;
    //Change it so that it is 7 days in the past.
    var pastDate = weekAgo.getDate() - 7;
    return weekAgo.setDate(pastDate);
}

function removeDuplicate(a, key) {
    let seen = new Set();
    return a.filter(item => {
        let k = key(item);
        //console.log(k)
        return seen.has(k) ? false : seen.add(k);
    });
}

function removeDuplicateUsingHash(results){
    results = results.map((row) => {
        let uid = row.uid.split("$");
        row.uid = uid[0];
        return row;
    });

    const guestHashMap = {}
    results = results.filter((item) => {
        let alreadyExists = guestHashMap.hasOwnProperty(item.uid)
        //console.log(alreadyExists)
        return alreadyExists ? false : guestHashMap[item.uid] = 1
    })
    return results
}

//async function
function getValidGuest(date="",res){
    
    //date = date.toISOString().slice(0,10);
    //data = "2020-06-30";
    return new Promise(resolve => {
        getGuests(date,(err,results) => {
            if(err){
                errorCallBack(err,res)
            }

            results = removeDuplicateUsingHash(results)
            // const guestHashMap = {}

            // results = results.filter((item) => {
            //     let alreadyExists = guestHashMap.hasOwnProperty(item.uid)
            //     //console.log(alreadyExists)
            //     return alreadyExists ? false : guestHashMap[item.uid] = 1
            // })

            //results = removeDuplicate(results, it => it.uid); //menggunakan set


            //Code lama
            // if(typeof(results[0].created_at) != "undefined"){
            //     results = results.map((row) => {
            //         row.uid = row.uid.split("$")[0];
            //         return row
            //     }).filter((v,i,a)=>a.findIndex(t=>(t.uid === v.uid))===i)
            // }
                
            resolve(results);
        });
    
    });
}

function getRedeem(res){
    
    return new Promise(resolve => {
        getRedeemCode((err,results) => {
            if(err){
                errorCallBack(err,res)
            }
            resolve(results);
        });
    
    });
}

function getBlockedGuest (res) {

    return new Promise(resolve => {
        getGuestsBlocked((err,results) => {
            if(err){
                errorCallBack(err,res)
            }
            resolve(results[0].block);
        });
    
    });
}

function getDiamond(res) {
    return new Promise(resolve => {
        getDiamondGuest((err,results) => {
            if(err){
                errorCallBack(err,res)
            }
            resolve(results);
        });
    
    });
}

function redeemConvert(redeemCode,dateArr,weekAgo){

    return new Promise(resolve => {
        const result = [];
        for (const [key, value] of Object.entries(redeemCode)) {
            let data = {};
            const field = ["code"];

            field.forEach(valField => {
                data[valField] = value[valField]
            });

            getRedeemCodeById(value.id,weekAgo, (err,results) => {
                if(err){
                    errorCallBack(err,res)
                }
                
                let redeemLog = [];
                results.forEach(row => {
                    let singleLog = {
                        "date" : row.day,
                        "total" : row.total,
                    };

                    redeemLog.push(singleLog);
                });

                let redeemArr = []
                dateArr.forEach(row => {
                    let redeemArrSingle = [];
                    let find = [];

                    for (const [key, value] of Object.entries(redeemLog)) { 
                        if(row == value['date']){
                            find.push(key);
                        }
                    };

                    redeemArrSingle = find.length > 0 ? redeemLog[find[0]]['total'] : 0;

                    redeemArr.push(redeemArrSingle);
                    
                });

                data['total'] = redeemArr.join(",");
                data['date'] = dateArr.map((v)=>v.toISOString().slice(0,10)).join(",");

                result.push(data);
                resolve(result);

            });

        }
    });

}

function getTrxData(res)
{
    return new Promise(resolve => {
        getTrx((err,results) => {
            if(err){
                errorCallBack(err,res)
            }
            resolve(results);
        });
    
    });
    
}

function getDaysArray(start, end)
{
    for(var arr=[],dt=new Date(start); dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
}

//module export
module.exports = {

    getGuests: async (req,res) => {

        const uidTest = {
            'f65075ad7d0e84d1ffcc17c915437cc1' : 1 ,'506cda9bb63226d798e9de4aa183a368': 1 ,'ec476c12a02dc496ede73beb19d5a25b': 1 ,
            '44E3AECA-D846-4A97-A33E-D352FC23832B': 1 ,'9D6F750C-AA80-4908-A868-5513A65FDB85': 1 ,'ed69a77355ddcb559eb365479a9f07ab': 1 ,
            '473A40FA-254E-406E-885D-2DD145F85EBB': 1 ,'37F7FC41-E574-4971-96AF-D9A426E5F356': 1 ,'74b74d6e11280469c2ed3c393a8bd9c5': 1 ,
            '81df95eee46a7ffccfacfba1c4cf859e': 1 ,'b9bedccda222bd22f94cb6ce50a2fecd': 1 ,'906bdcee688a682aabfeecb59a0b76d1' : 1,'e8ec1b032740f9a5ceb0747d290b0fb9' :1
        };

        const weekAgo = getWeekAgo(new Date());
        const arrayGuest = await getValidGuest(weekAgo,res);

        //total guests;
        const totalGuest = await getValidGuest('',res);
        const iosGuest = totalGuest.filter((item)=> item.google != null ? item.google.indexOf("G:") != -1 : false );
        const aosGuest = parseInt(totalGuest.length) - parseInt(iosGuest.length);
        const guests = {
            "totalGuest" : totalGuest.length,
            "aosGuest" : aosGuest,
            "iosGuest" : iosGuest.length
        }

        // var dayList = getDaysArray(weekAgo,new Date());
        var dayList = getDaysArray(new Date("2020-06-30"),new Date("2020-07-06"));
        dayList.map((v)=>v.toISOString().slice(0,10)).join("")


        let graphDaily = [];
        for (var i = 0; i < dayList.length; i++){
            var register = [];
            var blocked = [];
            searchDate = dayList[i].toISOString().slice(0,10);
            arrayGuest.forEach(row => {
                guestDate = row.created_at.toISOString().slice(0,10);
                if(guestDate == searchDate) {
                    row.block != 1 ? register.push(row) : blocked.push(row)
                }
            });

            graphDaily.push({
                "date" : searchDate,
                "register" : register ? register.length : 0,
                "blocked" : blocked ? blocked.length : 0
            })
        }

        //redeem
        let redeemCode = await getRedeem();
        redeemCode = await redeemConvert(redeemCode,dayList,weekAgo);

        //diamond
        let diamond = await getDiamond();
        diamond = removeDuplicateUsingHash(diamond)
        diamond = diamond.filter((item) => {
            let alreadyExists = uidTest.hasOwnProperty(item.uid)
            return alreadyExists ? false : true
        }).reduce((next, current) => next + current.premium,0);
        let diamondAvg  = Math.round(((diamond / totalGuest.length) + Number.EPSILON) * 100) / 100

        //blocked user
        let blockedGuest = await getBlockedGuest();
        let blockedAvg  = Math.round(((blockedGuest / totalGuest.length) + Number.EPSILON) * 100) / 100

        //trx
        let totalTrx = await getTrxData();
        let payingUser = totalTrx.reduce(function(rv, x) {
            (rv[x['guest_id']] = rv[x['guest_id']] || []).push(x);
            return rv;
          }, {});
        payingUser = Object.keys(payingUser).length;


        return res.status(200).json({
            success:1,
            data : {
                "graphDaily" :graphDaily,
                "graphRedeem" : redeemCode,
                "guests" : guests,
                "diamondTotal" : diamond,
                "diamondAvg" : diamondAvg,
                'blockedGuest' : blockedGuest,
                "blockedAvg" : blockedAvg,
                "totalTrx" : totalTrx.length,
                "payingUser" : payingUser
            },
      
        })
    }
};