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
            approving: '', //审批中
            approve: '', //审批同意
            disApprove: '' //审批拒绝
        };
    },
    computed: {
        option() {
            return {
                title: {
                    text: '入库审批情况',
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
                    left: 'left',
                    textStyle: {
                        fontSize: 18 //字体大小
                    },
                    itemGap: 20, // 设置间距
                    data: ['审批中', '审批同意', '审批拒绝']
                },
                series: [
                    {
                        name: '占比',
                        type: 'pie',
                        radius: ['45%', '75%'], // 饼图的半径，让饼图变大。
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
                            { value: this.approving, name: '审批中' },
                            { value: this.approve, name: '审批同意' },
                            { value: this.disApprove, name: '审批拒绝' }
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
        this.approving = localStorage.getItem('In_appriving') ? localStorage.getItem('In_appriving') : 0;
        this.approve = localStorage.getItem('In_apprive') ? localStorage.getItem('In_apprive') : 0;
        this.disApprove = localStorage.getItem('In_disapprive') ? localStorage.getItem('In_disapprive') : 0;
    }
};
</script>

<style scoped>
.chart {
    height: 380px;
}
</style>
