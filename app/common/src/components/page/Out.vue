<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 列表 </el-breadcrumb-item>
                <el-breadcrumb-item>出库申请情况</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-input
                v-model="inputVal"
                placeholder="请输入查询的资产ID号 / 类型 / 资产状态"
                class="handle-input mr10"
                clearable
                @clear="handleSearch(inputVal)"
            ></el-input>
            <el-select v-model="inputVal" placeholder="请选择" class="handle-input1 mr10">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜 索</el-button>

            <el-table :data="showTable" border class="table">
                <el-table-column align="center" prop="ioType" label="申请类型"></el-table-column>
                <el-table-column prop="uintID" label="资产 ID" width="95" align="center"></el-table-column>
                <el-table-column align="center" prop="assetsName" label="资产名称"></el-table-column>
                <el-table-column align="center" prop="assetsType" label="资产类型"></el-table-column>
                <el-table-column align="center" prop="timeStamp" label="申请出库时间"></el-table-column>
                <el-table-column align="center" prop="tips" label="备注"></el-table-column>
                <el-table-column align="center" prop="state" label="状态"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseform',
    data() {
        return {
            dialogFormVisible: false,
            //表单绑定内容
            outForm: {
                uintID: '',
                name: '',
                assetsType: '',
                tips: ''
            },
            assetsType: [
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

            tableData: [],
            showTable: [], // 搜索筛选之后的产品列表
            inputVal: '',
            // state: '', //根据状态搜索
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
                },
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
            ]
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

        myContract.methods.getApprovalHistory().call({ from: localStorage.getItem('common') }, (error, result) => {
            console.log('hhhhhhhhhhhh', result);
            result.map((x) => {
                var json = {
                    uintID: x.id,
                    assetsName: x.name,
                    assetsType: x.assetsType,
                    timeStamp: new Date(parseInt(x.timeStamp) * 1000).toLocaleString(),
                    tips: x.tips
                };
                if (x.state == -1) json.state = '审批拒绝';
                if (x.state == 0) json.state = '审批中';
                if (x.state == 1) json.state = '出库审批成功';
                // if (x.ioType == 1) json.ioType = '入库申请';
                if (x.ioType == 2) {
                    json.ioType = '出库申请';
                    this.tableData.unshift(json);
                }
            });
            this.showTable = this.tableData;
        });
    },
    methods: {
        //触发搜索按钮
        handleSearch() {
            const Search_List = [];
            const res = this.inputVal.replace(/\s/gi, '');
            console.log(res);
            let searchArr = this.tableData;
            searchArr.forEach((e) => {
                let uintID = e.uintID;
                let state = e.state;
                let assetsType = e.assetsType;
                if (uintID.includes(res) && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
                if (state.includes(res) && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
                if (assetsType.includes(res) && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            this.showTable = Search_List;
        }
    }
};
</script>

<style scoped>
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
</style>
