import 'assets/scss/analytics.scss';
import { Row, Col } from 'react-bootstrap';
import LiquidityChart from 'components/Analytics/LiquidityChart';
import VolumeChart from 'components/Analytics/VolumeChart';
import FeesChart from 'components/Analytics/FeesChart';
import TokenRow from 'components/Analytics/TokenRow';
import { useState } from 'react';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import RecyclingIcon from '@mui/icons-material/Recycling';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ContactsIcon from '@mui/icons-material/Contacts';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import TimelineIcon from '@mui/icons-material/Timeline';
import PaymentsIcon from '@mui/icons-material/Payments';
import { ChartViewType } from 'types/frontendTypes';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import PercentIcon from '@mui/icons-material/Percent';
import AnimationIcon from '@mui/icons-material/Animation';
import { abbreviateNumber } from 'utils/formatters';
import TokensList from 'components/Analytics/TokensList';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Analytics = () => {
  // dex token details data
  const initialTokenRowItems = [
    { label: "DEX Token", value: "XTICKET", icon: "https://tools.multiversx.com/assets-cdn/devnet/tokens/XTICKET-6e9b83/icon.svg", isImage: true },
    { label: "Minted", value: "100M", icon: <AccountTreeIcon className='token-row-icon' />, isImage: false },
    { label: "Burned", value: "10.5M", icon: <LocalFireDepartmentIcon className='token-row-icon' />, isImage: false },
    { label: "Supply", value: "89.5M", icon: <RecyclingIcon className='token-row-icon' />, isImage: false },
    { label: "Holders", value: "124", icon: <ContactsIcon className='token-row-icon smaller' />, isImage: false },
    { label: "Price", value: "$1,34", icon: <AttachMoneyIcon className='token-row-icon' style={{ marginRight: '-10px' }} />, isImage: false },
    { label: "Volume 24h", value: "$10,345", icon: <TimelineIcon className='token-row-icon' />, isImage: false },
    { label: "Liquidity", value: "$100,345", icon: <PaymentsIcon className='token-row-icon' />, isImage: false },
    { label: "Transactions", value: "10,345", icon: <SwapHorizontalCircleIcon className='token-row-icon' />, isImage: false },
  ];
  const [tokenRowItems, setTokenRowItems] = useState(initialTokenRowItems);

  // dex total liquidity chart data
  const liquidityData: Record<ChartViewType, { xData: string[] | number[]; yData: number[] }> = {
    "24H": {
      xData: [
        1738350000, 1738353600, 1738357200, 1738360800, 1738364400, 1738368000, 1738371600, 1738375200,
        1738378800, 1738382400, 1738386000, 1738389600, 1738393200, 1738396800, 1738400400, 1738404000,
        1738407600, 1738411200, 1738414800, 1738418400, 1738422000, 1738425600, 1738429200, 1738432800
      ],
      yData: [
        15936348.65, 16840702.06, 21611352.37, 11680709.54, 10323804.60, 20576949.92, 15131505.31, 2832207.97,
        18235333.19, 19389270.81, 20017611.36, 11068872.69, 6328977.52, 6040826.43, 7965947.73, 14911932.46,
        14414244.91, 21297734.89, 4363974.66, 2254807.61, 7970282.11, 13242533.87, 1251326.12, 16312743.09
      ],
    },
    "1W": {
      xData: [
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        37358467.531057134, 38208450.82704037, 21506562.671409357, 11287520.951344468, 31207028.707629155, 38585237.51618704, 37358467.531057134,
      ],
    },
    "1M": {
      xData: [
        1735682400, 1735768800, 1735855200, 1735941600, 1736028000, 1736114400, 1736200800, 1736287200,
        1736373600, 1736460000, 1736546400, 1736632800, 1736719200, 1736805600, 1736892000, 1736978400,
        1737064800, 1737151200, 1737237600, 1737324000, 1737410400, 1737496800, 1737583200, 1737669600,
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        21448919.7042592, 13129396.806487199, 11229505.149675399, 14126651.500460453, 32538229.70858672, 32193408.931353275,
        9519114.308921052, 11213943.086444028, 2385087.3818649976, 31937206.053772476, 28727245.285178587, 10281290.967526961,
        10799408.648133302, 6028306.834877387, 21522892.36940829, 2598063.0484833545, 16747906.362408105, 15853339.760194179,
        35263272.17331292, 3247097.7687312514, 23550141.684581824, 26116683.226115726, 7886806.983286265, 33502814.051269602,
        37358467.531057134, 38208450.82704037, 21506562.671409357, 11287520.951344468, 31207028.707629155, 38585237.51618704, 37358467.531057134,
      ],
    },
    "Full": {
      xData: [
        1675202400, 1677621600, 1680296400, 1682888400, 1685566800, 1688158800, 1690837200, 1693515600,
        1696107600, 1698789600, 1701381600, 1704060000, 1706738400, 1709244000, 1711918800, 1714510800,
        1717189200, 1719781200, 1722459600, 1725138000, 1727730000, 1730412000, 1733004000, 1735682400
      ],
      yData: [
        24673003.774368457, 24332076.879032053, 94074264.81955348, 45232201.253985174, 78205953.19127107, 4813981.414919505,
        7485874.382860777, 98681155.34508994, 27791560.9100051, 41689437.439571775, 27905309.322849564, 54861230.510773145,
        13988807.834374893, 78233647.28302935, 82148134.07969071, 70544161.6449941, 36715500.07306666, 55772084.46790108,
        58208735.036481775, 40992155.116027735, 82417562.70844117, 72987433.81935692, 33243737.603022713, 45001991.08933292
      ],
    },
  };
  const [totalLiquidityView, setTotalLiquidityView] = useState<ChartViewType>('24H');

  // dex total liquidity chart data
  const volumeData: Record<ChartViewType, { xData: string[] | number[]; yData: number[] }> = {
    "24H": {
      xData: [
        1738350000, 1738353600, 1738357200, 1738360800, 1738364400, 1738368000, 1738371600, 1738375200,
        1738378800, 1738382400, 1738386000, 1738389600, 1738393200, 1738396800, 1738400400, 1738404000,
        1738407600, 1738411200, 1738414800, 1738418400, 1738422000, 1738425600, 1738429200, 1738432800
      ],
      yData: [
        159363.65, 1684070.06, 21611.37, 116807.54, 1032380.60, 20576.92, 151315.31, 2832.97,
        182333.19, 189270.81, 20011.36, 11068.69, 63289.52, 60408.43, 7965.73, 14911.46,
        114244.91, 212934.89, 43974.66, 225807.61, 79782.11, 1342533.87, 125326.12, 163123.09
      ],
    },
    "1W": {
      xData: [
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        358467.531057134, 382450.82704037, 2106562.671409357, 1187520.951344468, 37028.707629155, 3885237.51618704, 358467.531057134,
      ],
    },
    "1M": {
      xData: [
        1735682400, 1735768800, 1735855200, 1735941600, 1736028000, 1736114400, 1736200800, 1736287200,
        1736373600, 1736460000, 1736546400, 1736632800, 1736719200, 1736805600, 1736892000, 1736978400,
        1737064800, 1737151200, 1737237600, 1737324000, 1737410400, 1737496800, 1737583200, 1737669600,
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        1448919.7042592, 131996.8067199, 19505.1496399, 146651.500460453, 3238229.70858672, 393408.931353275,
        95114.308921052, 11213943.086444028, 25087.3818649976, 3197206.053772476, 727245.285178587, 102290.967526961,
        799408.648133302, 628306.834877387, 212892.36940829, 25963.0484833545, 1677906.362408105, 1583339.760194179,
        353272.17331292, 37097.7687312514, 250141.684581824, 216683.226115726, 76806.983286265, 335814.051269602,
        358467.531057134, 382450.82704037, 2106562.671409357, 1187520.951344468, 37028.707629155, 3885237.51618704, 358467.531057134,
      ],
    },
    "Full": {
      xData: [
        1675202400, 1677621600, 1680296400, 1682888400, 1685566800, 1688158800, 1690837200, 1693515600,
        1696107600, 1698789600, 1701381600, 1704060000, 1706738400, 1709244000, 1711918800, 1714510800,
        1717189200, 1719781200, 1722459600, 1725138000, 1727730000, 1730412000, 1733004000, 1735682400
      ],
      yData: [
        2467003.774368457, 2432076.879032053, 4074264.81955348, 4522201.253985174, 7820953.19127107, 481981.414919505,
        785874.382860777, 9881155.34508994, 2779150.9100051, 1689437.439571775, 7905309.322849564, 5486130.510773145,
        3988807.834374893, 7823647.28302935, 8248134.07969071, 7054161.6449941, 3715500.07306666, 5572084.46790108,
        5208735.036481775, 4992155.116027735, 8217562.70844117, 7987433.81935692, 3343737.603022713, 4501991.08933292
      ],
    },
  };
  const [totalVolumeView, setTotalVolumeView] = useState<ChartViewType>('24H');

  // dex totals details data
  const initialTotalsRowItems = [
    { label: "Liquidity", value: abbreviateNumber(16312743.09, 0), icon: <PaymentsIcon className='token-row-icon' />, isImage: false },
    { label: "Volume (24h)", value: abbreviateNumber(163123.09, 0), icon: <TimelineIcon className='token-row-icon' />, isImage: false },
    { label: "Fees (24h)", value: abbreviateNumber(47123, 0), icon: <PercentIcon className='token-row-icon' />, isImage: false },
    { label: "Liquidity Pools", value: "324", icon: <WorkspacesIcon className='token-row-icon' />, isImage: false },
    { label: "Tokens", value: "656", icon: <AnimationIcon className='token-row-icon' />, isImage: false },
  ];
  const [totalsRowItems, setTotalsRowItems] = useState(initialTotalsRowItems);

  // dex total liquidity chart data
  const feesPLPData: Record<ChartViewType, { xData: string[] | number[]; yData: number[] }> = {
    "24H": {
      xData: [
        1738350000, 1738353600, 1738357200, 1738360800, 1738364400, 1738368000, 1738371600, 1738375200,
        1738378800, 1738382400, 1738386000, 1738389600, 1738393200, 1738396800, 1738400400, 1738404000,
        1738407600, 1738411200, 1738414800, 1738418400, 1738422000, 1738425600, 1738429200, 1738432800
      ],
      yData: [
        753.44, 670, 353, 262, 592.07, 215, 263, 502, 70.31, 69, 650, 172.29,
        89, 512.76, 488.37, 579.7, 488, 644, 647, 575, 477.46, 570, 236, 120.6
      ],
    },
    "1W": {
      xData: [
        1702, 3430, 3561.11, 9288, 6119, 9351, 6548.890000000003
      ],
      yData: [
        20346.7, 5968, 9145, 6590, 20129, 4022, 3799.300000000003
      ],
    },
    "1M": {
      xData: [
        1735682400, 1735768800, 1735855200, 1735941600, 1736028000, 1736114400, 1736200800, 1736287200,
        1736373600, 1736460000, 1736546400, 1736632800, 1736719200, 1736805600, 1736892000, 1736978400,
        1737064800, 1737151200, 1737237600, 1737324000, 1737410400, 1737496800, 1737583200, 1737669600,
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        777, 2027, 5923, 6873.89, 10593.76, 6367, 9801, 7401.81, 2876.33, 8185.25, 5271,
        9991.48, 9153.59, 3987.8, 9933, 8806, 3920, 9071, 2471, 7874.41, 8479, 7381.1,
        6810.63, 3041.08, 11377.9, 817.77, 1435.9, 10753.01, 1631, 8509.34, 8457.950000000017
      ],
    },
    "Full": {
      xData: [
        1675202400, 1677621600, 1680296400, 1682888400, 1685566800, 1688158800, 1690837200, 1693515600,
        1696107600, 1698789600, 1701381600, 1704060000, 1706738400, 1709244000, 1711918800, 1714510800,
        1717189200, 1719781200, 1722459600, 1725138000, 1727730000, 1730412000, 1733004000, 1735682400
      ],
      yData: [
        29634.88, 69580, 79655.56, 93434.67, 130507.28, 106092.25, 88447, 66559, 71440.46,
        135290.19, 129472.71, 5881.13, 71710.67, 70469.49, 108195.31, 109226.72, 31650,
        29403.31, 85918, 102699.19, 16387.26, 111650, 129740.05, 126954.86999999988
      ],
    },
  };
  const feesBurnData: Record<ChartViewType, { xData: string[] | number[]; yData: number[] }> = {
    "24H": {
      xData: [
        1738350000, 1738353600, 1738357200, 1738360800, 1738364400, 1738368000, 1738371600, 1738375200,
        1738378800, 1738382400, 1738386000, 1738389600, 1738393200, 1738396800, 1738400400, 1738404000,
        1738407600, 1738411200, 1738414800, 1738418400, 1738422000, 1738425600, 1738429200, 1738432800
      ],
      yData: [
        31.08, 6, 49.82, 23, 23.3, 14.94, 48.23, 6.18, 50, 14.54, 46, 40,
        8, 10.39, 43, 49, 9.02, 24, 34, 25, 19.51, 16.34, 21, 12.649999999999977
      ],
    },
    "1W": {
      xData: [
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        114.28, 239, 326.01, 44, 269, 60, 197.7100000000001
      ],
    },
    "1M": {
      xData: [
        1735682400, 1735768800, 1735855200, 1735941600, 1736028000, 1736114400, 1736200800, 1736287200,
        1736373600, 1736460000, 1736546400, 1736632800, 1736719200, 1736805600, 1736892000, 1736978400,
        1737064800, 1737151200, 1737237600, 1737324000, 1737410400, 1737496800, 1737583200, 1737669600,
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        155, 311, 255.28, 308.95, 100.06, 388, 264.35, 394, 128, 243, 94.45, 221, 206,
        123, 172.9, 83.4, 279.64, 361.23, 117, 76.51, 63.36, 174, 82, 107.18, 270.76,
        284.2, 213.33, 373.26, 125.05, 54, 220.08999999999924
      ],
    },
    "Full": {
      xData: [
        1675202400, 1677621600, 1680296400, 1682888400, 1685566800, 1688158800, 1690837200, 1693515600,
        1696107600, 1698789600, 1701381600, 1704060000, 1706738400, 1709244000, 1711918800, 1714510800,
        1717189200, 1719781200, 1722459600, 1725138000, 1727730000, 1730412000, 1733004000, 1735682400
      ],
      yData: [
        1582, 3231.08, 4040.49, 1961.4, 2170, 3585, 811.8, 3644.74, 3159, 4168.43, 1726.96, 1436.69,
        2536, 2797.57, 896, 4040.42, 2344.65, 594, 4174, 3586.23, 1578, 4236.28, 1666.61, 2532.6500000000015
      ],
    },
  };
  const feesStakingData: Record<ChartViewType, { xData: string[] | number[]; yData: number[] }> = {
    "24H": {
      xData: [
        1738350000, 1738353600, 1738357200, 1738360800, 1738364400, 1738368000, 1738371600, 1738375200,
        1738378800, 1738382400, 1738386000, 1738389600, 1738393200, 1738396800, 1738400400, 1738404000,
        1738407600, 1738411200, 1738414800, 1738418400, 1738422000, 1738425600, 1738429200, 1738432800
      ],
      yData: [
        4.55, 16, 34, 33.22, 8, 30, 33, 39, 14.92, 29, 24, 26,
        11.42, 8.73, 28, 27, 33.43, 37, 39, 38, 27.99, 18, 26.69, 38.049999999999955
      ],
    },
    "1W": {
      xData: [
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        242, 196, 111.36, 151, 154, 257, 138.63999999999976
      ],
    },
    "1M": {
      xData: [
        1735682400, 1735768800, 1735855200, 1735941600, 1736028000, 1736114400, 1736200800, 1736287200,
        1736373600, 1736460000, 1736546400, 1736632800, 1736719200, 1736805600, 1736892000, 1736978400,
        1737064800, 1737151200, 1737237600, 1737324000, 1737410400, 1737496800, 1737583200, 1737669600,
        1737756000, 1737842400, 1737928800, 1738015200, 1738101600, 1738188000, 1738274400
      ],
      yData: [
        204, 89.26, 252, 334.14, 71.84, 162.71, 322.68, 297.48, 266, 85.25, 36.07,
        183.95, 254, 299, 194.48, 67.8, 232, 158, 54.87, 335.75, 306, 163, 265.14,
        211.57, 171, 235, 123.86, 179.75, 248, 274.12, 171.28000000000011
      ],
    },
    "Full": {
      xData: [
        1675202400, 1677621600, 1680296400, 1682888400, 1685566800, 1688158800, 1690837200, 1693515600,
        1696107600, 1698789600, 1701381600, 1704060000, 1706738400, 1709244000, 1711918800, 1714510800,
        1717189200, 1719781200, 1722459600, 1725138000, 1727730000, 1730412000, 1733004000, 1735682400
      ],
      yData: [
        756, 953.24, 1282, 2642, 1343.96, 582.38, 3517.54, 3418.95, 2883.24, 3978.52, 1912, 3298.84,
        3496, 1821, 2907, 2800, 3603, 2909.62, 4076, 2283.6, 1880, 4154, 2459.41, 3541.6999999999935
      ],
    },
  };
  const [feesPLPView, setFeesPLPView] = useState<ChartViewType>('24H');
  const [feesBurnView, setFeesBurnView] = useState<ChartViewType>('24H');
  const [feesStakingView, setFeesStakingView] = useState<ChartViewType>('24H');

  // dex pools details data
  const initialPoolsRowItems = [
    { label: "Total Pools", value: '187', icon: <WorkspacesIcon className="token-row-icon" />, isImage: false },
    { label: "Total Liquidity", value: '$' + '987,987,345.2', icon: <PaymentsIcon className='token-row-icon' />, isImage: false },
    { label: "Total Fees (24h)", value: '$' + '876.45', icon: <AccessTimeIcon className='token-row-icon' />, isImage: false },
    { label: "Total Fees (7D)", value: '$' + '6,898.34', icon: <CalendarTodayIcon className='token-row-icon' />, isImage: false },
    { label: "Total Fees (30D)", value: '$' + '45,650.342', icon: <DateRangeIcon className='token-row-icon' />, isImage: false },
    { label: "Total Fees", value: '$' + '1,546,145.98', icon: <MonetizationOnIcon className='token-row-icon' />, isImage: false },
  ];
  const [poolsRowItems, setPoolsRowItems] = useState(initialPoolsRowItems);

  return (
    <div className="analytics-page-height mb-5">
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Analytics</h2>
              <p className='text-white text-justified mb-0'>Gain Insights with Our Analytics Page: track trading volumes, liquidity trends, pools stats and others to make informed decisions. Stay ahead with real-time data and historical analysis.</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* DEX Token details animated row */}
      <div className='mt-5'>
        <TokenRow items={tokenRowItems} />
      </div>

      {/* Dex total liquidity / volume */}
      <Row className='mt-4'>
        <Col xs={12} lg={6} className='mt-3'>
          <LiquidityChart
            xData={liquidityData[totalLiquidityView].xData}
            yData={liquidityData[totalLiquidityView].yData}
            view={totalLiquidityView}
            setView={setTotalLiquidityView}
          />
        </Col>
        <Col xs={12} lg={6} className='mt-3'>
          <VolumeChart
            xData={volumeData[totalVolumeView].xData}
            yData={volumeData[totalVolumeView].yData}
            view={totalVolumeView}
            setView={setTotalVolumeView}
          />
        </Col>
      </Row>

      {/* DEX Totals details animated row */}
      <div className='mt-5'>
        <TokenRow items={totalsRowItems} />
      </div>

      {/* Dex total fees */}
      <Row className='mt-4'>
        <Col xs={12} lg={4} className='mt-3'>
          <FeesChart
            xData={feesPLPData[feesPLPView].xData}
            yData={feesPLPData[feesPLPView].yData}
            view={feesPLPView}
            setView={setFeesPLPView}
            title='Platform & LP rewards from fees'
            subtitle='40% + 40%'
            color1='rgba(13, 240, 153, 0.8)'
            color2='rgba(5, 150, 36, 0.4)'
            tooltipBorderColor='#3FAC5A'
            viewBtnType='btn-intense-success'
          />
        </Col>
        <Col xs={12} lg={4} className='mt-3'>
          <FeesChart
            xData={feesStakingData[feesStakingView].xData}
            yData={feesStakingData[feesStakingView].yData}
            view={feesStakingView}
            setView={setFeesStakingView}
            title='Staking pool rewards from fees'
            subtitle='10%'
          />
        </Col>
        <Col xs={12} lg={4} className='mt-3'>
          <FeesChart
            xData={feesBurnData[feesBurnView].xData}
            yData={feesBurnData[feesBurnView].yData}
            view={feesBurnView}
            setView={setFeesBurnView}
            title='Burn token from fees'
            subtitle='10%'
            color1='rgba(255, 66, 66, 0.8)'
            color2='rgba(220, 30, 30, 0.4)'
            tooltipBorderColor='#e24e4e'
            viewBtnType='btn-intense-danger2'
          />
        </Col>
      </Row>

      {/* Dex total fees */}
      <Row className='mt-4'>
        <Col xs={12} lg={12} className='mt-3'>
          <TokensList />
        </Col>
      </Row>

      {/* DEX Pools details animated row */}
      <div className='mt-5'>
        <TokenRow items={initialPoolsRowItems} />
      </div>
    </div>
  );
}

export default Analytics;