<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">区块链资产管理平台</div>
            <h1 class="super-login">管理员 登录</h1>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username" size="max">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="param.password" @keyup.enter.native="submitForm()" size="max">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>

                <el-form-item class="btn">
                    <el-button type="primary" @click="submitForm()" class="login">登录</el-button>
                    <el-button @click="register" class="register">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            param: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            }
        };
    },
    created() {
        //在渲染完页面后，metamask会弹出（如果是授权过就不会弹出）
        if (typeof web3 !== 'undefined') {
            if (web3.currentProvider.isMetaMask == true) {
                console.log('metamask 可用');
                window.account = ethereum
                    .enable() //账户为用户授权的账户
                    .catch(function (reason) {
                        //如果用户拒绝了登录请求
                        if (reason === 'User rejected provider access') {
                            // 用户拒绝登录后执行语句；
                        } else {
                        }
                    })
                    .then(function (accounts) {
                        return accounts[0];
                    });
            } else {
                alert('非 metamask 环境');
            }
        } else {
            alert('需要安装 metamask');
        }
    },
    methods: {
        submitForm() {
            this.$refs.login.validate((valid) => {
                if (valid) {
                    var url = 'http://127.0.0.1:8081/masterLogin?name=' + this.param.username + '&password=' + this.param.password;
                    this.$axios.get(url).then((res) => {
                        var data = res.data;
                        console.log('datafffffffffffff', data);
                        if (data.code == 201) {
                            this.$message.error('账号密码错误，请重新输入！');
                            console.log(data);
                        } else {
                            this.$message.success('登录成功');
                            localStorage.setItem('ms_username', this.param.username);
                            // localStorage.setItem('password', this.param.password);
                            localStorage.setItem('jwt', data.jwt);
                            console.log(localStorage.getItem('jwt'));
                            console.log(data);
                            // localStorage.setItem('group', data.group);
                            localStorage.setItem('company', data.company);
                            // localStorage.setItem('groupAbi', JSON.stringify(data.groupAbi));
                            localStorage.setItem('companyAbi', JSON.stringify(data.companyAbi));
                            localStorage.setItem('provider', data.provider);
                            // 管理员的地址
                            localStorage.setItem('master', data.master);

                            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                            // 子公司abi
                            var abi = data.companyAbi;
                            // 子公司地址
                            var contractAddress = localStorage.getItem('company');
                            var $myContract = new web3.eth.Contract(abi, contractAddress);
                            console.log($myContract);
                            this.$loginsave($myContract);
                            var myContract = this.$getlogin();
                            console.log(myContract);

                            //测试获取到管理员列表
                            // setTimeout(() => {
                            myContract.methods.getRole('master').call((error, result) => {
                                console.log('管理员', result);
                                if (result == '') {
                                    //添加一个管理员到master列表(自己)
                                    myContract.methods
                                        .addRole('master', data.master)
                                        .send({ from: data.master, gas: 200000000000 })
                                        .on('transactionHash', (hash) => {
                                            console.log('//添加一个管理员到master列表(自己)', hash);
                                        });
                                } else {
                                    // 也是因为大小写问题
                                    if (data.master.toUpperCase() !== result[result.length - 1].toUpperCase()) {
                                        //添加一个管理员到master列表(自己)
                                        myContract.methods
                                            .addRole('master', data.master)
                                            .send({ from: data.master, gas: 200000000000 })
                                            .on('transactionHash', (hash) => {
                                                console.log('//添加一个管理员到master列表(自己)', hash);
                                            });
                                    } else {
                                        console.log('相等');
                                    }
                                }
                            });
                            // }, 1000);

                            // 获取所有现有员工的地址
                            myContract.methods.getRole('common').call((error, result) => {
                                if (!error) {
                                    console.log('员工', result);
                                    var addrs = JSON.stringify(result);
                                    localStorage.setItem('addrs', addrs);
                                }
                            });
                            this.$router.push('/');
                        }
                    });
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //跳转到注册页
        register() {
            this.$router.push('/register');
        }
    }
};
</script>

<style scoped>
.login-wrap {
    /* position: relative; */
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/login-bg.jpg);
    background-size: cover;
}
.ms-title {
    width: 100%;
    line-height: 100px;
    text-align: center;
    font-size: 40px;
    color: #fff;
    border-bottom: 1px solid #ddd;
    font-family: 'Times New Roman', Times, serif;
}
.super-login {
    font-family: 'Times New Roman', Times, serif;
    text-align: center;
    font-size: 30px;
    color: #fff;
    padding-top: 20px;
}
.ms-login {
    justify-content: space-evenly;
    flex-direction: column;
    position: absolute;
    top: 18vh;
    right: 10vw;
    width: 50vh;
    height: 55vh;
    padding: 2vh 8vh;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    overflow: hidden;
    background-size: 50vh 55vh;
    transition: all 0.1s;
}
.ms-content {
    padding: 30px 30px;
    margin-top: 20px;
}
.form-group {
    justify-content: space-between;
}

.btn {
    text-align: center;
    justify-content: space-between;
}

.login {
    width: 45%;
    margin-top: 30px;
    margin-left: 10px;
    float: left;
    height: 5vh;
    font-size: 20px;
    font-family: Times, serif;
}
.register {
    width: 45%;
    margin-top: 30px;
    margin-right: 10px;
    float: right;
    height: 5vh;
    font-size: 20px;
    font-family: Times, serif;
}
</style>
