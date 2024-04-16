<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 资产查询 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="inputVal" placeholder="请输入查询的资产ID号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" size="medium" plain @click="cancelEdit">清 空</el-button>
            </div>

            <el-table :data="tableData" border class="table" @sort-change="sort_change" ref="multipleTable">
                <!-- txType,txHash,uintID,assetsName,assetsType,tips,person,timeStamp -->
                <el-table-column align="center" prop="txType" label="交易类型" width="175"></el-table-column>
                <el-table-column align="center" prop="txHash" label="交易哈希" width="300"></el-table-column>
                <el-table-column align="center" prop="uintID" label="资产ID" width="95"></el-table-column>
                <el-table-column align="center" prop="assetsName" label="资产名称" width="125"></el-table-column>
                <el-table-column align="center" prop="userName" label="用户名" width="155"></el-table-column>
                <!-- <el-table-column align="center" prop="tips" label="资产备注"></el-table-column> -->
                <el-table-column align="center" prop="person" label="经手人账号"></el-table-column>
                <el-table-column align="center" prop="timeStamp" label="创建时间" width="200" sortable></el-table-column>

                <el-table-column label="操作" width="130" align="center">
                    <template slot-scope="scope">
                        <el-button @click="HashMessage(scope.$index, scope.row)" type="primary" style="margin-left: 16px">
                            点击查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 弹出的内容（交易哈希详细信息） -->
            <el-drawer title="交易信息" :visible.sync="drawer" :size="size">
                <span class="hhh">{{ hashMessage }}</span>
            </el-drawer>
        </div>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            tableData: [],
            // showTable: [], //通过ID搜索后展示表格的列表
            inputVal: '',

            drawer: false, //弹出框，显示哈希交易
            hashMessage: '',
            size: '800px'
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取数据
        getData() {},
        // 触发搜索按钮
        handleSearch() {
            // //获取到数据库对应的值
            if (this.inputVal !== '') {
                var URL = 'http://127.0.0.1:8081/getTrace?uintID=' + this.inputVal;
                this.$axios.get(URL).then((res) => {
                    console.log('res.data', res.data);
                    for (var i = 0; i < res.data.length; i++) {
                        // <!-- txType,txHash,uintID,assetsName,assetsType,tips,person,timeStamp -->
                        var json = {
                            txType: res.data[i].txType,
                            txHash: res.data[i].txHash,
                            uintID: res.data[i].uintID,
                            assetsName: res.data[i].assetsName,
                            userName: res.data[i].userName,
                            person: res.data[i].person,
                            timeStamp: res.data[i].timeStamp
                        };
                        this.tableData.push(json);
                        console.log('this.tableData', this.tableData);
                    }
                });
                // this.showTable = this.tableData; //展示在表格上
            } else {
                this.$message.error('查询失败！输入内容不能为空');
            }
        },
        //一键清空表单
        cancelEdit() {
            // this.$refs.form.resetFields(); // 清空表单
            this.tableData = [];
        },

        HashMessage(index, row) {
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);

            this.drawer = true; //点击按钮弹出
            //获取根据哈希交易哈希具体信息
            var transaction = web3.eth.getTransaction(row.txHash);
            console.log(transaction);
            transaction.then((res) => {
                console.log('hhhhhhh', res);
                this.hashMessage = res;
            });
        },

        sortFun: function (attr, rev) {
            //第一个参数传入info里的prop表示排的是哪一列，第二个参数是升还是降排序(时间排序)
            if (rev == undefined) {
                rev = 1;
            } else {
                rev = rev ? 1 : -1;
            }

            return function (a, b) {
                a = a[attr];
                b = b[attr];
                if (a < b) {
                    return rev * -1;
                }
                if (a > b) {
                    return rev * 1;
                }
                return 0;
            };
        },
        sort_change(column) {
            //(时间排序)
            if (column.prop === 'timeStamp') {
                this.tableData = this.tableData.sort(this.sortFun(column.prop, column.order === 'ascending'));
            }
        }

        // handleSearch() {
        //     var uintID = this.query.uintID;
        //     // var myContract = JSON.parse(localStorage.getItem('myContract'))
        //     // var myContract=this.$getlogin()
        //     console.log(555555555555555555555555555555555555555555555555555555555);
        //     var contractAddress = localStorage.getItem('company');
        //     var abi = JSON.parse(localStorage.getItem('companyAbi'));
        //     let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
        //     var myContract = new web3.eth.Contract(abi, contractAddress);
        //     console.log(myContract);
        //     console.log(555555555555555555555555555555555555555555555555555555555);
        //     myContract.methods.getOrigin(uintID).call((error, result) => {
        //         // struct Origin {
        //         //   string name;
        //         //   string assetsType;
        //         //   // 经手人
        //         //   address personal;
        //         //   uint timeStamp;
        //         //   // 备注
        //         //   string tips;
        //         //   // 资产操作的动作
        //         //   string action;
        //         // }
        //         result.map((x) => {
        //             var json = {
        //                 name: x.name,
        //                 assetsType: x.assetsType,
        //                 personal: x.personal,
        //                 timeStamp: x.timeStamp,
        //                 tips: x.tips
        //             };
        //             this.tableData.push(json);
        //         });
        //     });
        // }
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

.hhh {
    word-wrap: break-word;
    word-break: normal;
    line-height: 30px;
    font-size: 20px;
}
</style>
