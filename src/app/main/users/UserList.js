import { motion } from "framer-motion";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import UserForm from "./UserForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
import moment from "moment";
import Store from 'app/utils/Store'
import ConfirmDialog from "app/components/dialog/ConfirmDialog";

let logged_user = Store.USER


function UserList(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({ contactsApp }) => contactsApp.user);
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");
  const [values, setValues] = useState({});

  const [singleUser, setSingleUser] = useState([])
  const [userDialog, setUserDialog] = useState(false)
 

  const [deleteDialog, setDeleteDialog] = useState(false)
  let [userSelected, setUserSelected] = useState([])

  const columns = useMemo(
    () => [
      {
        accessor: "avatar",
        Cell: ({ row }) => {
          return (
            <Avatar
              className="mx-8"
              alt={row.original.name}
              src={row.original.profile_pic}
            />
          );
        },
        className: "justify-center",
        width: 64,
        sortable: false,
      },
      {
        Header: "Nome",
        accessor: "name",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "Local",
        accessor: "place",
        sortable: true,
      },
      {
        Header: "Regra",
        accessor: "rule",
        sortable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        sortable: true,
      },
      {
        Header: "Telefone",
        accessor: "phone",
        sortable: true,
      },
      {
        Header: "Regra",
        accessor: "fk_id_role",
        sortable: true,
      },
      {
        id: "action",
        width: 128,
        sortable: false,
        Cell: ({ row }) => (
          <div className="flex items-center">

          <IconButton
              onClick={(ev) => {
                viewUser(row.original);
              }}
            >
              <Icon>remove_red_eye</Icon>
            </IconButton>
            
            <IconButton
              onClick={(ev) => {
                setValues(row.original)
                setPage('add')
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
           {logged_user.role != 'subadmin' ?(
            <IconButton
              onClick={(ev) => {
                setUserSelected(row.original)
                setDeleteDialog(true)
                   }}
            >
              <Icon>delete</Icon>
            </IconButton>
           ):null}
          
          </div>
        ),
      },
    ],
    [dispatch, user.starred]
  );


  const viewUser = (user) => {
    setUserDialog(true)
    let data = [
    {
      col: 12,
      label :'NOME',
      value : user.name || ''
    },
    {col : 12,
      label : 'EMAIL',
      value : user.email
    },
    {
      col: 12,
      label: 'TELEFONE',
      value : user.phone
    },
    
    {col : 12,
      label : 'LOCAL',
      value : user.place != "undefined" ? user.place : ''
    },
    {
      col: 12,
      label: 'REGRA',
      value : user.fk_id_role
    },
      {
      col: 12,
      label: 'DATA DE NASCIMENTO',
      value : moment(user.dt_birthday).format('DD/MM/YYYY')
    },

    
    ]
    
    setSingleUser(data)
  }



  const onAdd = () => {
    setValues({})
    setPage("add");
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteUser = (id) => {
    const data = {id_user : userSelected.id_user}
    axios.post(Constants.APIEndpoints.USER + "/deleteUser", data).then((res) => {
      getData();
    });
  };

  const getData = () => {
    axios.get(Constants.APIEndpoints.USER + "/getAllUsers").then((res) => {
      setData(res.data[0]);
    });
  };


  if (!data) {
    return null;
  }
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
    >
{deleteDialog ? (
  <ConfirmDialog  title = "Deseja deletar esse Usuário?" cancel={() => setDeleteDialog(false)} confirm={deleteUser} />
):null}

<CommonDialog
        open={userDialog}
        onClose={() => setUserDialog(false)}
        title="Ver Usuário"
        width = "xl"
        print = {true}
      >
        <CommonView  dialog = {true} data = {singleUser} title = "Ver Usuário" onBack = {() => setPage('list')}/>

      </CommonDialog>

      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="account_box"
          newText="Adicionar novo usuário"
          onAdd={onAdd}
          onRowClick={(ev, row) => {
            if (row) {
              //            dispatch(openEditContactDialog(row.original));
            }
          }}
        />
      ) : (
        <UserForm values={values} setPage={setPage} getData={getData} />
      )}
    </motion.div>
  );
}

export default UserList;
