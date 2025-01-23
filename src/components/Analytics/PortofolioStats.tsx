import React from 'react';
import ReactECharts from 'echarts-for-react';
import { intlNumberFormat } from 'utils/formatters';
import { PortofolioStatsProps, PortofolioDataObject } from 'types/frontendTypes';
import { portofolioColors, portofolioImages } from 'config';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SyncAltIcon from '@mui/icons-material/SyncAlt';

const PortofolioStats: React.FC<PortofolioStatsProps> = ({ data, balance }) => {
  return (
    <>
      <p className='font-size-sm text-silver mb-0'>Total Balance</p>
      <p className='text-white mb-0' style={{ fontSize: '40px' }}>${intlNumberFormat(balance, 0, 2)}</p>
      <div className='flex'>
        <Link to={'/pools'}>
          <Button
            size='small'
            className='btn-intense-default btn-intense-info hover-btn p-2 b-r-sm font-size-sm'
            style={{ minWidth: '100px' }}
          >
            <CurrencyExchangeIcon fontSize='small' />
            <span className='ms-2'>Invest</span>
          </Button>
        </Link>
        <Link to={'/'}>
          <Button
            size='small'
            className='ms-2 btn-intense-default btn-intense-success2 hover-btn p-2 b-r-sm font-size-sm'
            style={{ minWidth: '100px' }}
          >
            <SyncAltIcon fontSize='small' />
            <span className='ms-2'>Swap</span>
          </Button>
        </Link>
      </div>

      <p className='font-size-sm mt-5 mb-1 text-silver'>Distribution</p>
      <table className='text-white font-size-sm fullWidth'>
        <tbody>
          {data.map((item: PortofolioDataObject, index: number) => {
            const totalValue = data.reduce((sum, currentItem) => sum + currentItem.value, 0);
            const percentage = ((item.value / totalValue) * 100).toFixed(2);

            return (
              <tr key={index} style={{ borderBottom: '1px solid rgba(100,100,100, 0.3)' }}>
                <td style={{ color: portofolioColors[index] }} width={'35%'}>
                  {portofolioImages[index]} {item.name}
                </td>
                <td width={'35%'} align="right">
                  ${item.value.toFixed(2)}
                </td>
                <td width={'30%'} align="right">
                  {percentage}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default PortofolioStats;