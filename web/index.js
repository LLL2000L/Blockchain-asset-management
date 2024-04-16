var express = require("express");

//导入数据库模块
var connection = require("./db.js");
// var mysql = require("mysql");
let Web3 = require("web3");
let oneCompanyArtifact = require("../build/contracts/OneCompany.json");
// let groupArtifact = require("../build/contracts/Group.json");
var web3 = new Web3(new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545"));

var app = express();
const jwt = require("jsonwebtoken");
const cert = "ksdhy_yb";

/**
 * 登陆验证，生成token
 * @param {string} username 用户名
 * @param {string} password 密码
 */
function generateToken(username, password) {
  return jwt.sign(
    {
      // token数据
      username,
      password,
    },
    cert, // 密钥
    {
      //参数 options
      algorithm: "HS256", // 加密算法   对称加密算法
      issuer: "ksdhy", // 签发人
      expiresIn: 60 * 60 * 24 * 30, // 过期时间   单位：s
    }
  );
}
/**
 * 签名验证
 * @param {string} token
 */
function verifyToken(token) {
  try {
    let arr = jwt.verify(token, cert, {
      issuer: "ksdhy",
      algorithms: ["HS256"],
    });
    return arr;
  } catch (error) {
    return {
      code: 10000,
      message: error.message,
    };
  }
}

web3.eth.net.getId().then((networkId) => {
  const oneCompanyDeployedNetwork = oneCompanyArtifact.networks[networkId];

  // 公司地址
  var company = oneCompanyDeployedNetwork.address;
  console.log(company);
  // http provider
  var provider = "HTTP://127.0.0.1:7545";

  // 公司 abi
  var companyAbi = oneCompanyArtifact.abi;

  // 跨域处理
  app.all("*", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1')
    // res.header("Content-Type", "application/text;charset=utf-8");
    next();
  });

  // 添加一个管理员注册用户到注册池子里
  function addRegisterMaster(name, password, address, userType) {
    var sql =
      "INSERT INTO adminMaster(name,password,address,user_type) VALUES(?,?,?,?)";
    var sqlParams = [name, password, address, userType];
    connection.query(sql, sqlParams, function (err, result) {
      if (err) {
        console.log("[INSERT ERROR] - ", err.message);
        return;
      }
      console.log("insert success");
    });
  }

  // 添加一个员工注册用户到注册池子里
  function addRegister(name, password, address, userType) {
    var sql =
      "INSERT INTO registerPool(name,password,address,user_type) VALUES(?,?,?,?)";
    var sqlParams = [name, password, address, userType];
    connection.query(sql, sqlParams, function (err, result) {
      if (err) {
        console.log("[INSERT ERROR] - ", err.message);
        return;
      }
      console.log("insert success");
    });
  }

  // 管理员注册
  app.get("/masterRegister", (req, res) => {
    var name = req.query.name;
    var password = req.query.password;
    var address = req.query.address;
    var userType = "master";
    console.log(name + " " + password + " " + address + " " + userType);
    addRegisterMaster(name, password, address, userType);
    // res.send(req.query.address); //返回获取到的账户地址，便于注册是筛选
    var sql =
      "select address from adminMaster union select address from user union select address from registerPool"; //查找3表存在的账号
    connection.query(sql, function (err, result) {
      console.log(result);
      res.send(result); //返回这些账号数组给前端，进行注册判断
    });
  });

  //员工的注册
  app.get("/commonRegister", (req, res) => {
    var name = req.query.name;
    var password = req.query.password;
    var address = req.query.address;
    var userType = "common";
    console.log(name + " " + password + " " + address + " " + userType);
    addRegister(name, password, address, userType);
    var sql =
      "select address from adminMaster union select address from user union select address from registerPool"; //查找3张表都存在的账号
    connection.query(sql, function (err, result) {
      console.log(result);
      res.send(result); //返回这些账号数组给前端，进行注册判断
    });
  });

  //管理员审核结果
  app.get("/commonCheck", (req, res) => {
    var address = req.query.address;
    console.log(address + " ");
    var sql = "select address from user "; //查找user表存在的账号
    connection.query(sql, function (err, result) {
      console.log(result);
      res.send(result); //返回这些账号数组给前端，进行注册判断
    });
  });

  /**
   * 管理员登录
   * */
  app.get("/masterLogin", async (req, res) => {
    var name = req.query.name;
    var password = req.query.password;
    var sql = "select * from adminMaster where name=? and password=?";
    var sqlParam = [name, password];
    var json = {
      code: "200",
      jwt: "",
      company: "",
      companyAbi: "",
      provider: "",
      master: "",
    };
    await connection.query(sql, sqlParam, function (_err, result) {
      try {
        json.jwt = generateToken(name, password);
        json.company = company;
        json.companyAbi = companyAbi;
        json.provider = provider;
        json.master = result[0].address;
        console.log(json);
        res.send(json);
      } catch {
        json.code = "201";
        res.send(json);
        console.log("错误");
      }
    });
  });

  app.get("/masterUpdate", async (req, res) => {
    var oldName = req.query.oldName;
    var name = req.query.name;
    var password = req.query.password;
    var jwt = req.query.jwt;
    var check = verifyToken(jwt);
    if (check.code == 10000) {
      res.send("201");
      return;
    }
    var sql = "update adminMaster set name=?,password=? where name=?";
    var sqlParam = [name, password, oldName];
    await connection.query(sql, sqlParam, (error, result) => {
      if (error) {
        console.log("[UPDATE ERROR] - ", error.message);
        return;
      }
      console.log(result);
      res.send("200");
    });
  });

  // 员工登录
  app.get("/commonLogin", async (req, res) => {
    var name = req.query.name;
    var password = req.query.password;
    var sql = "select * from user where name=? and password=?";
    var sqlParam = [name, password];
    await connection.query(sql, sqlParam, (error, result) => {
      var json = {
        code: "",
        jwt: "",
        company: "",
        companyAbi: "",
        provider: "",
        common: "",
      };
      try {
        json.code = 200;
        json.jwt = generateToken(name, password);
        json.company = company;
        json.companyAbi = companyAbi;
        json.provider = provider;
        json.common = result[0].address;
        res.send(json);
      } catch {
        json.code = 201;
        res.send(json);
        console.log(error);
      }
    });
  });

  // 员工修改个人信息
  app.get("/commonUpdate", async (req, res) => {
    var oldName = req.query.oldName;
    var name = req.query.name;
    var password = req.query.password;
    var jwt = req.query.jwt;
    var check = verifyToken(jwt);
    if (check.code == 10000) {
      res.send("201");
      return;
    }
    var sql = "update user set name=?,password=? where name=?";
    var sqlParam = [name, password, oldName];
    await connection.query(sql, sqlParam, (error, result) => {
      if (error) {
        console.log("[UPDATE ERROR] - ", error.message);
        return;
      }
      console.log(result.message);
      res.send("200");
    });
  });

  // 根据员工地址获取员工名字
  app.get("/getCommonName", (req, res) => {
    var address = req.query.address;
    var sql = "select * from user where address=?";
    var sqlParam = [address];
    connection.query(sql, sqlParam, (error, result) => {
      res.send(result[0].name);
    });
  });

  // 管理员获取员工申请注册
  app.get("/getCommonRegister", (req, res) => {
    // var address=req.query.address
    var sql = "select * from registerPool where user_type=?";
    var sqlParam = ["common"];
    connection.query(sql, sqlParam, (error, result) => {
      var data = [];
      result.map((x) => {
        var json = { name: x.name, address: x.address };
        data.push(json);
      });
      res.send(data);
    });
  });

  // 管理员同意/拒绝是否添加用户0:拒绝，1:同意
  app.get("/checkCommon", (req, res) => {
    var name = req.query.name;
    var address = req.query.address;
    var action = req.query.action;
    if (action == 1) {
      var sql =
        "select * from registerPool where name=? and address=? and user_type=?";
      var sqlParam = [name, address, "common"];
      connection.query(sql, sqlParam, (error, result) => {
        if (!error) {
          var password = result[0].password;
          console.log(password);
          var addSql =
            "insert into user(name,password,address,user_type) values(?,?,?,?)";
          var addSqlParam = [name, password, address, "common"];
          connection.query(addSql, addSqlParam, (error, result) => {
            console.log(error);
            // 从注册池子里删除记录
            var delSql = "delete from registerPool where name=? and address=?";
            var delSqlParam = [name, address];
            connection.query(delSql, delSqlParam, (error, result) => {});
            res.send("insert ok");
          });
        }
      });
    } else {
      var delSql = "delete from registerPool where name=? and address=?";
      var delSqlParam = [name, address];
      connection.query(delSql, delSqlParam, (error, result) => {});
      res.send("reject ok");
    }
  });

  // ------------------------------------溯源数据存储在MySQL中-------------------------------------------
  // 从前端获取的数据到数据表 traceData 里的方法
  function addTraceData(
    txType,
    txHash,
    uintID,
    assetsName,
    userName,
    person,
    timeStamp
  ) {
    var sql =
      "INSERT INTO traceData(txType,txHash,uintID,assetsName,userName,person,timeStamp) VALUES(?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE txType=values(txType),uintID=values(uintID),assetsName=values(assetsName),userName=values(userName),person=values(person),timeStamp=values(timeStamp) ";
    var sqlParams = [
      txType,
      txHash,
      uintID,
      assetsName,
      userName,
      person,
      timeStamp,
    ];
    connection.query(sql, sqlParams, function (err, result) {
      if (err) {
        console.log("[INSERT ERROR] - ", err.message);
        return;
      }
      console.log("insert success");
    });
  }

  //添加从前端获取的数据到数据表 traceData 里
  app.get("/addTrace", async (req, res) => {
    var txType = req.query.txType;
    var txHash = req.query.txHash;
    var uintID = req.query.uintID;
    var assetsName = req.query.assetsName;
    var userName = req.query.userName;
    var person = req.query.person;
    var timeStamp = req.query.timeStamp;
    // console.log(name + " " + count_number + " ");
    await addTraceData(
      txType,
      txHash,
      uintID,
      assetsName,
      userName,
      person,
      timeStamp
    );
    res.send("添加数据成功");
  });

  //从数据库获取数据，返回给前端
  app.get("/getTrace", async (req, res) => {
    var uintID = req.query.uintID;
    var sqlParams = [uintID];
    var sql =
      "select txType,txHash,uintID,assetsName,userName,person,timeStamp from traceData where uintID=?";
    // console.log(name + " ", sqlParams + "");
    await connection.query(sql, sqlParams, function (err, result) {
      console.log(result);
      res.send(result); //返回数据给前端
    });
  });
  // ------------------------------------------------------------------------

  var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("server at=>    http://%s:%s", host, port);
  });
});
