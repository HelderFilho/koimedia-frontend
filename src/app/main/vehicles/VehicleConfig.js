import VehicleList from './VehicleList';

const VehicleConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/vehicles',
      component: VehicleList,
    },
  ],
};

export default VehicleConfig;
