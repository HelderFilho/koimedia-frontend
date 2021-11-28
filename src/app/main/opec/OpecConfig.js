import OpecList from './OpecList';

const OpecConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/opec',
      component: OpecList,
    },
  ],
};

export default OpecConfig;
