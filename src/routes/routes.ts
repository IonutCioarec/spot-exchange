import Pools from 'pages/Pools';
import Swap from 'pages/Swap';
import Farms from 'pages/Farms';
import CreatePool from 'pages/CreatePool';
import PendingPools from 'pages/PendingPools';
import Admin from 'pages/Admin';
import Analytics from 'pages/Analytics';
import Portfolio from 'pages/Portfolio';
import Tools from 'pages/Tools';
import TokenAssets from 'pages/TokenAssets';

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
  portfolio: '/portfolio',
  swap: '/swap',
  unlock: '/unlock',
  pools: '/pools',
  farms: '/farms',
  createPool: '/create-pool/:pair_id',
  pendingPools: '/pending-pools',
  adminOperations: '/admin-operations',
  analytics: '/analytics',
  tools: '/tools',
  tokenAssets: '/token-assets/:token_id'
};

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: 'Swap',
    component: Swap
  },
  {
    path: routeNames.portfolio,
    title: 'Portfolio',
    component: Portfolio
  },
  {
    path: routeNames.swap,
    title: 'Swap',
    component: Swap
  },
  {
    path: routeNames.pools,
    title: 'Pools',
    component: Pools
  },
  {
    path: routeNames.farms,
    title: 'Farms',
    component: Farms
  },
  {
    path: routeNames.createPool,
    title: 'Create Pool',
    component: CreatePool
  },
  {
    path: routeNames.pendingPools,
    title: 'Create Pool',
    component: PendingPools
  },
  {
    path: routeNames.adminOperations,
    title: 'Admin',
    component: Admin
  },
  {
    path: routeNames.analytics,
    title: 'Analytics',
    component: Analytics
  },
  {
    path: routeNames.tools,
    title: 'Tools',
    component: Tools
  },
  {
    path: routeNames.tokenAssets,
    title: 'Token Assets',
    component: TokenAssets
  }
];

export enum RouteNamesEnum {
  home = '/',
  portfolio = '/portfolio',
  swap = '/swap',
  pools = '/pools',
  farms = '/farms',
  createPool = '/create-pool',
  pendingPools = '/pending-pools',
  adminOperations = '/admin-operations',
  analytics = '/analytics',
  tools = '/tools',
  tokenAssets = '/token-assets/'
}
