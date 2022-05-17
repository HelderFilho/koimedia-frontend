import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';

import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';

import LoginConfig from 'app/main/login/LoginConfig'
import UsersConfig from 'app/main/users/UserConfig'
import UsersList from 'app/main/users/UserList';
import VehicleConfig from 'app/main/vehicles/VehicleConfig';
import VehicleList from 'app/main/vehicles/VehicleList';

import ClientConfig from 'app/main/clients/ClientConfig';
import ClientList from 'app/main/clients/ClientList';

import AgencyConfig from 'app/main/agencies/AgencyConfig';
import AgencyList from 'app/main/agencies/AgencyList';

import MailingConfig from 'app/main/mailings/MailingConfig';
import MailingList from 'app/main/mailings/MailingList';

import ProductConfig from 'app/main/products/ProductConfig';
import ProductList from 'app/main/products/ProductList';

import SquareConfig from 'app/main/squares/SquareConfig';
import SquareList from 'app/main/squares/SquareList';

import StatusConfig from 'app/main/status/StatusConfig';
import StatusList from 'app/main/status/StatusList';

import ProposalConfig from 'app/main/proposals/ProposalConfig'
import ProposalList from 'app/main/proposals/ProposalList';

import CheckingList from 'app/main/checking/CheckingList';

import OpecList from 'app/main/opec/OpecList';

import Dashboard from 'app/main/dashboard/DashboardForm'
import Home from 'app/main/home/home'

import Store from 'app/utils/Store'

let user = Store.USER
let loggedIn = false;

if (user && user.id_user > 0){
        loggedIn = true;
}


const routeConfigs = [LoginConfig];
const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    exact: true,
    path: '/',
    component: () => loggedIn ? <Home/> : <Redirect to="/login" />,
  },
  {
    path: '/loading',
    exact: true,
    component: () => <FuseLoading />,
  },
  {
    path: '/dashboard',
    exact: true,
        component: () => loggedIn ? <Dashboard /> : <Redirect to = "/login" />,
  },
  {
    path: '/users',
    exact: true,
        component: () => loggedIn ? <UsersList /> : <Redirect to = "/login" />,
  },
  {
    path: '/vehicles',
    exact: true,
    component: () => loggedIn ? <VehicleList /> : <Redirect to = "/login" />,
  },
  {
    path: '/clients',
    exact: true,
    component: () => loggedIn ? <ClientList /> : <Redirect to = "/login" />,
  },
  
  {
    path: '/agencies',
    exact: true,
    component: () => loggedIn ? <AgencyList /> : <Redirect to = "/login" />,
  },
  
  {
    path: '/mailings',
    exact: true,
    component: () => loggedIn ? <MailingList /> : <Redirect to = "/login" />,
  },
  
  {
    path: '/products',
    exact: true,
    component: () => loggedIn ? <ProductList /> : <Redirect to = "/login" />,
  },
  
  {
    path: '/squares',
    exact: true,
    component: () => loggedIn ? <SquareList /> : <Redirect to = "/login" />,
  },
  
  {
    path: '/status',
    exact: true,
    component: () => loggedIn ? <StatusList /> : <Redirect to = "/login" />,
  },
  
  {
    path: '/proposals',
    exact: true,
    component: () => loggedIn ? <ProposalList /> : <Redirect to = "/login" />,
  },

  {
    path: '/pipp',
    exact: true,
    component: () => loggedIn ? <OpecList /> : <Redirect to = "/login" />,
  },

  {
    path: '/checkings',
    exact: true,
    component: () => loggedIn ? <CheckingList /> : <Redirect to = "/login" />,
  },
  
  {
    path: '/home',
    exact: true,
    component: () => loggedIn ? <Home /> : <Redirect to = "/login" />,
  },
  {
    path: '/404',
    component: () => <Error404Page />,
  },
  {
    path: '*',
    component: () => loggedIn ? <CheckingList /> : <Redirect to = "/login" />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
