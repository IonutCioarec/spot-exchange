import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { ButtonGroup, Button } from '@mui/material';

const getLastHours = (hours: any) => {
  const now = new Date().getDate();
  const times = [];
  for (let i = hours - 1; i >= 0; i--) {
    const time = new Date(now - i * 3600 * 1000);
    times.push(time.toISOString().slice(11, 16)); // 'HH:MM' format
  }
  return times;
};

const getLastDays = (days: number) => {
  const now = new Date().getDate();
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 24 * 3600 * 1000);
    dates.push(date.toISOString().slice(5, 10)); // 'MM-DD' format
  }
  return dates;
};

const generateRandomData = (total: any, length:any) => {
  let sum = 0;
  const data = Array.from({ length }, () => {
    const value = Math.random() * (total / length) * 2; // Random value
    sum += value;
    return value;
  });
  const adjustmentFactor = total / sum;
  return data.map(value => value * adjustmentFactor); // Adjust to sum up to total
};

const LineChartWithButtons = () => {
  const [view, setView] = useState('24H');

  const handleClick = (view: any) => {
    setView(view);
  };

  const getData = () => {
    if (view === '24H') {
      return {
        xData: getLastHours(24),
        yData: generateRandomData(300000000, 24)
      };
    } else {
      return {
        xData: getLastDays(30),
        yData: generateRandomData(600000000, 30)
      };
    }
  };

  const { xData, yData } = getData();

  const option = {
    xAxis: {
      type: 'category',
      data: xData,
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      data: yData,
      type: 'line',
      areaStyle: {},
      smooth: true,
    }],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        const timeLabel = params[0].axisValue;
        const value = params[0].data;
        const formattedDate = view === '24H'
          ? `${date.toISOString().slice(0, 10)} ${timeLabel}`
          : `${timeLabel}, ${date.getFullYear()}`;
        return `${formattedDate} - ${value.toFixed(2)}$`;
      }
    },
  };

  return (
    <div>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button onClick={() => handleClick('24H')} variant={view === '24H' ? 'contained' : 'outlined'}>24H</Button>
        <Button onClick={() => handleClick('30D')} variant={view === '30D' ? 'contained' : 'outlined'}>30D</Button>
      </ButtonGroup>
      <ReactECharts option={option} style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default LineChartWithButtons;
