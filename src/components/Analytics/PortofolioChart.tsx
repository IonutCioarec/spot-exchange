import React from 'react';
import ReactECharts from 'echarts-for-react';
import { intlNumberFormat } from 'utils/formatters';
import { PortofolioChartProps } from 'types/frontendTypes';
import { portofolioColors } from 'config';
import { useMobile } from 'utils/responsive';

const PortofolioChart: React.FC<PortofolioChartProps> = ({ data }) => {
  const isMobile = useMobile();
  
  const option = {
    series: [
      {
        name: 'Token Distribution',
        type: 'pie',
        radius: ['80%', '90%'],
        label: {
          show: false,
          position: 'center',
          formatter: (params: any) => {
            const name = params.name || 'N/A';
            const percentage = params.percent ? `${params.percent}%` : '0%';
            const value = params.value !== undefined ? `$${intlNumberFormat(params.value, 0, 2)}` : '$0.000';

            return `${name} - ${percentage}\n${value}`;
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 17,
            fontWeight: 'bold',
            backgroundColor: 'transparent',
            color: 'white',
            fontFamily: 'Red Rose',
          },
        },
        labelLine: {
          show: false,
        },
        padAngle: 2,
        data: data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: portofolioColors[index],
            borderRadius: 10,
          },
        })),
      },
    ],
  };

  return (
    <div style={{ width: '100%' }} className={`${isMobile ? 'mt-3' : ''}`}>
      <ReactECharts option={option} style={{ height: isMobile ? '200px' : '280px', width: '100%' }} />
    </div>
  );
};

export default PortofolioChart;