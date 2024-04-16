<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 出库申请 </el-breadcrumb-item>
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

            <el-table :data="showTableOut" border class="table">
                <el-table-column align="center" prop="iid" label="资产 ID" width="95"></el-table-column>
                <el-table-column align="center" prop="name" label="资产名称" width="125"></el-table-column>
                <el-table-column align="center" prop="assetsType" label="资产类型" width="155"></el-table-column>
                <el-table-column align="center" prop="personal" label="申请人账号"></el-table-column>
                <el-table-column align="center" prop="timeStamp" label="申请时间" width="200"></el-table-column>
                <el-table-column align="center" prop="tips" label="备注" width="155"></el-table-column>
                <el-table-column align="center" prop="state" label="状态" width="155"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            style="font-size: 20px"
                            icon="el-icon-edit"
                            @click="handleEditOut(scope.$index, scope.row)"
                            :disabled="scope.row.state != '审批中'"
                            >同意</el-button
                        >
                        <el-button
                            type="text"
                            style="font-size: 20px"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)"
                            :disabled="scope.row.state != '审批中'"
                            >拒绝</el-button
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
    data() {
        return {
            query: {
                address: '',
                ioType: '',
                iid: '',
                assetsType: '',
                personal: '', //申请人账号
                person: '', //审批人账号
                timeStamp: '',
                time: '',
                tips: ''
            },
            tableDataOut: [],
            showTableOut: [], // 搜索筛选之后的产品列表
            inputVal: '',
            options: [
                {
                    value: '审批中',
                    label: '审批中'
                },
                {
                    value: '审批成功',
                    label: '审批成功'
                },
                {
                    value: '审批拒绝',
                    label: '审批拒绝'
                }
            ]
        };
    },
    created() {
        this.getData();
        setTimeout(() => {
            this.approving();
        }, 1000); //表示等一个个函数初始化完成后才能加载第二个函数
        setTimeout(() => {
            this.approve();
        }, 1000);
        setTimeout(() => {
            this.disApprove();
        }, 1000);
    },
    methods: {
        // 获取数据
        async getData() {
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);

            myContract.methods.getRole('common').call(null, (error, result) => {
                // console.log(result)
                result.map((x) => {
                    // console.log(x)
                    myContract.methods.getApprovalPool(x).call((err, res) => {
                        // console.log(err)
                        console.log('11111111111', res);
                        res.map((y) => {
                            var json = {
                                ioType: y.ioType,
                                iid: y.id,
                                name: y.name,
                                assetsType: y.assetsType,
                                personal: y.personal,
                                timeStamp: new Date(parseInt(y.timeStamp) * 1000).toLocaleString(),
                                tips: y.tips
                            };
                            if (y.ioType == 2) {
                                if (y.state == 0) {
                                    json.state = '审批中';
                                } else if (y.state == -1) {
                                    json.state = '审批拒绝';
                                } else {
                                    json.state = '审批成功';
                                }
                                this.tableDataOut.unshift(json);
                            }
                        });
                    });
                });
                this.showTableOut = this.tableDataOut; //初始化showTable[]
            });
        },

        // // 触发搜索按钮
        handleSearch() {
            const Search_List = [];
            const res = this.inputVal.replace(/\s/gi, '');
            console.log(res);
            let searchArr = this.tableDataOut;
            searchArr.forEach((e) => {
                let state = e.state;
                if (state.includes(res) && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            this.showTableOut = Search_List;
        },

        // 管理员对一条出库申请进行同意
        handleEditOut(index, row) {
            console.log('gggggg', index);
            //  function agreeApplicationOut(address _common,uint256 _id,int256 state) OnlyMaster {
            var common = row.personal;
            var ioType = 2;
            var id = row.iid;
            var state = 1;
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            myContract.methods
                .agreeApplicationOut(common, ioType, id, state)
                // .agreeApplication(common, '0', id, state)
                .send({ from: localStorage.getItem('master'), gas: 200000000000 })
                .on('transactionHash', (hash) => {
                    this.tableDataOut.splice(index, 1);
                    this.$message.success('同意申请');
                    location.reload(); //刷新页面

                    var txType = '管理员出库审批同意';
                    var userName = localStorage.getItem('ms_username'); //审批人用户名
                    var person = localStorage.getItem('master'); //审批人账号
                    var timeStamp = new Date().toLocaleString();
                    var url =
                        'http://127.0.0.1:8081/addTrace?txType=' +
                        txType +
                        '&txHash=' +
                        hash +
                        '&uintID=' +
                        id +
                        '&assetsName=' +
                        row.name +
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
        },

        //管理员拒绝一条申请
        handleDelete(index, row) {
            var address = row.personal;
            var ioType = 2;
            var id = row.iid;
            var state = -1;
            // var myContract=this.$getlogin()
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);

            myContract.methods
                .agreeApplicationOut(address, ioType, id, state)
                .send({ from: localStorage.getItem('master'), gas: 200000000000 })
                .on('transactionHash', (hash) => {
                    this.tableDataOut.splice(index, 1);
                    this.$message.success('拒绝申请');
                    location.reload(); //刷新页面

                    var txType = '管理员出库审批拒绝';
                    var userName = localStorage.getItem('ms_username'); //审批人用户名
                    var person = localStorage.getItem('master'); //审批人账号
                    var timeStamp = new Date().toLocaleString();
                    var url =
                        'http://127.0.0.1:8081/addTrace?txType=' +
                        txType +
                        '&txHash=' +
                        hash +
                        '&uintID=' +
                        id +
                        '&assetsName=' +
                        row.name +
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
        },

        //将获得的出库审批中的数量放入数据库
        approving() {
            const Search_List = [];
            let searchArr = this.tableDataOut;
            searchArr.forEach((e) => {
                let state = e.state;
                if (state.includes('审批中') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            localStorage.setItem('Out_appriving', Search_List.length);
        },

        //将获得的出库审批成功的数量放入数据库
        approve() {
            const Search_List = [];
            let searchArr = this.tableDataOut;
            searchArr.forEach((e) => {
                let state = e.state;
                if (state.includes('审批成功') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            localStorage.setItem('Out_apprive', Search_List.length);
        },
        //将获得的出库审批拒绝的数量放入数据库
        disApprove() {
            const Search_List = [];
            let searchArr = this.tableDataOut;
            searchArr.forEach((e) => {
                let state = e.state;
                if (state.includes('审批拒绝') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            localStorage.setItem('Out_disapprive', Search_List.length);
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
