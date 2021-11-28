import UserList from './UserList';

const UserConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/users',
      component: UserList,
    },
  ],
};

export default UserConfig;
