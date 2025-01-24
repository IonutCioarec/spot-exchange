import React from 'react';
import ReactECharts from 'echarts-for-react';
import { color } from 'framer-motion';
import { useMobile } from 'utils/responsive';
import shadows from '@mui/material/styles/shadows';

const EChartsPseudo3DExample = () => {
  const isMobile = useMobile();
  const option = {
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['STRULA - WEGLD', 'WEGLD - MRSTKN', 'JNA - WEGLD', 'WTAO - WEGLD', 'BUSD - WEGLD'],
      axisLabel: {
        rotate: 0,
        color: 'white',
        fontWeight: 'bold',
        fontSize: '9px',
        fontFamily: 'Red Rose'
      },
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      type: 'bar',
      data: [999.621, 935.581, 883.971, 810.31, 386.54],
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#23F7DD' }, // Top color
            { offset: 1, color: '#0B6E6F' } // Bottom color
          ],
          global: false
        },
        shadowColor: 'rgba(9, 73, 43, 0.34)',
        shadowBlur: 10,
        shadowOffsetX: 3,
        shadowOffsetY: 3,
        borderRadius: '20px !important'
      },
      barWidth: '40%',
      label: {
        show: true,
        position: 'top',
        formatter: '{c}$',
        color: 'white',
        fontWeight: 'bold',
        fontFamily: 'Red Rose'
      }
    }],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
  };

  return <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />;
};

export default EChartsPseudo3DExample;
