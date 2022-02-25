import _ from '@lodash';
import FuseUtils from '@fuse/utils';

function NotificationModel(data) {
  data = data || {};

  return _.defaults(data, {
    id: FuseUtils.generateGUID(),
    message: '',
    link: '',
    options: {
      variant: 'default',
    },
  });
}

export default NotificationModel;
