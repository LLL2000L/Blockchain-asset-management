# Blockchain-asset-management

Installation Manual

(1) Install Ganache Ethereum test network, which can be downloaded from the official Ganache - Truffle Suite website.

(2) Find Metamask in the Chrome, Edge, or Firefox browser extensions and install it.

(3) Install Node.js.

(4) Globally install Truffle by entering the command `npm install -g truffle`, then use `truffle version` to check the installed Truffle version.

(5) Start Ganache, modify the default Ethereum account balances, and import the generated 10 Ethereum accounts into Metamask using the mnemonic phrase.

(6) Install MySQL database and import the data file testTwo.sql. In the db.js file under the web folder, modify the database connection content according to the local database.

(7) Open the project folder, then in the root directory console, enter "truffle compile" to compile, and after successful compilation, enter "truffle migrate" to deploy. Note that Ganache must be running in the background.

(8) In the console of the web, app\master, and app\common folders, respectively, install dependencies using "npm install" (or "cnpm install").

(9) After deploying smart contracts and successfully installing dependencies, enter "node index.js" in the web folder to start the backend. In the app\master and app\common folders, run "npm run dev", and then open the browser and enter the URLs: http://localhost:8080 and http://localhost:8082.

# ================================

安装手册

（1） 安装 Ganache 以太坊测试网络，可以在官网 Ganache - Truffle Suite 下载。

（2） 在谷歌、Edge 或者火狐浏览器程序扩展找到 Metamask，并安装。

（3） 安装 node.js。

（4） 全局安装 Truffle，输入命令`npm install -g truffle`，`truffle version`查看已经安装好的 Truffle 版本。

（5） 启动 Ganache，修改默认以太坊账户余额，并将生成的 10 个以太坊账户通过助记词方式导入到 Metamask 中。

（6） 安装数据库 MySQL，并导入 testTwo.sql 的数据文件，在程序文件 web 下的 db.js 中更改连接的数据库内容，按照本地数据库进行修改。

（7） 打开程序文件 project，在根目录的控制台中输入 truffle compile 编译，无误后输入 truffle migrate 部署，前提是 Ganache 要在后台打开。

（8） 分别在 web、app\master、app\common 文件夹下的控制台安装依赖：npm install（或者 cnpm install）。

（9） 部署智能合约和安装依赖成功后，在 web 文件夹下输入 node index.js 启动后台，在 app\master、app\common 输入命令 npm run dev 运行，并打开浏览器输入 URL：http://localhost:8080 、http://localhost:8082。
