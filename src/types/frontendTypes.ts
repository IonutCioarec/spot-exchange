export interface PortofolioDataObject {
  name: string;
  value: number;
}

export interface PortofolioChartProps {
  data: PortofolioDataObject[];
}

export interface PortofolioStatsProps {
  data: PortofolioDataObject[];
  balance: number;
}

export interface PortofolioProps {
  data: PortofolioDataObject[];
  rewardsData: PortofolioDataObject[];
  walletBalance: number;
  rewardsBalance: number;
}