<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 现有普通用户 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" border class="table">
                <!-- 添加索引 -->
                <el-table-column label="序号" width="150" align="center">
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="用户名"></el-table-column>
                <el-table-column align="center" prop="address" label="账号地址"></el-table-column>
            </el-table>
        </div>

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 普通用户申请注册 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <el-table :data="tableDataCommon" border class="table">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <!-- 添加索引 -->
                <el-table-column label="序号" width="150" align="center">
                    <template slot-scope="scope">
                        {{ scope.$index + 1 }}
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="用户名" width="250"></el-table-column>
                <el-table-column align="center" prop="address" label="账号地址"></el-table-column>
                <el-table-column label="操作" width="350" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" style="font-size: 22px" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)"
                            >同意</el-button
                        >
                        <el-button
                            type="text"
                            style="font-size: 22px"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                            align="center"
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
            tableData: [],
            tableDataCommon: []
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取数据
        getData() {
            // 渲染现有员工
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);

            myContract.methods.getRole('common').call(null, (error, result) => {
                console.log(error);
                console.log('hh1', result);
                result.map((x) => {
                    var url = 'http://127.0.0.1:8081/getCommonName?address=' + x;
                    this.$axios.get(url).then((res) => {
                        console.log('hh2', res.data);
                        var json = { name: res.data, address: x };
                        this.tableData.unshift(json);
                    });
                });
                // console.log(error)
            });
            var result = JSON.parse(localStorage.getItem('addrs'));
            console.log(result);
            result.map((x) => {
                var url = 'http://127.0.0.1:8081/getCommonName?address=' + x;
                this.$axios.get(url).then((res) => {
                    console.log('gg3', res.data);
                    var json = { name: res.data, address: x };
                    this.tableData.unshift(json);
                });
            });

            //获取员工申请注册
            var url = 'http://127.0.0.1:8081/getCommonRegister';
            this.$axios.get(url).then((res) => {
                console.log('hh4', res.data);
                res.data.map((x) => {
                    var json = {
                        name: x.name,
                        address: x.address
                    };
                    this.tableDataCommon.unshift(json);
                });
            });
        },

        // 拒绝添加用户
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要拒绝申请吗？', '提示', {
                type: 'warning'
            }).then(() => {
                var url = 'http://127.0.0.1:8081/checkCommon?action=0&name=' + row.name + '&address=' + row.address;
                this.$axios.get(url).then((res) => {
                    this.tableDataCommon.splice(index, 1);
                });
            });
        },

        //同意操作
        handleEdit(index, row) {
            var url = 'http://127.0.0.1:8081/checkCommon?action=1&name=' + row.name + '&address=' + row.address;
            this.$axios.get(url).then((res) => {
                console.log(res);
                this.tableDataCommon.splice(index, 1);
            });

            // var myContract=that.$getlogin()
            // console.log(myContract)
            // 往区块链上添加成员
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            // console.log(row.address)
            console.log(localStorage.getItem('master'));
            // console.log( web3.isAddress(row.address))
            myContract.methods
                .addRole('common', row.address)
                .send({ from: localStorage.getItem('master'), gas: 200000 })
                .on('transactionHash', (hash) => {
                    console.log(hash);
                    this.$message.success('操作成功');
                    var transaction = web3.eth.getTransaction(hash);
                    transaction.then((res) => {
                        alert('本次上链交易区块号为：' + Number(res.blockNumber));
                    });
                    // location.reload(); //刷新页面
                });
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
