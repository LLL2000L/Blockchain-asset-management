<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 资产仓库列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
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

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" @click="handleOut(scope.$index, scope.row)">出库申请</el-button>
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
            tableData: [],
            // assetsName: '',
            // uintID: '',
            // assetsType: '',
            showTable: [], // 搜索筛选之后的产品列表
            inputVal: ''
        };
    },
    created() {
        this.getData();
        setTimeout(() => {
            this.assetsType_one();
        }, 1000); //表示等一个个函数初始化完成后才能加载第二个函数
        setTimeout(() => {
            this.assetsType_two();
        }, 1000);
        setTimeout(() => {
            this.assetsType_three();
        }, 1000);
        setTimeout(() => {
            this.assetsType_four();
        }, 1000);
        setTimeout(() => {
            this.assetsType_five();
        }, 1000);
    },

    methods: {
        getData() {
            // 员工获取自己的仓库
            // var myContract = JSON.parse(localStorage.getItem('myContract'))
            // var myContract=this.$getlogin()
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            myContract.methods.getStore().call({ from: localStorage.getItem('common') }, (error, result) => {
                console.log('hhhhhhhhhhhhhhhhh', result);
                if (!error) {
                    result.map((x) => {
                        // console.log(x);
                        var json = {
                            uintID: x.id,
                            assetsName: x.name,
                            assetsType: x.assetsType,
                            timeStamp: new Date(parseInt(x.timeStamp) * 1000).toLocaleString(),
                            tips: x.tips
                        };
                        json.state = '未出库';
                        if (x.id != 0) this.tableData.unshift(json);
                    });
                }
                this.showTable = this.tableData;
            });
        },

        handleOut(index, row) {
            //在点击后获取所点击的行的数据，要加参数
            // 二次确认出库
            this.$confirm('确定要申请资产出库吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    var id = row.uintID;
                    var name = row.assetsName;
                    var assetsType = row.assetsType;
                    var tips = row.tips;
                    var common = localStorage.getItem('common');
                    if (id !== '' && name !== '' && assetsType !== '') {
                        console.log(555555555555555555555555555555555555555555555555555555555);
                        var contractAddress = localStorage.getItem('company');
                        var abi = JSON.parse(localStorage.getItem('companyAbi'));
                        let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                        var myContract = new web3.eth.Contract(abi, contractAddress);
                        console.log(myContract);
                        console.log(555555555555555555555555555555555555555555555555555555555);
                        myContract.methods
                            .submitOutApplication(id, name, assetsType, tips, common)
                            .send({ from: localStorage.getItem('common'), gas: 2000000000 })
                            .on('transactionHash', (hash) => {
                                this.$message.success('提交成功！');
                                this.tableData.splice(index, 1);
                                console.log(hash);

                                // location.reload(); //刷新页面

                                var txType = '普通用户出库申请';
                                var userName = localStorage.getItem('ms_username'); //用户名
                                var person = localStorage.getItem('common');
                                var timeStamp = new Date().toLocaleString();
                                var url =
                                    'http://127.0.0.1:8081/addTrace?txType=' +
                                    txType +
                                    '&txHash=' +
                                    hash +
                                    '&uintID=' +
                                    id +
                                    '&assetsName=' +
                                    name +
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
                        this.$message.error('提交失败，内容不能为空！');
                    }
                })
                .catch(() => {});
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

        // 不同类型资产数量
        assetsType_one() {
            const Search_List = [];
            let searchArr = this.tableData;
            console.log(searchArr);
            searchArr.forEach((e) => {
                let assetsType = e.assetsType;
                if (assetsType.includes('版权类资产') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            console.log('版权类资产', typeof Search_List.length);
            localStorage.setItem('版权类资产', Search_List.length);
        },
        assetsType_two() {
            const Search_List = [];
            // const res = '股权类资产';
            // console.log(typeof res);
            let searchArr = this.tableData;
            console.log(searchArr);
            searchArr.forEach((e) => {
                let assetsType = e.assetsType;
                if (assetsType.includes('股权类资产') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            // this.showTable = Search_List;
            console.log('股权类资产', Search_List.length);
            localStorage.setItem('股权类资产', Search_List.length);
        },
        assetsType_three() {
            const Search_List = [];
            let searchArr = this.tableData;
            console.log(searchArr);
            searchArr.forEach((e) => {
                let assetsType = e.assetsType;
                if (assetsType.includes('证券化资产') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            localStorage.setItem('证券化资产', Search_List.length);
        },
        assetsType_four() {
            const Search_List = [];
            let searchArr = this.tableData;
            console.log(searchArr);
            searchArr.forEach((e) => {
                let assetsType = e.assetsType;
                if (assetsType.includes('专利资产') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            localStorage.setItem('专利资产', Search_List.length);
        },
        assetsType_five() {
            const Search_List = [];
            let searchArr = this.tableData;
            console.log(searchArr);
            searchArr.forEach((e) => {
                let assetsType = e.assetsType;
                if (assetsType.includes('其他资产') && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            localStorage.setItem('其他资产', Search_List.length);
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
