import ProposalList from './ProposalList';

const ProposalConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/products',
      component: ProposalList,
    },
  ],
};

export default ProposalConfig;
