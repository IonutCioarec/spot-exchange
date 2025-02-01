import React, { useEffect, useMemo, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ButtonGroup, Button } from '@mui/material';
import { ChartViewType } from 'types/frontendTypes';
import { abbreviateNumber } from 'utils/formatters';

interface VolumeChartProps {
  xData: number[] | string[];
  yData: number[];
  view: ChartViewType;
  setView: (view: ChartViewType) => void;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ xData, yData, view, setView }) => {
  const [tooltipValue, setTooltipValue] = useState<string>('');
  const [tooltipDate, setTooltipDate] = useState<string>('');

  // Function to format the view label
  const formatLabel = (selectedView: ChartViewType) => {
    if (selectedView === '24H') return `Last 24 hours`;
    if (selectedView === '1M') return `Last month`;
    return `All time`;
  };

  // Function to calculate default tooltip value (sum of yData)
  const getDefaultTooltipValue = () => {
    const sum = yData.reduce((acc, value) => acc + value, 0);
    return `$${abbreviateNumber(sum, 0)}`;
  };

  // Set default tooltip value when component mounts or when data changes
  useEffect(() => {
    if (xData.length > 0 && yData.length > 0) {
      setTooltipValue(getDefaultTooltipValue());
      setTooltipDate(formatLabel(view));
    }
  }, [xData, yData, view]);

  const handleClick = (selectedView: ChartViewType) => {
    setView(selectedView);
    setTooltipValue(getDefaultTooltipValue());
    setTooltipDate(formatLabel(selectedView));
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
          if (view === '1M') return date.getDate().toString().padStart(2, '0');
          return (date.getMonth() + 1).toString().padStart(2, '0');
        },
      },
    },
    yAxis: {
      type: 'value',
      position: 'right',
      axisLabel: {
        fontFamily: 'Red Rose',
        color: '#fff',
        formatter: (value: number) => abbreviateNumber(value, 0),
      },
      splitLine: { show: false },
    },
    series: [
      {
        data: yData,
        type: 'bar',
        barWidth: '60%',
        itemStyle: {
          borderRadius: [5, 5, 0, 0],
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(13, 202, 240, 0.8)' },
              { offset: 1, color: 'rgba(5, 120, 150, 0.4)' },
            ],
          },
        },
      },
    ],
    tooltip: {
      backgroundColor: 'rgb(20,20,20)',
      borderColor: 'rgb(13, 202, 240)',
      borderWidth: 1,
      borderRadius: 12,
      textStyle: {
        fontFamily: 'Red Rose',
        color: '#fff',
        fontSize: 12,
      },
      trigger: 'axis',
      formatter: (params: any) => {
        const timestamp = Number(params[0].axisValue) * 1000;
        const date = new Date(timestamp);
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
        setTooltipValue(`$${value}`);
        setTooltipDate(`${formattedDate}${timeLabel}`);
        return `${formattedDate}${timeLabel} - $${value}`;
      },
    },
  };


  const onEvents = useMemo(
    () => ({
      globalout: () => {
        setTooltipValue(getDefaultTooltipValue());
        setTooltipDate(formatLabel(view));
      },
    }),
    [view]
  );

  return (
    <div className='b-r-sm' style={{ backgroundColor: 'rgba(32,32,32, 0.5)' }}>
      <div className='d-flex justify-content-between align-items-center px-5 py-4'>
        <p className='mb-0 text-silver font-size-md font-bold'>DEX Fees </p>
        <div className='me-3'>
          <ButtonGroup className='b-r-md p-1' size="small" variant="outlined" aria-label="outlined volume button group" style={{ border: '1px solid rgb(13, 202, 240)' }}>
            <Button className={`btn-intense-default b-r-sm  hover-btn px-3 py-1 ${view === '24H' ? 'btn-intense-info2' : 'text-silver'}`} onClick={() => handleClick('24H')}>24H</Button>
            <Button className={`btn-intense-default b-r-sm hover-btn px-3 py-1 ${view === '1M' ? 'btn-intense-info2' : 'text-silver'}`} onClick={() => handleClick('1M')}>1M</Button>
            <Button className={`btn-intense-default b-r-sm hover-btn px-3 py-1 ${view === 'Full' ? 'btn-intense-info2' : 'text-silver'}`} onClick={() => handleClick('Full')}>Full</Button>
          </ButtonGroup>
        </div>
      </div>
      <div className='px-5'>
        <p className='text-white mb-0' style={{ fontSize: '50px' }}>{tooltipValue}</p>
        <p className='text-silver font-size-sm mb-0 m-t-n-sm'>{tooltipDate}</p>
      </div>
      <div className='d-flex m-t-n-md'>
        <ReactECharts className='font-rose' option={option} style={{ height: '400px', width: '100%' }} onEvents={onEvents} />
      </div>
    </div>
  );
};

export default VolumeChart;