// 导入mysql模块
const mysql = require("mysql");

// 创建数据库连接对象
// var connection = mysql.createConnection({
//   host: "localhost", //PHPmyadmin数据库
//   user: "root",
//   password: "123456",
//   database: "ljy",
//   port: 3306,
// });
// connection.connect();

var connection = mysql.createConnection({
  host: "60.190.235.213",
  user: "rootNew",
  password: "",
  database: "testTwo",
  port: 3306,
});
connection.connect();

// 检查是否成功连上数据库;
// var sql = "SELECT * FROM owner";
// //查
// connection.query(sql, function (err, result) {
//   if (err) {
//     console.log("[SELECT ERROR] - ", err.message);
//     return;
//   }
//   console.log("----------------------SELECT--owner-----------------------");
//   console.log(result);
//   console.log(
//     "------------------------------------------------------------\n\n"
//   );
// });

// var sql = "SELECT * FROM registerpool";
// //查
// connection.query(sql, function (err, result) {
//   if (err) {
//     console.log("[SELECT ERROR] - ", err.message);
//     return;
//   }
//   console.log("---------------SELECT--registerpool-------------------");
//   console.log(result);
//   console.log(
//     "------------------------------------------------------------\n\n"
//   );
// });

// var sql = "SELECT * FROM user";
// //查
// connection.query(sql, function (err, result) {
//   if (err) {
//     console.log("[SELECT ERROR] - ", err.message);
//     return;
//   }
//   console.log("----------------SELECT--user----------------------");
//   console.log(result);
//   console.log(
//     "------------------------------------------------------------\n\n"
//   );
// });

// 向外共享 db 数据库连接对象
module.exports = connection;
