import ClientList from './ClientList';

const ClientConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/clients',
      component: ClientList,
    },
  ],
};

export default ClientConfig;
