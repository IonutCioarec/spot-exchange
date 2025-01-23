import React from 'react';
import ReactECharts from 'echarts-for-react';
import { intlNumberFormat } from 'utils/formatters';
import { PortofolioChartProps } from 'types/frontendTypes';
import { portofolioColors } from 'config';

const PortofolioRewardsChart: React.FC<PortofolioChartProps> = ({ data }) => {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  const option = {
    xAxis: {
      type: 'category',
      data: data.map((item) => item.name),
      show: false,
    },
    yAxis: {
      show: false,
    },
    grid: {
      left: '25%',
      right: '45%',
    },
    series: [
      {
        name: 'Token Distribution',
        type: 'bar',
        barWidth: '50%',
        label: {
          show: false,
          position: 'bottom',
          formatter: (params: any) => {
            const name = params.name || 'N/A';
            const percentage = ((params.value / totalValue) * 100).toFixed(2);
            const value = `$${intlNumberFormat(params.value, 0, 2)}`;

            return `${name} - ${percentage}%\n${value}`;
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 13,
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            color: 'white',
            fontFamily: 'Red Rose',
          },
        },
        data: data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: `${portofolioColors[index]}`,
            borderRadius: [10, 10, 0, 0],
            whiteSpace: 'nowrap',
          },
        })),
      },
    ],
  };

  return (
    <div style={{ width: '100%', marginTop: '-50px', marginBottom: '-70px' }}>
      <ReactECharts option={option} style={{ height: '260px', width: '100%' }} />
    </div>
  );
};

export default PortofolioRewardsChart;
