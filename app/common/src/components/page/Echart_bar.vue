<template>
    <v-chart class="chart" :option="option" />
</template>

<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, SingleAxisComponent } from 'echarts/components';
import VChart from 'vue-echarts';

use([CanvasRenderer, BarChart, TitleComponent, TooltipComponent, GridComponent, SingleAxisComponent]);

export default {
    name: 'Bar_Chart',
    components: {
        VChart
    },
    data() {
        return {
            oneValue: '',
            twoValue: ''
        };
    },
    computed: {
        option() {
            return {
                title: {
                    text: '出入库待审批数量',
                    left: 'center',
                    textStyle: {
                        fontSize: 25 //字体大小
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['入库', '出库'],
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontSize: 18 //字体大小
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        axisLabel: {
                            show: true,
                            textStyle: {
                                fontSize: 18 //字体大小
                            }
                        }
                    }
                ],
                series: [
                    {
                        name: '数量',
                        type: 'bar',
                        barWidth: '60%',
                        data: [
                            { value: this.oneValue, name: '入库' },
                            { value: this.twoValue, name: '出库' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
        }
    },
    created() {
        this.bar_Chart();
    },
    methods: {
        bar_Chart() {
            //获取到对应的值
            console.log(555555555555555555555555555555555555555555555555555555555);
            var contractAddress = localStorage.getItem('company');
            var abi = JSON.parse(localStorage.getItem('companyAbi'));
            let web3 = new this.$Web3(new this.$Web3.providers.HttpProvider(localStorage.getItem('provider')));
            var myContract = new web3.eth.Contract(abi, contractAddress);
            console.log(myContract);
            console.log(555555555555555555555555555555555555555555555555555555555);

            //入库待审批数量
            myContract.methods
                .getStoreCountIn(localStorage.getItem('common'))
                .call({ from: localStorage.getItem('common') }, (error, result) => {
                    if (!error) {
                        this.oneValue = result;
                    }
                });

            //出库待审批数量
            myContract.methods
                .getStoreCountOut(localStorage.getItem('common'))
                .call({ from: localStorage.getItem('common') }, (error, result) => {
                    if (!error) {
                        this.twoValue = result;
                    }
                });
        }
    }
};
</script>

<style scoped>
.chart {
    height: 380px;
}
</style>
