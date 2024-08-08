import Home from 'pages/Home';

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
  unlock: '/unlock'
};

export const routes: RouteWithTitleType[] = [
  {
    path: routeNames.home,
    title: 'Home',
    component: Home
  }
];

export enum RouteNamesEnum {
  home = '/',
  swap = '/swap'
}
