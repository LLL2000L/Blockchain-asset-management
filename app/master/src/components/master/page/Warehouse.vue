<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 添加盘点任务 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="任务名称">
                        <el-input v-model="form.taskName"></el-input>
                    </el-form-item>
                    <el-form-item label="资产名称">
                        <el-input v-model="form.assetsName"></el-input>
                    </el-form-item>
                    <el-form-item label="资产ID">
                        <el-input v-model="form.assetsID"></el-input>
                    </el-form-item>
                    <el-form-item label="资产类型">
                        <el-select v-model="form.assetsType" placeholder="请选择" style="width: 100%">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="盘点用户">
                        <!-- <el-input v-model="form._to" placeholder="请正确填写盘点员工以太坊账号地址"></el-input> -->
                        <el-select v-model="form._to" placeholder="请选择盘点用户以太坊账户地址" style="width: 100%">
                            <el-option v-for="item in commons" :key="item" :value="item"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="处理时间">
                        <div class="block">
                            <el-date-picker
                                v-model="form.timeStartEnd"
                                type="datetimerange"
                                align="right"
                                value-format="yyyy/MM/dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['12:00:00', '08:00:00']"
                                style="width: 100%"
                            >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="form.tips"></el-input>
                    </el-form-item>

                    <el-button type="primary" @click="onSubmit" size="medium" style="margin-left: 200px">确 定</el-button>
                    <el-button type="primary" size="medium" plain @click="cancelEdit">清 空</el-button>
                </el-form>
            </div>
        </div>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 资产列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-select v-model="Val" placeholder="请选择盘点员工以太坊账户地址" style="width: 500px">
                <el-option v-for="item in commons" :key="item" :value="item"> </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="getData(Val)">搜 索</el-button>
            <el-button type="primary" size="medium" plain @click="cancelTable">清 空</el-button>

            <el-input
                v-model="inputVal"
                placeholder="请输入查询的资产ID号 / 名称 / 资产类型"
                class="handle-input mr10"
                clearable
                @clear="handleSearch(inputVal)"
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch(inputVal)">搜 索</el-button>

            <el-table :data="showTable" border class="table">
                <el-table-column align="center" prop="uintID" label="资产 ID" width="95"></el-table-column>
                <el-table-column align="center" prop="assetsName" label="资产名称"></el-table-column>
                <el-table-column align="center" prop="assetsType" label="资产类型"></el-table-column>
                <el-table-column align="center" prop="timeStamp" label="资产入库时间"></el-table-column>
                <el-table-column align="center" prop="tips" label="备注"></el-table-column>

                <el-table-column label="操作" width="170" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="fill(scope.$index, scope.row)" size="medium">盘点</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            form: {
                taskName: '',
                assetsName: '',
                assetsID: '',
                assetsType: '',
                _to: '',
                timeStartEnd: '',
                tips: ''
            },
            options: [
                {
                    value: '版权类资产',
                    label: '版权类资产'
                },
                {
                    value: '股权类资产',
                    label: '股权类资产'
                },
                {
                    value: '证券化资产',
                    label: '证券化资产'
                },
                {
                    value: '专利资产',
                    label: '专利资产'
                },
                {
                    value: '其他资产',
                    label: '其他资产'
                }
            ],
            commons: [], //员工列表

            tableData: [],
            showTable: [], // 搜索筛选之后的产品列表
            inputVal: '', //输入查询的资产ID号 / 名称 / 资产类型
            Val: '' //输入要查询仓库的员工地址
        };
    },
    created() {
        console.log(555555555555555555555555555555555555555555555555555555555);
        var contractAddress = localStorage.getItem('company');
        var abi = JSON.parse(localStorage.getItem('companyAbi'));
        let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
        var myContract = new web3.eth.Contract(abi, contractAddress);
        console.log(myContract);
        console.log(555555555555555555555555555555555555555555555555555555555);

        //获取员工列表
        myContract.methods.getRole('common').call(null, (error, result) => {
            console.log('组合地址', result);
            this.commons = result;
        });
    },
    methods: {
        onSubmit() {
            // <!--      function addAssetsTask(-->
            // <!--      string _taskName,-->
            // <!--      string _assetsName,-->
            //           uint256 Uid;//资产ID
            // <!--      string _assetsType,-->
            // <!--      address _to,-->
            // <!--      string _timeStart,-->
            // <!--      string _timeEnd,-->
            // <!--      string _tips-->
            // <!--      ) OnlyMaster {-->

            var taskName = this.form.taskName;
            var assetsName = this.form.assetsName;
            var assetsID = this.form.assetsID;
            var assetsType = this.form.assetsType;
            var to = this.form._to;
            var timeStart = this.form.timeStartEnd[0];
            var timeEnd = this.form.timeStartEnd[1];
            var tips = this.form.tips;

            if (
                taskName !== '' &&
                assetsName !== '' &&
                assetsID !== '' &&
                assetsType !== '' &&
                to !== '' &&
                timeStart !== '' &&
                timeEnd !== '' &&
                tips !== ''
            ) {
                // var myContract=this.$getlogin()
                console.log(555555555555555555555555555555555555555555555555555555555);
                var contractAddress = localStorage.getItem('company');
                var abi = JSON.parse(localStorage.getItem('companyAbi'));
                let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                var myContract = new web3.eth.Contract(abi, contractAddress);
                console.log(myContract);
                console.log(555555555555555555555555555555555555555555555555555555555);
                myContract.methods
                    .addAssetsTask(taskName, assetsName, assetsID, assetsType, to, timeStart, timeEnd, tips)
                    .send({ from: localStorage.getItem('master'), gas: 200000000 })
                    .on('transactionHash', (hash) => {
                        console.log(hash);
                        this.$message.success('操作成功');
                        location.reload(); //刷新页面

                        //加入数据到溯源中
                        var txType = '管理员下发盘点任务';
                        var txHash = hash;
                        var uintID = this.form.assetsID;
                        var assetsName = this.form.assetsName;
                        var userName = localStorage.getItem('ms_username'); //审批人用户名
                        var person = localStorage.getItem('master'); //审批人账号
                        var timeStamp = new Date().toLocaleString();
                        var url =
                            'http://127.0.0.1:8081/addTrace?txType=' +
                            txType +
                            '&txHash=' +
                            txHash +
                            '&uintID=' +
                            uintID +
                            '&assetsName=' +
                            assetsName +
                            '&userName=' +
                            userName +
                            '&person=' +
                            person +
                            '&timeStamp=' +
                            timeStamp;
                        this.$axios.get(url).then((res) => {
                            console.log('res', res);
                        });
                    });
            } else {
                this.$message.error('请完整填写信息');
            }
        },
        //一键清空表单
        cancelEdit() {
            // this.$refs.form.resetFields(); // 清空表单
            this.form = {};
        },
        getData() {
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            // 管理员查看某个员工的仓库
            myContract.methods.getStore(this.Val).call({ from: this.Val }, (error, result) => {
                console.log('gggggg', result);
                if (result.length == 0) {
                    this.$message.error('该用户仓库没有资产');
                    this.showTable = result;
                } else if (result.length !== 0 && !error) {
                    result.map((x) => {
                        // console.log(x);
                        var json = {
                            uintID: x.id,
                            assetsName: x.name,
                            assetsType: x.assetsType,
                            timeStamp: new Date(parseInt(x.timeStamp) * 1000).toLocaleString(),
                            tips: x.tips
                        };
                        if (x.id != 0) this.tableData.push(json);
                    });
                    this.showTable = this.tableData;
                }
            });
        },

        fill(index, row) {
            this.form.assetsName = row.assetsName;
            this.form.assetsID = row.uintID;
            this.form.assetsType = row.assetsType;
            this.form._to = this.Val;
            this.form.tips = row.tips;
        },
        //一键清空表格
        cancelTable() {
            // this.$refs.form.resetFields(); // 清空表单
            this.tableData = [];
            this.showTable = [];
        },

        // 触发搜索按钮
        handleSearch() {
            const Search_List = [];
            const res = this.inputVal.replace(/\s/gi, '');
            // console.log(res);
            let searchArr = this.tableData;
            searchArr.forEach((e) => {
                let uintID = e.uintID;
                let assetsName = e.assetsName;
                let assetsType = e.assetsType;
                if (uintID.includes(res) || assetsName.includes(res) || assetsType.includes(res)) {
                    if (Search_List.indexOf(e)) {
                        Search_List.push(e);
                    }
                }
            });
            this.showTable = Search_List;
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 400px;
    display: inline-block;
    padding-bottom: 20px;
}

.table {
    width: 100%;
    font-size: 20px;
    /* font-family: 'Times New Roman', Times, serif; */
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
