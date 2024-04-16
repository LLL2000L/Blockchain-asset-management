<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">区块链资产管理平台</div>
            <h1 class="super-login">普通用户 登录</h1>
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
                    <el-button type="primary" plain @click="commonCheck()" class="check">查看审核结果</el-button>
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
                    var url = 'http://127.0.0.1:8081/commonLogin?name=' + this.param.username + '&password=' + this.param.password;
                    this.$axios.get(url).then((res) => {
                        var data = res.data;
                        if (data.code == 201) {
                            this.$message.error('账号密码错误，请重新输入！');
                        } else {
                            this.$message.success('登录成功');
                            localStorage.setItem('ms_username', this.param.username);
                            // localStorage.setItem('password', this.param.password);
                            localStorage.setItem('jwt', data.jwt);
                            localStorage.setItem('self', data.self);
                            console.log(localStorage.getItem('jwt'));

                            // 公司地址
                            localStorage.setItem('company', data.company);

                            // 公司 abi
                            localStorage.setItem('companyAbi', JSON.stringify(data.companyAbi));
                            localStorage.setItem('provider', data.provider);
                            // 员工地址
                            localStorage.setItem('common', data.common);

                            // 注入合约对象
                            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                            var abi = JSON.parse(localStorage.getItem('companyAbi'));
                            var contractAddress = localStorage.getItem('group');
                            var $myContract = new web3.eth.Contract(abi, contractAddress);
                            // localStorage.setItem('myContract', JSON.stringify(myContract))
                            this.$loginsave($myContract);
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

        commonCheck() {
            //返回主管审核结果
            window.account.then((address) => {
                // console.log(address);地址都是小写，因此无需统一改格式
                var URL = 'http://127.0.0.1:8081/commonCheck?';
                this.$axios.get(URL).then((res) => {
                    console.log(res.data);
                    if (res.data == '') {
                        this.$message.error('审核失败，请联系管理员！');
                    }
                    for (var i = 0; i < res.data.length; i++) {
                        if (address === res.data[i].address) {
                            this.$message.success('审核成功');
                            return false; //表示break
                        }
                    }
                    for (var i = 0; i < res.data.length; i++) {
                        if (address !== res.data[i].address) {
                            this.$message.error('审核失败，请联系资产主管！');
                            return false; //表示break
                        }
                    }
                });
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
    margin-top: 8px;
}
.form-group {
    justify-content: space-between;
}

.btn {
    text-align: center;
    justify-content: space-between;
}
.check {
    margin-top: 15px;
    width: 45%;
    height: 5vh;
    font-size: 20px;
    font-family: Times, serif;
}
.login {
    width: 45%;
    margin-top: 15px;
    margin-left: 10px;
    float: left;
    height: 5vh;
    font-size: 20px;
    font-family: Times, serif;
}
.register {
    width: 45%;
    margin-top: 15px;
    margin-right: 10px;
    float: right;
    height: 5vh;
    font-size: 20px;
    font-family: Times, serif;
}
</style>
