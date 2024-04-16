<template>
    <div class="register-wrap">
        <div class="ms-register">
            <div class="ms-title">区块链资产管理平台</div>
            <h1 class="super-register">普通用户 注册</h1>
            <el-form :model="param" :rules="rules" ref="register" label-width="0px" class="ms-content" name="myform">
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

                <!-- <el-select v-model="param.value" id="inputPassword4" placeholder="请选择角色" size="max">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select> -->

                <el-form-item class="btn">
                    <el-button type="primary" @click="login_common" class="login">登录</el-button>
                    <el-button @click="submitForm()" class="register">注册</el-button>
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
                // value: ''
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
            this.$refs.register.validate((valid) => {
                if (valid) {
                    window.account
                        .then((address) => {
                            //首先先从后台获取数据库中已经存在的账号
                            var URL = 'http://127.0.0.1:8081/commonRegister?';
                            this.$axios.get(URL).then((res) => {
                                console.log(res.data);
                                for (var i = 0; i < res.data.length; i++) {
                                    if (address === res.data[i].address) {
                                        this.$message.error('该账户已存在，请重新在metamask连接新账户');
                                        return false;
                                        // console.log('相等');
                                    }
                                    // else {
                                    //     console.log('不相等');
                                    // }

                                    // console.log(typeof res.data[i]); //数据类型为object
                                    console.log(address);
                                    // console.log(typeof address); //数据类型为string
                                    // console.log(res.data[i].address);
                                    // console.log(typeof res.data[i].address); //数据类型为string
                                }
                                if (!false) {
                                    var url =
                                        'http://127.0.0.1:8081/commonRegister?name=' +
                                        this.param.username +
                                        '&password=' +
                                        this.param.password +
                                        '&address=' +
                                        address;

                                    this.$axios.get(url).then((res) => {
                                        console.log(res.data);
                                    }); //不能删，这样数据添加的新数据才可以获取到

                                    this.$message.success('注册成功，等待审核');
                                    this.$router.replace('/commonLogin');
                                }
                            });
                        })
                        .catch((err, res) => {
                            this.$message.error('请连接Metamask!');
                        });
                } else {
                    this.$message.error('请输入账号和密码');
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        //跳转到登录页
        login_common() {
            this.$router.push('/commonLogin');
        }
    }
};
</script>

<style scoped>
.register-wrap {
    /* position: relative; */
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/register.jpg);
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
.super-register {
    font-family: 'Times New Roman', Times, serif;
    text-align: center;
    font-size: 30px;
    color: #fff;
    padding-top: 20px;
}
.ms-register {
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
