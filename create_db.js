var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected Sucessful");
  /*Create a database named "mydb":*/
  con.query("CREATE DATABASE BitBns_Aggregator", function (err, result) {
    if (err) throw err;
    console.log("Database created sucessfully");
  });
});
