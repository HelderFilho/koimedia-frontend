import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from 'app/auth/store/userSlice';
import Store from 'app/utils/Store'
import CommonDialog from "app/components/dialog/CommonDialog";
import axios from 'axios'
import Constants from 'app/utils/Constants';
import './index.css'
let logged_user = Store.USER

function UserMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);

  const [userMenu, setUserMenu] = useState(null);

  const [filesDialog, setFilesDialog] = useState(false)
  const [files, setFiles] = useState([])

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  const handleFiles = () => {
    setFilesDialog(true)
    axios.post(Constants.APIEndpoints.FILES + '/getAllByRole', logged_user).then(res => {
      setFiles(res.data)
    })
  }

  const logout = () => {
    sessionStorage.removeItem('user')
    localStorage.removeItem('user')
    window.location = '/'
  }

  let user_ = Store.USER

  console.log('files', files)
  return (
    <>
      <CommonDialog
        open={filesDialog}
        onClose={() => setFilesDialog(false)}
        title="Arquivos Públicos"
        width="lg"
      >
        <div>

          {files.map(file => (
            <div className='fileList'>
            <label onClick={() => window.open(file.webViewLink, '_blank')} style={{ cursor: 'pointer' }}>{file.name}</label>
            </div>
          ))}
        </div>


      </CommonDialog>

      <Button className="min-h-40 min-w-40 px-0 md:px-16 py-0 md:py-6" onClick={userMenuClick}>
        <div className="hidden md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {user_ ? user_.name : ''}
          </Typography>
          <Typography className="text-11 font-medium capitalize" color="textSecondary">
            {user_ ? user_.fk_id_role.toString().toUpperCase() : ''}
          </Typography>
        </div>

        {user_ && user_.profile_pic ? (
          <Avatar className="md:mx-4" alt="user photo" src={user_.profile_pic} />
        ) : (
          <Avatar className="md:mx-4">{user_ ? user_.name : ''}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        <MenuItem onClick={handleFiles} role="button">
          <ListItemIcon className="min-w-40">
            <Icon>attach_file_icon</Icon>
          </ListItemIcon>
          <ListItemText primary="Arquivos" />
        </MenuItem>
        <MenuItem
              onClick={logout}
            >
              <ListItemIcon className="min-w-40">
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
      </Popover>
    </>
  );
}

export default UserMenu;
