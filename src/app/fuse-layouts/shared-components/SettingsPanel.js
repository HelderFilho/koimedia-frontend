import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseSettings from '@fuse/core/FuseSettings';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { forwardRef, memo, useState } from 'react';
import FuseThemeSchemes from '@fuse/core/FuseThemeSchemes';
import { useSwipeable } from 'react-swipeable';

const Transition = forwardRef(function Transition(props, ref) {
  const theme = useTheme();
  return <Slide direction={theme.direction === 'ltr' ? 'left' : 'right'} ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  buttonWrapper: {
    position: 'absolute',
    height: 80,
    right: 0,
    top: 160,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    opacity: 0.9,
    padding: 0,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
    zIndex: 999,
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[500],
      opacity: 1,
    },
  },
  button: {
    minWidth: 40,
    width: 40,
    height: 40,
    margin: 0,
  },
  settingsButton: {
    '& $buttonIcon': {
      animation: '$rotating 3s linear infinite',
    },
  },
  schemesButton: {},
  '@keyframes rotating': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  buttonIcon: {
    fontSize: 20,
  },
  dialogPaper: {
    position: 'fixed',
    width: 380,
    maxWidth: '90vw',
    backgroundColor: theme.palette.background.paper,
    top: 0,
    height: '100%',
    minHeight: '100%',
    bottom: 0,
    right: 0,
    margin: 0,
    zIndex: 1000,
    borderRadius: 0,
  },
}));

function SettingsPanel() {
  const classes = useStyles();
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handlerOptions = {
    onSwipedLeft: () => {
      return open && theme.direction === 'rtl' && handleClose();
    },
    onSwipedRight: () => {
      return open && theme.direction === 'ltr' && handleClose();
    },
  };

  const settingsHandlers = useSwipeable(handlerOptions);
  const shemesHandlers = useSwipeable(handlerOptions);

  const handleOpen = (panelId) => {
    setOpen(panelId);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <div className={classes.buttonWrapper} id="fuse-settings-schemes">
          </div>
  );
}

export default memo(SettingsPanel);
