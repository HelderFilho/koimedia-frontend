import CheckingList from './CheckingList';

const CheckingConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/checking',
      component: CheckingList,
    },
  ],
};

export default CheckingConfig;
