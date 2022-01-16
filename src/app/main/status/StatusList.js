import { motion } from "framer-motion";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import StatusForm from "./StatusForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
import Store from 'app/utils/Store'
import ConfirmDialog from "app/components/dialog/ConfirmDialog";

let logged_user = Store.USER
export default function StatusList(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({ contactsApp }) => contactsApp.user);
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");
  const [values, setValues] = useState({});


  const [singleStatus, setSingleStatus] = useState([])
  const [statusDialog, setStatusDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  let [statusSelected, setStatusSelected] = useState([])

  const columns = useMemo(
    () => [
      
      {
        Header: "Nome",
        accessor: "name",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "Setor",
        accessor: "sector",
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
                viewStatus(row.original);
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
            {!['subadmin' ].includes(logged_user.role) ? (   

            <IconButton
              onClick={(ev) => {
                setStatusSelected(row.original)
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

  const onAdd = () => {
    setValues({})
    setPage("add");
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteStatus = (id) => {
    const data = {id_status : statusSelected.id_status}

    axios.post(Constants.APIEndpoints.STATUS + "/deleteStatus", data).then((res) => {
      getData();
    });
  };



  const viewStatus = (status) => {

    setStatusDialog(true)
    let data = [
      {
        col: 12,
        label :'NOME',
        value : status.name
      },
      {col : 12,
        label : 'SETOR',
        value : status.sector
      },
      ]
    
    setSingleStatus(data)
  }



  const getData = () => {
    axios.get(Constants.APIEndpoints.STATUS + "/getAllStatus").then((res) => {
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
<CommonDialog
        open={statusDialog}
        onClose={() => setStatusDialog(false)}
        title="Ver Status"
        width = "xl"
        print = {true}
      >

{deleteDialog ? (
  <ConfirmDialog  title = "Deseja deletar esse Status?" cancel={() => setDeleteDialog(false)} confirm={deleteStatus} />
):null}

        <CommonView  dialog = {true} data = {singleStatus} title = "Ver Status" onBack = {() => setPage('list')}/>

      </CommonDialog>


      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="people"
          newText="Adicionar Novo Status"
          onAdd={onAdd}
          headerTitle = "Status"
          onRowClick={(ev, row) => {
            if (row) {
              //            dispatch(openEditContactDialog(row.original));
            }
          }}
        />
      ) : (
        <StatusForm values={values} setPage={setPage} getData={getData} />
      )}
    </motion.div>
  );
}

