<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-breadcrumb separator="/" style="margin: 10px 10px 10px 20px">
                    <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 个人中心 </el-breadcrumb-item>
                    <el-breadcrumb-item>信息卡片</el-breadcrumb-item>
                </el-breadcrumb>
                <el-card shadow="hover" class="mgb20" style="height: 330px; margin: 10px 10px 0px 20px">
                    <div class="user-info">
                        <img src="../../assets/img/img.jpg" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name">{{ name }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        公 司
                        <span>{{ company }}</span>
                    </div>
                    <div class="user-info-list">
                        自 己
                        <span>{{ self }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <div class="crumbs">
            <el-breadcrumb separator="/" style="margin: 10px 10px 10px 20px">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 个人中心 </el-breadcrumb-item>
                <el-breadcrumb-item>修改用户名和密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container" style="height: 230px; width: 44%; margin: 10px 10px 10px 20px">
            <div class="form-box">
                <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="用户名" prop="name">
                        <el-input v-model.number="ruleForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="pass">
                        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="checkPass">
                        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('用户名不能为空'));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.ruleForm.checkPass !== '') {
                    this.$refs.ruleForm.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            name: localStorage.getItem('ms_username'),
            company: localStorage.getItem('company'),
            self: localStorage.getItem('common'),

            ruleForm: {
                pass: '',
                checkPass: '',
                name: ''
            },
            rules: {
                pass: [{ validator: validatePass, trigger: 'blur' }],
                checkPass: [{ validator: validatePass2, trigger: 'blur' }],
                name: [{ validator: checkName, trigger: 'blur' }]
            }
        };
    },
    computed: {
        role() {
            return '角色：普通用户';
        }
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var jwt = localStorage.getItem('jwt');
                    var oldName = localStorage.getItem('ms_username');
                    var url =
                        'http://127.0.0.1:8081/commonUpdate?oldName=' +
                        oldName +
                        '&name=' +
                        this.ruleForm.name +
                        '&password=' +
                        this.ruleForm.pass +
                        '&jwt=' +
                        jwt;
                    this.$axios.get(url).then((res) => {
                        var data = res.data;
                        console.log('data', data);
                        console.log('data', res);
                        if (data.code == 201) {
                            alert('修改失败!');
                        } else {
                            this.$message.success('修改成功');
                            localStorage.setItem('ms_username', this.ruleForm.name);
                            location.reload(); //刷新页面
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avator {
    width: 150px;
    height: 150px;
    border-radius: 50%;
}

.user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 20px;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    color: rgb(74, 73, 73);
}

.user-info-cont div:first-child {
    font-size: 50px;
    color: rgb(50, 49, 49);
    line-height: 70px;
}

.user-info-list {
    font-size: 22px;
    color: rgb(69, 67, 67);
    line-height: 25px;
    word-spacing: 14px;
    margin-top: 15px;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.user-info-list span {
    margin-left: 30px;
}

.mgb20 {
    margin-bottom: 20px;
}
.demo-ruleForm {
    margin-top: 30px;
}
</style>

