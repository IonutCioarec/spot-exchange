import Dashboard from 'pages/Dashboard';
import Pools from 'pages/Pools';

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
  }
];

export enum RouteNamesEnum {
  home = '/',
  swap = '/swap',
  pools = '/pools'
}
