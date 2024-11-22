import Dashboard from 'pages/Dashboard';
import Pools from 'pages/Pools';
import Swap from 'pages/Swap';
import Farms from 'pages/Farms';

interface RouteWithTitleType extends RouteType {
  title: string;
}
export interface RouteType {
  path: string;
  component: any;
  authenticatedRoute?: boolean;
}

export const routeNames = {
  home: '/',
  unlock: '/unlock',
  pools: '/pools',
  swap: '/swap',
  farms: '/farms'
};

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: 'Dashboard',
    component: Dashboard
  },
  {
    path: routeNames.pools,
    title: 'Pools',
    component: Pools
  },
  {
    path: routeNames.swap,
    title: 'Swap',
    component: Swap
  },
  {
    path: routeNames.farms,
    title: 'Farms',
    component: Farms
  }
];

export enum RouteNamesEnum {
  home = '/',
  swap = '/swap',
  pools = '/pools',
  farms = '/farms'
}
