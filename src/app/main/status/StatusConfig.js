import StatusList from './StatusList';

const StatusConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/status',
      component: StatusList,
    },
  ],
};

export default StatusConfig;
