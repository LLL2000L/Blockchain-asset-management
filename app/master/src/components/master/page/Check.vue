<template>
    <div>
        <!--    // 资产盘点任务的定义-->
        <!--    struct AssetsTask {-->
        <!--    uint id;-->
        <!--    string taskName;-->
        <!--    string assetsName;-->
        <!-- uint256 Uid;//资产ID -->
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
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 盘点任务列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-input
                v-model="inputVal"
                placeholder="请输入盘点状态"
                class="handle-input mr10"
                clearable
                @clear="handleSearch(inputVal)"
            ></el-input>
            <el-select v-model="inputVal" placeholder="请选择" class="handle-input1 mr10">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button>

            <el-table :data="showTable" border class="table">
                <!-- <el-table-column align="center" prop="uintID" label="ID"></el-table-column> -->
                <el-table-column align="center" prop="assetsID" label="资产ID" width="95"></el-table-column>
                <el-table-column align="center" prop="taskName" label="任务名" width="125"></el-table-column>
                <el-table-column align="center" prop="assetsName" label="资产名称" width="125"></el-table-column>
                <el-table-column align="center" prop="to" label="盘点员工"></el-table-column>
                <el-table-column align="center" prop="timeStart" label="盘点任务开始时间" width="210"></el-table-column>
                <el-table-column align="center" prop="timeEnd" label="盘点任务结束时间" width="210"></el-table-column>
                <el-table-column align="center" prop="state" label="盘点状态" width="115"></el-table-column>
                <el-table-column align="center" prop="tips" label="备注" width="135"></el-table-column>
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
            showTable: [], // 搜索筛选之后的产品列表
            inputVal: '',
            options: [
                {
                    value: '已盘点',
                    label: '已盘点'
                },
                {
                    value: '未盘点',
                    label: '未盘点'
                }
            ]
        };
    },
    created() {
        this.getHistory();
    },
    methods: {
        // 管理员获取自己发布过的历史任务
        getHistory() {
            // // 资产盘点任务的定义
            // struct AssetsTask {
            //   uint id;
            //   string taskName;
            //   string assetsName;
            //   string assetsType;
            //   address from;
            //   address to;
            //   // 盘点任务起始时间
            //   string timeStart;
            //   string timeEnd;
            //   // 盘点状态 false:未盘点 true:已盘点
            //   bool state;
            //   // 备注
            //   string tips;
            // }
            // var myContract=this.$getlogin()
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            myContract.methods.getAssetsTaskPool().call({ from: localStorage.getItem('master') }, (error, result) => {
                if (!error) {
                    result.map((x) => {
                        var json = {
                            // uintID: x.id,
                            taskName: x.taskName,
                            assetsName: x.assetsName,
                            assetsID: x.id,
                            to: x.to,
                            timeStart: x.timeStart,
                            timeEnd: x.timeEnd,
                            tips: x.tips
                        };
                        if (x.state == true) json.state = '已盘点';
                        if (x.state == false) json.state = '未盘点';
                        // if (x.timeStartEnd === 1) json.timeStartEnd = this.form.timeStartEnd;
                        // console.log(json.timeStartEnd);
                        console.log('时间', json.timeStart);
                        console.log(json.timeEnd);
                        this.tableData.unshift(json);
                    });
                    this.showTable = this.tableData; //初始化showTable[]
                }
            });
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
