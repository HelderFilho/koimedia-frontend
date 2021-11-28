import AgencyList from './AgencyList';

const AgencyConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/agencies',
      component: AgencyList,
    },
  ],
};

export default AgencyConfig;
