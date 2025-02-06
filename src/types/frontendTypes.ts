export interface PortfolioDataObject {
  name: string;
  value: number;
}

export interface PortfolioChartProps {
  data: PortfolioDataObject[];
}

export interface PortfolioStatsProps {
  data: PortfolioDataObject[];
  balance: number;
}

export interface PortfolioProps {
  data: PortfolioDataObject[];
  rewardsData: PortfolioDataObject[];
  walletBalance: number;
  rewardsBalance: number;
}

export type ChartViewType = '24H' | '1W' | '1M' | 'Full';