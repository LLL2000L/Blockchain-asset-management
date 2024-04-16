<template>
    <div>
        <!-- <el-row :gutter="16" class="mgb20"> -->
        <el-col :span="7" style="margin: 10px 10px 10px 40px">
            <!-- style="margin: 40px" -->
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-1">
                    <i class="el-icon-lx-people grid-con-icon"></i>
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ commonCount }}</div>
                        <div style="font-size: 20px">普通用户数量</div>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="7" style="margin: 10px 10px 10px 30px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-2">
                    <i class="el-icon-lx-notice grid-con-icon"></i>
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ taskCount }}</div>
                        <div style="font-size: 20px">盘点任务总数</div>
                    </div>
                </div>
            </el-card>
        </el-col>
        <el-col :span="7" style="margin: 10px 10px 30px 30px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-3">
                    <i class="el-icon-lx-goods grid-con-icon"></i>
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ taskReusltCount }}</div>
                        <div style="font-size: 20px">已完成盘点任务</div>
                    </div>
                </div>
            </el-card>
        </el-col>

        <el-col :span="8" style="margin: 10px 0px 30px 170px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-5">
                    <i class="el-icon-s-claim grid-con-icon"></i>
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ sendCount }}</div>
                        <div style="font-size: 20px">接收的资产调拨数量</div>
                    </div>
                </div>
            </el-card>
        </el-col>

        <el-col :span="8" style="margin: 10px 10px 30px 150px">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
                <div class="grid-content grid-con-4">
                    <i class="el-icon-s-check grid-con-icon"></i>
                    <div class="grid-cont-right">
                        <div class="grid-num">{{ totalApproving }}</div>
                        <div style="font-size: 20px">出入库待审批任务</div>
                    </div>
                </div>
            </el-card>
        </el-col>

        <!-- </el-row> -->
        <!-- 图表组件 -->
        <el-col :span="10" style="margin-right: 150px; margin-left: 40px">
            <el-card shadow="hover" style="height: 380px"> <EchartPieIn /></el-card>
        </el-col>
        <el-col :span="10">
            <el-card shadow="hover" style="height: 380px"> <EchartPieOut /></el-card>
        </el-col>
    </div>
</template>

<script>
import Schart from 'vue-schart'; //引入图表
// import bus from '../common/bus';
import EchartPieIn from './Echart_pieIn.vue';
import EchartPieOut from './Echart_pieOut.vue';
export default {
    name: 'dashboard',
    data() {
        return {
            commonCount: 0, //员工数量
            // test: 0,
            taskCount: 0, //盘点数量
            taskReusltCount: 0, //完成盘点的数量

            totalApproving: 0, //出入库待审批任务

            sendCount: 0 //调拨出去的数量
        };
    },
    components: {
        Schart,
        EchartPieIn,
        EchartPieOut
    },
    computed: {
        role() {
            return '普通管理员';
        }
    },
    created() {
        console.log(555555555555555555555555555555555555555555555555555555555);
        var contractAddress = localStorage.getItem('company');
        var abi = JSON.parse(localStorage.getItem('companyAbi'));
        let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
        var myContract = new web3.eth.Contract(abi, contractAddress);
        console.log(myContract);
        console.log(555555555555555555555555555555555555555555555555555555555);

        // 1. 获取员工数量
        myContract.methods.getCommonCount().call((error, result) => {
            // console.log(result);
            if (!error) {
                this.commonCount = result;
            }
        });

        // 2. 获取管理员发布过的任务数量
        // 一定要指定 { from: localStorage.getItem('master') }
        myContract.methods.getTaskCount().call({ from: localStorage.getItem('master') }, (error, result) => {
            if (!error) this.taskCount = result;
            console.log('任务数量', result);
        });

        // 3. 管理员获取已完成的任务数量
        myContract.methods.getTaskResultCount().call({ from: localStorage.getItem('master') }, (error, result) => {
            if (!error) this.taskReusltCount = result;
        });

        //获取接收过来的调拨资产的数量
        myContract.methods.getSender().call((error, result) => {
            console.log(result);
            result.map((x) => {
                myContract.methods.getTmpStoreCount(x).call((err, res) => {
                    console.log('调拨数量', res);
                    this.sendCount = res;
                });
            });
        });

        //出入库待审批数量
        var In = localStorage.getItem('In_appriving');
        var Out = localStorage.getItem('Out_appriving');
        this.totalApproving = parseInt(In) + parseInt(Out) ? parseInt(In) + parseInt(Out) : 0;
    },

    methods: {
        changeDate() {
            const now = new Date().getTime();
            this.data.forEach((item, index) => {
                const date = new Date(now - (6 - index) * 86400000);
                item.name = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
            });
        }
    }
};
</script>

<style scoped>
/* .el-row {
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
} */

.grid-content {
    display: flex;
    align-items: center;
    height: 140px;
}
.grid-content1 {
    display: flex;
    align-items: center;
    height: 140px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 40px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 80px;
    width: 140px;
    height: 140px;
    text-align: center;
    line-height: 140px;
    color: #fff;
}

.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
    font-size: 60px;
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(100, 213, 114);
    font-size: 60px;
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
    font-size: 60px;
}

.grid-con-4 .grid-con-icon {
    background: rgb(160, 67, 242);
}

.grid-con-4 .grid-num {
    color: rgb(160, 67, 242);
    font-size: 60px;
}

.grid-con-5 .grid-con-icon {
    background: rgba(225, 175, 60, 0.982);
}

.grid-con-5 .grid-num {
    color: rgba(225, 175, 60, 0.982);
    font-size: 60px;
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}
/* .user-info-name {
    font-family: 'Times New Roman', Times, serif;
} */
.user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}
</style>
