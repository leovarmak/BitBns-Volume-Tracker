var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "BitBns_Aggregator"
});

const sql_query = "CREATE TABLE BitBns_TradeHistory (SNo INT NOT NULL primary key AUTO_INCREMENT, TimeStamp VARCHAR(120) NOT NULL, Volume DOUBLE NOT NULL, PPU DOUBLE NOT NULL);"
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected Sucessful");
  con.query(sql_query, function (err, result) {
    if (err) throw err;
    console.log("Table created sucessfully");
  }); 
});
