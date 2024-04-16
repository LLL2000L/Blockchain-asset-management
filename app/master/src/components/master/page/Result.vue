<template>
    <div>
        <!--    // 资产盘点任务的定义-->
        <!--    struct AssetsTask {-->
        <!--    uint id;-->
        <!--    string taskName;-->
        <!--    string assetsName;-->
        <!--    string assetsType;-->
        <!--    address from;-->
        <!--    address to;-->
        <!--    // 盘点任务起始时间-->
        <!--    string timeStartEnd;-->
        <!--    // 盘点状态 false:未盘点 true:已盘点-->
        <!--    bool state;-->
        <!--    // 备注-->
        <!--    string tips;-->
        <!--    }-->

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 任务盘点结果 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-input
                v-model="inputVal"
                placeholder="请输入搜索的ID号"
                class="handle-input mr10"
                clearable
                @clear="handleSearch(inputVal)"
            ></el-input>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch(inputVal)">搜 索</el-button>
            <el-table :data="showTable" border class="table" show-summary>
                <el-table-column align="center" width="500" prop="uintID" label="任务ID"></el-table-column>
                <el-table-column align="center" prop="count" label="盘点结果"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            tableDataResult: [],
            // form: {},
            showTable: [], // 搜索筛选之后的产品列表
            inputVal: ''
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取数据
        getData() {
            // // 资产盘点任务的结果的定义
            // struct AssetsTaskResult {
            //   // 任务 id
            //   uint id;
            //   // 盘点数量
            //   uint count;
            // }
            // function getAssetsTaskResultPool() OnlyMaster returns(AssetsTaskResult[]) {
            // var myContract=this.$getlogin()
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            myContract.methods.getAssetsTaskResultPool().call({ from: localStorage.getItem('master') }, (error, result) => {
                result.map((x) => {
                    var json = {
                        uintID: x.id,
                        count: x.count
                    };
                    this.tableDataResult.unshift(json);
                });
                this.showTable = this.tableDataResult;
                console.log(this.showTable);
            });
        },
        // 触发搜索按钮
        handleSearch() {
            const Search_List = [];
            const res = this.inputVal.replace(/\s/gi, '');
            // console.log(res);
            let searchArr = this.tableDataResult;
            searchArr.forEach((e) => {
                let uintID = e.uintID;
                if (uintID.includes(res)) {
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
    font-size: 22px;
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

