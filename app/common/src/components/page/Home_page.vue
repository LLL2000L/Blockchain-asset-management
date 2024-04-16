<template>
    <div>
        <el-row :gutter="24">
            <el-col :span="7" style="margin: 20px 30px 20px 20px">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                    <div class="grid-content grid-con-1">
                        <i class="el-icon-lx-people grid-con-icon"></i>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{ storeCount }}</div>
                            <div style="font-size: 20px">仓库资产数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="7" style="margin: 20px 30px 20px 20px">
                <el-card shadow="hover" :body-style="{ padding: '0px' }">
                    <div class="grid-content grid-con-2">
                        <i class="el-icon-lx-notice grid-con-icon"></i>
                        <div class="grid-cont-right">
                            <div class="grid-num">{{ task }}</div>
                            <div style="font-size: 20px">盘点资产总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8" style="height: 200px">
                <EchartPieNull />
            </el-col>
        </el-row>
        <!-- 图表 -->

        <el-col :span="11" style="margin-right: 80px; margin-left: 20px">
            <el-card shadow="hover" style="height: 400px"> <EchartPie /></el-card>
        </el-col>
        <el-col :span="11">
            <el-card shadow="hover" style="height: 400px"> <EchartBar /></el-card>
        </el-col>
    </div>
</template>

<script>
// import bus from '../common/bus';
import EchartPie from './Echart_pie.vue';
import EchartBar from './Echart_bar.vue';
import EchartPieNull from './Echart_pieNull.vue';
export default {
    name: 'dashboard',
    data() {
        return {
            storeCount: 0, //仓库数量
            // 资产盘点任务
            task: 0
        };
    },
    components: {
        EchartPie,
        EchartPieNull,
        EchartBar
    },
    computed: {
        role() {
            return this.name === 'admin' ? '管理员' : '普通用户';
        }
    },
    created() {
        this.flushData();
    },

    methods: {
        flushData() {
            // var myContract=this.$getlogin()
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            // 渲染仓库数量
            myContract.methods.getStoreCount().call({ from: localStorage.getItem('common') }, (error, result) => {
                if (!error) {
                    this.storeCount = result;
                }
            });

            // this.task = this.$store.commit('getTask');

            // // 渲染资产盘点任务数量
            // myContract.methods.getTask(localStorage.getItem('master')).call((error, result) => {
            //     if (!error) {
            //         this.task = result.length;
            //         console.log('盘点任务数量', this.task);
            //     }
            // });

            //获取盘点任务总数
            myContract.methods.getRole('master').call(null, (eerr, rres) => {
                console.log('rres', rres);
                rres.map((addr) => {
                    myContract.methods.getTask(addr).call({ from: localStorage.getItem('common') }, (error, result) => {
                        if (!error) {
                            this.task = result.length;
                        }
                    });
                });
            });
        }
    }
};
</script>

<style scoped>
.el-row {
    margin-bottom: 128px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 150px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 50px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 150px;
    height: 150px;
    text-align: center;
    line-height: 150px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}
</style>
