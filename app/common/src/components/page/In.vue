<template>
    <div>
        <!-- //弹出表单 -->
        <el-dialog title="入库申请表单" :visible.sync="dialogFormVisible" width="30%">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="申请类型">
                    <!-- disabled 被禁用的 input 元素可复制，不能接收焦点,设置后文字的颜色会变成灰色 -->
                    <el-input v-model="form.ioType" disabled></el-input>
                </el-form-item>
                <el-form-item label="资产名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="资产类型">
                    <el-select v-model="form.assetsType" placeholder="请选择资产类型" style="width: 100%">
                        <el-option v-for="item in assetsType" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.tips"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 列表 </el-breadcrumb-item>
                <el-breadcrumb-item>入库申请列表</el-breadcrumb-item>
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
            <el-button type="primary" icon="el-icon-edit" @click="dialogFormVisible = true" size="medium" style="float: right"
                >添加资产入库</el-button
            >
            <el-table :data="showTable" border class="table">
                <el-table-column align="center" prop="ioType" label="申请类型"></el-table-column>
                <el-table-column align="center" prop="uintID" label="资产 ID" width="95"></el-table-column>
                <el-table-column align="center" prop="assetsName" label="资产名称"></el-table-column>
                <el-table-column align="center" prop="assetsType" label="资产类型"></el-table-column>
                <el-table-column align="center" prop="timeStamp" label="申请入库时间"></el-table-column>
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
            form: {
                ioType: 1,
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
            inputVal: '', //绑定输入的查询内容
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
        // var myContract = JSON.parse(localStorage.getItem('myContract'))
        // var myContract=this.$getlogin()
        console.log(555555555555555555555555555555555555555555555555555555555);
        var contractAddress = localStorage.getItem('company');
        var abi = JSON.parse(localStorage.getItem('companyAbi'));
        let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
        var myContract = new web3.eth.Contract(abi, contractAddress);
        console.log(myContract);
        console.log(555555555555555555555555555555555555555555555555555555555);
        //渲染历史出入库申请情况
        // struct InOutApplication {
        //   // 0: 出库申请
        //   // 1: 入库申请
        //   uint ioType;
        //   uint id;
        //   string name;
        //   string assetsType;
        //   address personal;
        //   uint timeStamp;
        //   // 审批状态-1:审批失败 0:审批中 1:审批成功
        //   int state;
        //   // 备注
        //   string tips;
        // }
        myContract.methods.getApprovalHistory().call({ from: localStorage.getItem('common') }, (error, result) => {
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
                if (x.state == 1) json.state = '入库审批成功';

                if (x.ioType == 1) {
                    json.ioType = '入库申请';
                    this.tableData.unshift(json);
                }
            });
            this.showTable = this.tableData; //初始化showTable[]
        });

        //在初始化时将数据放在MySQL中
        setTimeout(() => {
            this.addTrace();
        }, 2000);
    },
    methods: {
        onSubmit() {
            var ioType = this.form.ioType;
            var name = this.form.name;
            var assetsType = this.form.assetsType;
            var tips = this.form.tips;
            if (name !== '' && assetsType !== '') {
                console.log(555555555555555555555555555555555555555555555555555555555);
                var contractAddress = localStorage.getItem('company');
                var abi = JSON.parse(localStorage.getItem('companyAbi'));
                let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
                var myContract = new web3.eth.Contract(abi, contractAddress);
                console.log(myContract);
                console.log(555555555555555555555555555555555555555555555555555555555);
                myContract.methods
                    .submitApplication(ioType, name, assetsType, tips)
                    .send({ from: localStorage.getItem('common'), gas: 2000000000 })
                    .on('transactionHash', (hash) => {
                        this.$message.success('提交成功!');
                        console.log(hash);
                        localStorage.setItem('txHash', hash);
                        location.reload(); //刷新页面
                    });
            } else {
                this.$message.error('提交失败！输入内容不能为空');
            }
        },
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
                } else if (state.includes(res) && Search_List.indexOf(e)) {
                    Search_List.push(e);
                } else if (assetsType.includes(res) && Search_List.indexOf(e)) {
                    Search_List.push(e);
                }
            });
            this.showTable = Search_List;
        },

        //加入数据到溯源中
        addTrace() {
            //由于添加之后，新添加的数据永远都是第一条
            console.log('searchArr', this.tableData[0].assetsName);
            var txType = '普通用户入库申请';
            var txHash = localStorage.getItem('txHash');
            var uintID = this.tableData[0].uintID;
            var assetsName = this.tableData[0].assetsName;
            var userName = localStorage.getItem('ms_username'); //用户名
            var person = localStorage.getItem('common');
            var timeStamp = this.tableData[0].timeStamp;
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
                //不能删，这样数据添加的新数据才可以获取到
                console.log('res', res);
            });
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
