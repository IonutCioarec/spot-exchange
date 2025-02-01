import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ButtonGroup, Button } from '@mui/material';
import { ChartViewType } from 'types/frontendTypes';
import { abbreviateNumber } from 'utils/formatters';

interface LiquidityChartProps {
  xData: number[] | string[];
  yData: number[];
  view: ChartViewType;
  setView: (view: ChartViewType) => void;
}

const LiquidityChart: React.FC<LiquidityChartProps> = ({ xData, yData, view, setView }) => {
  const [tooltipValue, setTooltipValue] = useState<string>('');
  const [tooltipDate, setTooltipDate] = useState<string>('');

  // Function to format the last xData value based on the selected view
  const formatDateLabel = (timestamp: number, selectedView: ChartViewType) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();

    if (selectedView === '24H') {
      return `${day} ${month}, ${year} ` + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    if (selectedView === '1M') {
      return `${day} ${month}, ${year}`;
    }
    return `${month} ${year}`;
  };

  const getDefaultTooltipValues = (selectedView: ChartViewType) => {
    if (xData.length > 0 && yData.length > 0) {
      const lastTimestamp = Number(xData[xData.length - 1]);
      const lastValue = yData[yData.length - 1];
      return {
        value: `$${abbreviateNumber(lastValue, 0)}`,
        date: formatDateLabel(lastTimestamp, selectedView),
      };
    }
    return { value: '', date: '' };
  };

  useEffect(() => {
    const { value, date } = getDefaultTooltipValues(view);
    setTooltipValue(value);
    setTooltipDate(date);
  }, [xData, yData, view]);

  const handleClick = (selectedView: ChartViewType) => {
    setView(selectedView);
    const { value, date } = getDefaultTooltipValues(selectedView);
    setTooltipValue(value);
    setTooltipDate(date);
  };

  const onEvents = {
    globalout: () => {
      const { value, date } = getDefaultTooltipValues(view);
      setTooltipValue(value);
      setTooltipDate(date);
    },
  };

  const option = {
    xAxis: {
      type: 'category',
      data: xData,
      axisLabel: {
        fontFamily: 'Red Rose',
        color: '#fff',
        formatter: (value: number | string) => {
          const date = new Date(Number(value) * 1000);
          if (view === '24H') return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
          if (view === '1M') {
            const date = new Date(Number(value) * 1000);
            const day = date.getDate().toString().padStart(2, '0');
            return `${day}`;
          }
          return (date.getMonth() + 1).toString().padStart(2, '0');
        },
      },
    },
    yAxis: {
      type: 'time',
      position: 'right',
      axisLabel: {
        fontFamily: 'Red Rose',
        color: '#fff',
        formatter: (value: number) => abbreviateNumber(value, 0),
      },
    },
    series: [
      {
        data: yData,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          color: '#3FAC5A',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0.4, color: '#2e693896' }, // Start color
              { offset: 1, color: '#123c3d79' }, // End color
            ],
          },
        },
      },
    ],
    tooltip: {
      backgroundColor: 'rgb(20,20,20)',
      borderColor: '#3FAC5A',
      borderWidth: 1,
      borderRadius: 12,
      textStyle: {
        fontFamily: 'Red Rose',
        color: '#fff',
        fontSize: 12
      },
      trigger: 'axis',
      formatter: (params: any) => {
        const timestamp = Number(params[0].axisValue) * 1000;
        const date = new Date(timestamp);

        // Extract day, month (first 3 letters), and year separately
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        let formattedDate = `${day} ${month}, ${year}`;
        let timeLabel = '';
        if (view === '24H') {
          const formattedTime = date.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
          timeLabel = ` ${formattedTime}`;
        }

        if (view === 'Full') {
          formattedDate = `${month} ${year}`;
        }

        const value = abbreviateNumber(params[0].data, 0);

        // Update separate tooltip content for value and date        
        setTooltipValue(`$${value}`);
        setTooltipDate(`${formattedDate}${timeLabel}`);

        return `${formattedDate}${timeLabel} - $${value}`;
      },
    },
    axisPointer: {
      lineStyle: {
        color: 'rgb(165, 226, 181)',
        type: 'dashed',
        width: 1.5,
      },
    },
  };


  return (
    <div className='b-r-sm' style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}>
      <div className='d-flex justify-content-between align-items-center px-5 py-4'>
        <p className='mb-0 text-silver font-size-md font-bold'>DEX Liquidity </p>
        <ButtonGroup className='b-r-md p-1' size="small" variant="outlined" aria-label="outlined button group" style={{ border: '1px solid #3FAC5A' }}>
          <Button className={`btn-intense-default b-r-sm  hover-btn px-3 py-1 ${view === '24H' ? 'btn-intense-success' : 'text-silver'}`} onClick={() => handleClick('24H')}>24H</Button>
          <Button className={`btn-intense-default b-r-sm hover-btn px-3 py-1 ${view === '1M' ? 'btn-intense-success' : 'text-silver'}`} onClick={() => handleClick('1M')}>1M</Button>
          <Button className={`btn-intense-default b-r-sm hover-btn px-3 py-1 ${view === 'Full' ? 'btn-intense-success' : 'text-silver'}`} onClick={() => handleClick('Full')}>Full</Button>
        </ButtonGroup>
      </div>
      <div className='px-5'>
        <p className='text-white mb-0' style={{ fontSize: '50px' }}>{tooltipValue}</p>
        <p className='text-silver font-size-sm mb-0 m-t-n-sm'>{tooltipDate}</p>
      </div>
      <div className='d-flex m-t-n-xl m-l-n-md'>
        <ReactECharts className='font-rose' option={option} style={{ height: '350px', width: '96%' }} onEvents={onEvents}  />
      </div>
    </div>
  );
};

export default LiquidityChart;
