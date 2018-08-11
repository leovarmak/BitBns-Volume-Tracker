// Calling required packages
const axios = require('axios');
var mysql = require('mysql');
var moment = require('moment');
var nodemailer = require('nodemailer');
const signale = require('signale');


const getSIDURL = 'https://wsxrp.bitbns.com/socket.io/?EIO=3&transport=polling&t=MI3VZr-';  // XRP Market
const gettradeHistoryURL = 'https://wsxrp.bitbns.com/socket.io/?EIO=3&transport=polling&t=MI3VZuB&sid=';
// Configuring MySQL Connection settings
var con = mysql.createConnection({
    host: "x.x.x.x",
    user: "username",
    password: "password",
    database: "BitBns_Aggregator" // You can choose any DB.
});
var SessionID;
let _x;
var SNoCounter = 1


con.connect(function (err) {
    signale.success("Connected to DB Sucessful");
    if (err) throw err;
});


function firstRun(){
    // This is like manually starting the function on the first run
    generateSessionID();
    // setTimeout us    ed to delay the function call to get data from the previous function.
    setTimeout(function () {
        getTradeHistory(SessionID);
    }, 3000);
    setTimeout(function () {
        StoreDB();
    }, 7000);
    var now = moment();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'email',
          pass: 'password'
        }
      });
      var temp = 'Hey! \n\n BitBns-Aggregator just started running right now ('+ now +') and monitoring XRP. You will be notified every 24 Hours about the aggregated volume. \n\n\n BitBns Aggregator';
      var mailOptions = {
        from: 'email',
        to: 'destination email',
        subject: 'BitBns Aggregator Started - XRP',
        text: temp
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          signale.success('Email sent: ' + info.response);
        }
      });
}
firstRun();

// Repeating the functions to get new data
setInterval(function () {
    generateSessionID();
    setTimeout(function () {
        getTradeHistory(SessionID);
    }, 4000);
    setTimeout(function () {
        StoreDB();
    }, 8000);
}, 14000);

// Send an email after 24 Hours with an aggregator Volume
setInterval(function(){
    SendMail_24Hours();
}, 1000*60*60*24)

// This function's job is to get SessionID 
function generateSessionID() {
    axios.get(getSIDURL).then(function (res) {
        var data = res.data;
        try{
            data = data.split("{")[1].split("}")[0];
            data = JSON.parse(`{${data}}`)
            SessionID = data.sid;
            console.log(SessionID);
            return SessionID;
        }catch(e){
            generateSessionID();
            console.log(e);
        }
    }).catch(function (error) {
        console.log('There seems to be an error generating the SessionID. Retrying.......');
        generateSessionID();
    })
}


// This function's job is to get trade history using the SessionID generated in the previous function
// Doing some set of operations to extract the tradehistory since the data we receive is fucked up.
function getTradeHistory(SessionID) {
    SessionID && axios.get(gettradeHistoryURL + SessionID).then(function (res) {
        let data = res.data
        try {
            _x = String(data).split("").reverse().join("").split("[")[0].split("").reverse().join("").replace(']}"]', '').trim().replace(/\\/g, "").trim()
            _x = `{"data":[${_x}]}`
            _x = JSON.parse(_x)
            console.log("_x inside the try block: ", _x)
        }catch (e) {
            _x = {};
            console.log(_x)
        }
    }).catch(function (error) {
        signale.pending('There seems to be an error getting Trade History. Retrying.......');
            getTradeHistory(SessionID);
        })
}


// This function's role is to save the trade history in a DB
function StoreDB() {
    if(!_x || _x == undefined || Object.keys(_x).length < 1){
        return null;
    }
    var counter = 0;
    var sql_query = "SELECT * FROM XRP_BitBns_TradeHistory"
    con.query(sql_query, function (err, result) {
        if (err) {
            throw err;
            StoreDB();
        }
        if (result.length <= 0) {
            while (counter < 10) {
                sql_query = "INSERT INTO XRP_BitBns_TradeHistory (TimeStamp, Volume, PPU) VALUES ('" + moment(_x.data[counter].time).format() + "'," + _x.data[counter].btc + "," + _x.data[counter].rate + ");"
                con.query(sql_query, function (err, result) {
                    if (err) throw err;
                    signale.success("First Run Order Book snapshot loaded into DB.");
                });
                if (err) {
                    console.log(err);
                    StoreDB();
                }
                counter = counter + 1
                SNoCounter = SNoCounter + 1;
            }
        }
        else {
            sql_query = "select * from XRP_BitBns_TradeHistory order by TimeStamp asc;"
            con.query(sql_query, function (err, result) {
                if (err) {
                    throw err;
                    StoreDB();
                }
                counter = 9;
                tempVariable = result.length - 1;
                while (counter >= 0){
                    var tempDate = moment(_x.data[counter].time).format();
                console.log(moment(_x.data[counter].time).format())
                    if (tempDate > result[tempVariable].TimeStamp) {
                        if (tempDate == result[tempVariable].TimeStamp && _x.data[counter].btc == result[tempVariable].Volume && _x.data[counter].rate == result[tempVariable].PPU) {
                            signale.watch("The condition failed. So skipping.");
                        }
                        else{
                            sql_query = "INSERT INTO XRP_BitBns_TradeHistory (TimeStamp, Volume, PPU) VALUES ('" + moment(_x.data[counter].time).format() + "'," + _x.data[counter].btc + "," + _x.data[counter].rate + ");"        
                            con.query(sql_query, function (err, result) {
                                if (err) {
                                    throw err;
                                    StoreDB();
                                }
                                signale.success("New trade detected and stored in DB.");
                            });
                        }
                    }
                    counter = counter - 1;
                }
            });
        }
    });
}

// Send an email with the total aggregated volume after 24 Hours.
function SendMail_24Hours() {
    var Volume = 0;
    sql_query = "SELECT SUM(Volume) AS Total FROM XRP_BitBns_TradeHistory;"
    con.query(sql_query, function (err, result) {
        if (err) throw err;
        Volume = result[0].Total;
        console.log("24 Hour Volume: ", Volume);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'email', // Enter your email here
              pass: 'password' // Enter your password here
            }
          });
          var temp = 'Hey! \n\n Its been 24Hours and here is the total XRP Volume: ' + Volume + '\n\n\n BitBns Aggregator';
          var mailOptions = {
            from: 'email', 
            to: 'destination_email', // The email address where you want to receive the email
            subject: '24 Hours XRP Volume',
            text: temp
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
                signale.success('Email sent: ' + info.response);
            }
          });
    });
    
}