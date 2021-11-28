import SquareList from './SquareList';

const SquareConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/squares',
      component: SquareList,
    },
  ],
};

export default SquareConfig;
