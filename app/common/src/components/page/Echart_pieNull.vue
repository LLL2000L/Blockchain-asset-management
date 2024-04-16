<template>
    <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

export default {
    name: 'Pie_ChartNull',
    components: {
        VChart
    },
    data() {
        return {
            oneValue: '', //仓库总数
            twoValue: '' //正在盘点数量
        };
    },
    computed: {
        option() {
            return {
                title: {
                    text: '盘点资产对比图',
                    left: 'center',
                    textStyle: {
                        fontSize: 25 //字体大小
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    top: '15%',
                    orient: 'vertical',
                    left: 'right',
                    textStyle: {
                        fontSize: 18 //字体大小
                    },
                    itemGap: 20, // 设置间距
                    data: ['未盘点', '已盘点']
                },
                series: [
                    {
                        name: '占比',
                        type: 'pie',
                        radius: ['35%', '65%'], // 饼图的半径，让饼图变大。
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        data: [
                            { value: this.oneValue, name: '未盘点' },
                            { value: this.twoValue, name: '已盘点' }
                        ],
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '20',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        }
                    }
                ]
            };
        }
    },
    created() {
        this.pie_Chart();
    },
    methods: {
        pie_Chart() {
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);
            //获取盘点任务总数
            myContract.methods.getRole('master').call(null, (eerr, rres) => {
                console.log('rres', rres);
                rres.map((addr) => {
                    myContract.methods.getTask(addr).call({ from: localStorage.getItem('common') }, (error, result) => {
                        if (!error) {
                            // 从数据库获取到已盘点任务数量;(总-未盘点)
                            this.twoValue = result.length - this.oneValue;
                        }
                    });
                });
            });

            // 获取到未盘点任务数量;
            this.oneValue = localStorage.getItem('noTask') ? localStorage.getItem('noTask') : 0;
        }
    }
};
</script>

<style scoped>
.chart {
    height: 380px;
}
</style>
