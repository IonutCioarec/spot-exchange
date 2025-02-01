import 'assets/scss/analytics.scss';
import { Row, Col } from 'react-bootstrap';
import Badge from '@mui/material/Badge';
import EChartsPseudo3DExample from 'components/EChartsPseudo3DExample';
import LiquidityChart from 'components/Analytics/LiquidityChart';
import VolumeChart from 'components/Analytics/VolumeChart';
import Portofolio from 'components/Analytics/Portofolio';
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

const Analytics = () => {
  // user portofolio data
  const portofolioData = [
    { name: 'Tokens', value: 300.78 },
    { name: 'Pools', value: 100 },
    { name: 'Farms', value: 153 },
  ];

  // user rewards portofolio data
  const rewardsData = [
    { name: 'Fees', value: 84.36 },
    { name: 'Boosted Farms', value: 26.07 },
    { name: 'Farms', value: 43.35 },
  ];

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

  return (
    <div className="analytics-page-height mb-5">
      <Row id='topSection'>
        <Col xs={12}>
          <div className='b-r-sm d-flex align-items-center justify-content-center mt-4' style={{ backgroundColor: 'rgba(32,32,32, 0.5)', minHeight: '100px' }}>
            <div className='p-5'>
              <h2 className='text-white text-center'>Analytics</h2>
              <p className='text-white text-justified mb-0'>Gain Insights with Our Analytics Page: real-time portfolio updates, track trading volumes, liquidity trends, pools stats and others to make informed decisions. Stay ahead with real-time data and historical analysis.</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* User portofolio */}
      <div>
        <Portofolio data={portofolioData} rewardsData={rewardsData} walletBalance={453.78} rewardsBalance={153.78} />
      </div>

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
    </div>
  );
}

export default Analytics;