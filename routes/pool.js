var mysql=require("mysql")

var pool=mysql.createPool({

host:'localhost',
port:3306,
user:'root',
password:'1234',
database:'nodeproject',
connectionLimit:100


})

module.exports = pool