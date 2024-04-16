<template>
    <div>
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
                style="width: 500px"
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
                        <el-button type="primary" icon="el-icon-edit" @click="dialogForm(scope.$index, scope.row)" size="medium"
                            >发起调拨</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <!-- //弹出表单 -->
        <el-dialog title="发起调拨表单" :visible.sync="dialogFormVisible" width="30%">
            <el-form ref="form" :model="targetForm" label-width="80px">
                <el-form-item label="公司地址">
                    <el-input v-model="targetForm.target" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户地址">
                    <el-input v-model="targetForm.common" disabled></el-input>
                </el-form-item>
                <el-form-item label="资产 ID">
                    <el-input v-model="targetForm.uintID"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmitSend">确 定</el-button>
            </span>
        </el-dialog>

        <!-- //弹出存放资产表单 -->
        <el-dialog title="存放资产单" :visible.sync="dialogSave" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="公司地址">
                    <el-input v-model="form.target" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户地址">
                    <el-select v-model="form.common" placeholder="将资产放入到该用户的仓库中" style="width: 100%">
                        <el-option v-for="item in commons" :key="item" :value="item"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资产 ID">
                    <el-input v-model="form.uintID"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <div class="three">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <h3>
                        <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 接收调拨过来的资产列表 </el-breadcrumb-item>
                    </h3>
                </el-breadcrumb>
            </div>
            <div class="container">
                <el-table :data="tableData_one" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                    <el-table-column align="center" prop="target" label="发送方公司"></el-table-column>
                    <el-table-column align="center" prop="uintID" label="ID" width="125"></el-table-column>
                    <el-table-column align="center" prop="name" label="资产名称" width="210"></el-table-column>
                    <el-table-column align="center" prop="assetsType" label="资产类型" width="210"></el-table-column>
                    <!-- <el-table-column align="center" prop="tips" label="备注"></el-table-column> -->
                    <el-table-column align="center" prop="timeStamp" label="调拨时间" width="210"></el-table-column>

                    <el-table-column label="操作" width="190" align="center">
                        <template slot-scope="scope">
                            <el-button type="primary" icon="el-icon-edit" @click="dialogFormSave(scope.$index, scope.row)" size="medium"
                                >存放资产</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            dialogFormVisible: false,
            dialogSave: false,
            commons: [], //员工列表

            form: {
                common: '',
                uintID: '',
                target: localStorage.getItem('company')
            },
            tableData_one: [],

            targetForm: {},
            tableData: [], //发起调拨列表
            showTable: [], // 搜索筛选之后的产品列表
            inputVal: '', //输入查询的资产ID号 / 名称 / 资产类型
            Val: '' //输入要查询仓库的员工地址
        };
    },
    created() {
        // 获取暂存池子内容
        // var myContract=this.$getlogin()
        console.log(555555555555555555555555555555555555555555555555555555555);
        var contractAddress = localStorage.getItem('company');
        var abi = JSON.parse(localStorage.getItem('companyAbi'));
        let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
        var myContract = new web3.eth.Contract(abi, contractAddress);
        console.log(myContract);
        console.log(555555555555555555555555555555555555555555555555555555555);

        myContract.methods.getSender().call((error, result) => {
            console.log(result);
            result.map((x) => {
                myContract.methods.getTmpStore(x).call((err, res) => {
                    console.log(err);
                    console.log(res);
                    res.map((y) => {
                        var json = {
                            target: x,
                            uintID: y.id,
                            name: y.name,
                            assetsType: y.assetsType,
                            // tips: y.tips,
                            timeStamp: new Date(parseInt(y.timeStamp) * 1000).toLocaleString()
                        };
                        if (y.id != 0) this.tableData_one.push(json);
                    });
                });
            });
        });
        // 获取员工列表;
        myContract.methods.getRole('common').call(null, (error, result) => {
            console.log('组合地址', result);
            this.commons = result;
        });
    },
    methods: {
        // 将资产存放到员工仓库
        onSubmit() {
            // 发送一条资产到特定公司 (从哪个员工的仓库进行调拨, 根据资产id来选择资产, 发送到哪个公司)
            // function sendAssets(address _common, uint _id, address target) {
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            // var myContract= this.$getlogin()
            var common = this.form.common;
            var id = this.form.uintID;
            var target = this.form.target;
            if (target !== '' && common !== '' && id !== '') {
                myContract.methods
                    .sendAssetsToCommon(target, id, common)
                    .send({ from: localStorage.getItem('master'), gas: 200000000000 })
                    .on('transactionHash', (hash) => {
                        console.log(hash);
                        localStorage.setItem('txHash_from', hash);
                        this.$message.success('存放成功');
                        location.reload(); //刷新页面

                        var txType = '将接收调拨的资产放入用户仓库';
                        var txHash = localStorage.getItem('txHash_from');
                        var userName = localStorage.getItem('ms_username'); //审批人用户名
                        var person = localStorage.getItem('master'); //审批人账号
                        var timeStamp = new Date().toLocaleString();
                        var url =
                            'http://127.0.0.1:8081/addTrace?txType=' +
                            txType +
                            '&txHash=' +
                            txHash +
                            '&uintID=' +
                            id +
                            '&assetsName=' +
                            '' +
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
                this.$message.error('请完整填写信息！');
            }
        },
        // 将资产调拨出去
        onSubmitSend() {
            var target = this.targetForm.target;
            var common = this.targetForm.common;
            var id = this.targetForm.uintID;
            if (target !== '' && common !== '' && id !== '') {
                console.log(555555555555555555555555555555555555555555555555555555555);
                var contractAddress = localStorage.getItem('company');
                var abi = JSON.parse(localStorage.getItem('companyAbi'));
                let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                var myContract = new web3.eth.Contract(abi, contractAddress);
                console.log(myContract);
                console.log(555555555555555555555555555555555555555555555555555555555);

                myContract.methods.getMsg(common, id, target).call((err, res) => {
                    // console.log(res[0]);
                    // console.log(res[1]);
                    myContract.methods
                        .delCommonStore(common, res[0])
                        .send({ from: localStorage.getItem('master'), gas: 200000000 })
                        .on('transactionHash', (hash) => {
                            console.log(hash);
                            // 构造接收数据的公司的对象
                            console.log(555555555555555555555555555555555555555555555555555555555);
                            var AcontractAddress = target; //接收公司的地址
                            var abi = JSON.parse(localStorage.getItem('companyAbi'));
                            // let Aweb3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                            var AmyContract = new web3.eth.Contract(abi, AcontractAddress);
                            console.log(AmyContract);
                            console.log(555555555555555555555555555555555555555555555555555555555);
                            // 调用其他公司的接收接口
                            AmyContract.methods
                                .receiveAssets(id, res[1].name, res[1].assetsType, res[1].tips, localStorage.getItem('company'))
                                .send({ from: localStorage.getItem('master'), gas: 2000000000000 })
                                .on('transactionHash', (hhash) => {
                                    console.log(hhash);
                                    this.$message.success('调拨成功');
                                    location.reload(); //刷新页面

                                    var txType = '发起资产调拨';
                                    var userName = localStorage.getItem('ms_username'); //审批人用户名
                                    var person = localStorage.getItem('master'); //审批人账号
                                    var timeStamp = new Date().toLocaleString();
                                    var url =
                                        'http://127.0.0.1:8081/addTrace?txType=' +
                                        txType +
                                        '&txHash=' +
                                        hhash +
                                        '&uintID=' +
                                        id +
                                        '&assetsName=' +
                                        res[1].name +
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
                        });
                });
            } else {
                this.$message.error('请完整填写信息！');
            }
        },

        //获取用户仓库tableData
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
        },

        //发起调拨的按钮,自动获取信息
        dialogForm(index, row) {
            this.dialogFormVisible = true;
            this.targetForm.target = localStorage.getItem('company');
            this.targetForm.common = this.Val;
            this.targetForm.uintID = row.uintID;
        },

        //发起调拨的按钮,自动获取信息
        dialogFormSave(index, row) {
            this.dialogSave = true;
            this.form.target = localStorage.getItem('company');
            this.form.uintID = row.uintID;
        }
    }
};
</script>

<style scoped>
.add_one {
    width: 200px;
    display: inline-block;
    margin-bottom: 20px;
    margin-right: 20px;
}
.add_two {
    width: 200px;
    display: inline-block;
}
.one {
    float: left;
    width: 49%;
    margin-bottom: 20px;
}
.two {
    float: right;
    width: 49%;
    margin-bottom: 20px;
}
.table {
    width: 100%;
    font-size: 20px;
}
</style>
