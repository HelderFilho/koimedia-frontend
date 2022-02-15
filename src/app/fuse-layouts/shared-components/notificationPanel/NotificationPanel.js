import FuseScrollbars from '@fuse/core/FuseScrollbars';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import withReducer from 'app/store/withReducer';
import { useSnackbar } from 'notistack';
import { useEffect, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import NotificationModel from './model/NotificationModel';
import NotificationCard from './NotificationCard';
import NotificationTemplate from './NotificationTemplate';
import {
  getNotifications,
  addNotification,
  dismissAll,
  dismissItem,
  selectNotifications,
} from './store/dataSlice';
import reducer from './store';
import { closeNotificationPanel, toggleNotificationPanel } from './store/stateSlice';
import axios from "axios";
import Constants from "app/utils/Constants";
import moment from 'moment'
import Store from 'app/utils/Store'
import CommonDialog from "app/components/dialog/CommonDialog";
import MailingList from 'app/main/mailings/MailingList';
let logged_user = Store.USER

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    width: 320,
  },
}));

let displayed = [];

const storeDisplayed = (id) => {
  displayed = [...displayed, id];
};

const removeDisplayed = (id) => {

  //displayed = [...displayed.filter((key) => id !== key)];
};

function NotificationPanel(props) {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector(({ notificationPanel }) => notificationPanel.state);
  //const notifications = useSelector(selectNotifications);
  const [notifications, setNotifications] = useState([])
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [mailingDialog, setMailingDialog] = useState(false)
  const [fk_id_mailing, setFk_id_mailing] = useState(0)

  setInterval(function () {
    axios.get(Constants.APIEndpoints.MAILING + "/getAllMailings").then(async res => {
      let notifications = await axios.get(Constants.APIEndpoints.NOTIFICATION + '/getDistinctNotification')
      res.data[0].map(async mailing => {
        let now = moment().add(5, 'days')
        let dt_birthday = moment(moment().format('YYYY') + '-' + moment(mailing.dt_birthday).format('MM-DD'))
        if (now.isSameOrAfter(dt_birthday) && dt_birthday.isSameOrAfter(moment())) {
          if (!notifications.data.filter(n => n.fk_id_mailing == mailing.id_mailing)[0]) {
            let data = {
              fk_id_mailing: mailing.id_mailing,
              text: `O aniversário de ${mailing.name} está chegando, será dia ${moment(mailing.dt_birthday).format('DD/MM')}`,
              link: `/mailings`,
              year: moment().format('YYYY')
            }
            await axios.post(Constants.APIEndpoints.NOTIFICATION + '/createNotification', data)
          }

        }
      })
    });
  }
    , 1800000);



  setInterval(function () {
    axios.post(Constants.APIEndpoints.NOTIFICATION + '/getNotificationsByUser', { id_user: logged_user.id_user, notified: false }).then(res => {
      res.data.map(not => {
        dispatch(addNotification(NotificationModel({
          message: not.text,
          link: not.link,
          fk_id_mailing: not.fk_id_mailing,
          options: { variant: 'success' },
        })));

        //          createNotification()
      })
    })
  }
    , 1800000);

  useEffect(() => {
    let notifications_ = []
    axios.post(Constants.APIEndpoints.NOTIFICATION + '/getNotificationsByUser', { id_user: logged_user.id_user, notified: true }).then(res => {
      res.data.map(not => {
        notifications_.push({
          id: not.id_notification,
          message: not.text,
          link: not.link,
          fk_id_mailing: not.fk_id_mailing,
          options: { variant: 'success' },
        })
      });
      setNotifications(notifications_)
      //          createNotification()
    })
  }, [])





  useEffect(() => {
    /*
    Get Notifications from db
     */
    dispatch(getNotifications());

    /*
    Add Notifications for demonstration
     */
    function createNotification(obj) {
      dispatch(addNotification(NotificationModel(obj)));
    }


  }, [dispatch]);

  useEffect(() => {
    notifications.forEach((item) => {
      const { id: key, message, options = {}, dismissed = false } = item;

      if (dismissed) {
        // dismiss snackbar using notistack
        closeSnackbar(key);
        return;
      }
      // do nothing if snackbar is already displayed
      if (displayed.includes(key)) {
        return;
      }

      // display snackbar using notistack
      enqueueSnackbar(message, {
        key,
        ...options,
        // autoHideDuration: 3000,
        content: () => (
          <NotificationTemplate
            item={item}
            onClose={() => {
              closeSnackbar(key);
              dispatch(dismissItem(key));
            }}
          />
        ),
        onClose: (event, reason, myKey) => {
          if (options.onClose) {
            options.onClose(event, reason, myKey);
          }
        },
        onExited: (event, myKey) => { },
      });

      // keep track of snackbars that we've displayed
      storeDisplayed(key);
    });
  }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

  useEffect(() => {
    if (state) {
      dispatch(closeNotificationPanel());
    }
    // eslint-disable-next-line
  }, [location, dispatch]);

  function handleClose() {
    dispatch(closeNotificationPanel());
  }

  function handleClick (notification) {
    console.log('no', notification)
    setMailingDialog(true)
    setFk_id_mailing(notification.fk_id_mailing)
  }

  function handleDismiss(id) {
    let notifications_ = []

    axios.post(Constants.APIEndpoints.NOTIFICATION + '/markNotificationAsRead', { id_user: logged_user.id_user, id_notification: id }).then(res => {
      res.data.map(not => {
        notifications_.push({
          id: not.id_notification,
          message: not.text,
          link: not.link,
          fk_id_mailing: not.fk_id_mailing,
          options: { variant: 'success' },
        })
      });
      setNotifications(notifications_)
      //          createNotification()
    })

    //dispatch(dismissItem(id));
  }
  function handleDismissAll() {

    axios.post(Constants.APIEndpoints.NOTIFICATION + '/markNotificationAsRead', { id_user: logged_user.id_user, id_notification: 0 }).then(res => {
      setNotifications([])
    })


  }

  return (
    <SwipeableDrawer
      classes={{ paper: clsx(classes.root) }}
      open={state}
      anchor="right"
      onOpen={(ev) => { }}
      onClose={(ev) => dispatch(toggleNotificationPanel())}
      disableSwipeToOpen
    >

<CommonDialog
        open={mailingDialog}
        onClose={() => setMailingDialog(false)}
        title="Ver Mailing"
        width = "xl"
      >

<MailingList fk_id_mailing = {fk_id_mailing} />
      </CommonDialog>


      <IconButton className="m-4 absolute top-0 right-0 z-999" onClick={handleClose}>
        <Icon color="action">close</Icon>
      </IconButton>
      {notifications.length > 0 ? (
        <FuseScrollbars className="p-16">
          <div className="flex flex-col">
            <div className="flex justify-between items-end pt-136 mb-36">
              <Typography className="text-28 font-semibold leading-none">Notificações</Typography>
              <Typography
                className="text-12 underline cursor-pointer"
                color="secondary"
                onClick={handleDismissAll}
              >
                Limpar
              </Typography>
            </div>
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                className="mb-16"
                item={item}
                onClose={handleDismiss}
                onClick = {handleClick}
              />
            ))}
          </div>
        </FuseScrollbars>
      ) : (
        <div className="flex flex-1 items-center justify-center p-16">
          <Typography className="text-24 text-center" color="textSecondary">
            Sem notificações por enquanto.
          </Typography>
        </div>
      )}
    </SwipeableDrawer>
  );
}

export default withReducer('notificationPanel', reducer)(memo(NotificationPanel));
