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
    name: 'Pie_Chart',
    components: {
        VChart
    },
    data() {
        return {
            oneValue: '',
            twoValue: '',
            threeValue: '',
            fourValue: '',
            fiveValue: ''
        };
    },
    computed: {
        option() {
            return {
                title: {
                    text: '员工仓库资产分类统计',
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
                    data: ['版权类资产', '股权类资产', '证券化资产', '专利资产', '其他资产']
                },
                series: [
                    {
                        name: '数量',
                        type: 'pie',
                        radius: '70%', // 饼图的半径，让饼图变大。
                        hoverAnimation: true, // 是否开启 hover 在扇区上的放大动画效果
                        center: ['50%', '60%'],
                        data: [
                            { value: this.oneValue, name: '版权类资产' },
                            { value: this.twoValue, name: '股权类资产' },
                            { value: this.threeValue, name: '证券化资产' },
                            { value: this.fourValue, name: '专利资产' },
                            { value: this.fiveValue, name: '其他资产' }
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
        this.oneValue = localStorage.getItem('版权类资产') ? localStorage.getItem('版权类资产') : 0;
        this.twoValue = localStorage.getItem('股权类资产') ? localStorage.getItem('股权类资产') : 0;
        this.threeValue = localStorage.getItem('证券化资产') ? localStorage.getItem('证券化资产') : 0;
        this.fourValue = localStorage.getItem('专利资产') ? localStorage.getItem('专利资产') : 0;
        this.fiveValue = localStorage.getItem('其他资产') ? localStorage.getItem('其他资产') : 0;
    }
};
</script>

<style scoped>
.chart {
    height: 380px;
}
</style>
