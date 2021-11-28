import MailingList from './MailingList';

const MailingConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/mailings',
      component: MailingList,
    },
  ],
};

export default MailingConfig;
