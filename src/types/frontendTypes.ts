export interface PortofolioDataObject {
  name: string;
  value: number;
  percentage: number;
}

export interface PortofolioProps {
  data: PortofolioDataObject[];
}