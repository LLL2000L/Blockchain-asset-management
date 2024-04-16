<template>
    <div>
        <!-- //弹出表单 -->
        <el-dialog title="盘点结果表单" :visible.sync="dialogFormVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="发起人">
                    <el-input v-model="form.address" disabled></el-input>
                </el-form-item>
                <el-form-item label="资产 ID">
                    <el-input v-model="form.assetsID" disabled></el-input>
                </el-form-item>
                <el-form-item label="盘点数量">
                    <el-input v-model="form.count"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 任务消息 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-input
                v-model="inputVal"
                placeholder="请输入查询状态"
                class="handle-input mr10"
                clearable
                @clear="handleSearch(inputVal)"
            ></el-input>
            <el-select v-model="inputVal" placeholder="请选择" class="handle-input1 mr10">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button>

            <el-table :data="showTable" border class="table">
                <!-- <el-table-column align="center" prop="uintID" label="任务 ID" width="95"></el-table-column> -->
                <el-table-column align="center" prop="assetsID" label="资产ID" width="95"></el-table-column>
                <el-table-column align="center" prop="taskName" label="任务名称"></el-table-column>
                <el-table-column align="center" prop="assetsName" label="资产名称" width="125"></el-table-column>
                <!-- <el-table-column align="center" prop="assetsType" label="资产类型"></el-table-column> -->
                <el-table-column align="center" prop="from" label="发起人"></el-table-column>
                <el-table-column align="center" prop="timeStart" label="盘点任务开始时间"></el-table-column>
                <el-table-column align="center" prop="timeEnd" label="盘点任务结束时间"></el-table-column>
                <el-table-column align="center" prop="tips" label="备注"></el-table-column>
                <el-table-column align="center" prop="state" label="状态" width="125"></el-table-column>

                <el-table-column label="操作" width="170" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            @click="dialogForm(scope.$index, scope.row)"
                            :disabled="scope.row.state != '未盘点'"
                            size="medium"
                            style="float: right"
                            >上报盘点结果</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'basetable',

    props: ['Data'],

    data() {
        return {
            dialogFormVisible: false,
            tableData: [],
            form: {
                address: '',
                assetsID: '',
                count: ''
            },
            assetsType: '',
            showTable: [], // 搜索筛选之后的产品列表
            inputVal: '',
            options: [
                {
                    value: '未盘点',
                    label: '未盘点'
                },
                {
                    value: '已盘点',
                    label: '已盘点'
                }
            ],

            traceTable: [] //获取表格数据的数组(根据资产ID溯源)
        };
    },
    created() {
        this.getData();
        setTimeout(() => {
            this.noCheck();
        }, 1000); //表示等一个个函数初始化完成后才能加载第二个函数
    },
    methods: {
        // 获取数据
        getData() {
            // var myContract = JSON.parse(localStorage.getItem('myContract'))
            // var myContract=this.$getlogin()
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            console.log(localStorage.getItem('common'));

            myContract.methods.getRole('master').call(null, (eerr, rres) => {
                rres.map((addr) => {
                    myContract.methods
                        .getTask(addr)
                        .call({ from: localStorage.getItem('common'), gas: 2000000000000000000 }, (error, result) => {
                            if (!error) {
                                console.log(result);
                                result.map((x) => {
                                    // struct AssetsTask {
                                    //   uint id;
                                    //   string taskName;
                                    //   string assetsName;
                                    //   string assetsType;
                                    //   address from;
                                    //   address to;
                                    //   // 盘点任务起始时间
                                    //   string timeStartEnd;
                                    //   // 盘点状态 false:未盘点 true:已盘点
                                    //   bool state;
                                    //   // 备注
                                    //   string tips;
                                    // }
                                    console.log(x.to);
                                    console.log(localStorage.getItem('common'));
                                    console.log(web3.utils.hexToNumberString(x.to) === localStorage.getItem('common').toString());
                                    console.log(x.to === localStorage.getItem('common'));
                                    console.log(typeof x.to);
                                    console.log(typeof localStorage.getItem('common'));
                                    // 居然是因为大小写问题
                                    if (x.to.toUpperCase() == localStorage.getItem('common').toUpperCase()) {
                                        var json = {
                                            // uintID: x.id,
                                            taskName: x.taskName,
                                            assetsName: x.assetsName,
                                            assetsID: x.id,
                                            assetsType: x.assetsType,
                                            from: x.from,
                                            timeStart: x.timeStart,
                                            timeEnd: x.timeEnd,
                                            tips: x.tips
                                            // state: x.state
                                        };
                                        this.assetsType = json.assetsType;
                                        if (x.state == false) {
                                            json.state = '未盘点';
                                        }
                                        if (x.state == true) json.state = '已盘点';
                                        this.tableData.unshift(json);
                                    }
                                });
                            } else {
                                console.log(error);
                            }
                        });
                });
                this.showTable = this.tableData; //初始化showTable[]
            });
        },

        //获得未盘点数量
        noCheck() {
            const Search_List = [];
            let searchArr = this.tableData;
            searchArr.forEach((e) => {
                let state = e.state;
                if (state.includes('未盘点') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            localStorage.setItem('noTask', Search_List.length);
        },

        //提交盘点结果的按钮,自动获取地址和ID
        dialogForm(index, row) {
            this.dialogFormVisible = true;
            this.form.address = row.from;
            this.form.assetsID = row.assetsID;

            this.traceTable = [row.assetsID, row.assetsName, row.tips];
            // console.log('row.uintID', traceTable[0]);
            // console.log('row.assetsName', traceTable[1]);
        },

        onSubmit() {
            // function submitAssetsTaskResult(address _master, uint _id, uint _count) OnlyCommon {
            var address = this.form.address;
            var assetsID = this.form.assetsID;
            var count = this.form.count;
            // var myContract = JSON.parse(localStorage.getItem('myContract'))
            // var myContract=this.$getlogin()
            if (count !== '') {
                console.log(555555555555555555555555555555555555555555555555555555555);
                var contractAddress = localStorage.getItem('company');
                var abi = JSON.parse(localStorage.getItem('companyAbi'));
                let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                var myContract = new web3.eth.Contract(abi, contractAddress);
                console.log(myContract);
                console.log(555555555555555555555555555555555555555555555555555555555);
                myContract.methods
                    .submitAssetsTaskResult(address, assetsID, count)
                    .send({ from: localStorage.getItem('common'), gas: 20000000 })
                    .on('transactionHash', (hash) => {
                        this.$message.success('提交成功！');
                        console.log(hash);
                        location.reload(); //刷新页面

                        // this.traceTable = [row.uintID, row.assetsName, row.assetsType, row.tips];
                        // console.log('row.uintID', this.traceTable[0]);
                        //将溯源数据放入数据库MySQL
                        var txType = '员工上报盘点结果';
                        var userName = localStorage.getItem('ms_username'); //用户名
                        var person = localStorage.getItem('common');
                        var timeStamp = new Date().toLocaleString();
                        var url =
                            'http://127.0.0.1:8081/addTrace?txType=' +
                            txType +
                            '&txHash=' +
                            hash +
                            '&uintID=' +
                            this.traceTable[0] +
                            '&assetsName=' +
                            this.traceTable[1] +
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
                this.$message.error('提交失败！请输入完整信息');
            }
        },
        // 触发搜索按钮
        handleSearch() {
            const Search_List = [];
            const res = this.inputVal.replace(/\s/gi, '');
            console.log(res);
            let searchArr = this.tableData;
            searchArr.forEach((e) => {
                let state = e.state;
                if (state.includes(res) && Search_List.indexOf(e)) {
                    Search_List.push(e);
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
    width: 300px;
    display: inline-block;
    padding-bottom: 20px;
    padding-right: 10px;
}
.handle-input1 {
    width: 100px;
    display: inline-block;
    padding-bottom: 20px;
    padding-right: 10px;
}
.table {
    width: 100%;
    font-size: 20px;
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
