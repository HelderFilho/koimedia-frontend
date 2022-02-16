import { motion } from "framer-motion";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import MailingForm from "./MailingForm";
import moment from "moment";
import axios from "axios";
import Constants from "app/utils/Constants";

import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
import Store from 'app/utils/Store'
import ConfirmDialog from "app/components/dialog/ConfirmDialog";

let logged_user = Store.USER
export default function MailingList(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({ contactsApp }) => contactsApp.user);
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");
  const [values, setValues] = useState({});

  const [singleMailing, setSingleMailing] = useState([])
  const [mailingDialog, setMailingDialog] = useState(false)
 
  const [deleteDialog, setDeleteDialog] = useState(false)
  let [mailingSelected, setMailingSelected] = useState([])


  
  let typeList =  [
    'Indefinido',
    "Veículo",
    "Agência",
    "Cliente",
    "Interno",
  ]

  const columns = useMemo(
    () => [
      
      {
        Header: "Nome",
        accessor: "name",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        sortable: true,
      },
      {
        Header: "Data de Nascimento",
        accessor: "dt_birthday",
        sortable: true,
        Cell: ({row}) => (
          <div className="flex items-center">
            {moment(row.original.dt_birthday).format('DD/MM/YYYY')}
        </div>
        )
      },
      {
        Header: "Telefone",
        accessor: "phone",
        sortable: true,
      },
      {
        Header: "Local",
        accessor: "place",
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
                viewMailing(row.original);
              }}
            >
              <Icon>remove_red_eye</Icon>
            </IconButton>
            {!['opec', 'financeiro', 'comercial' ].includes(logged_user.role) ? (   
         
            <IconButton
              onClick={(ev) => {
                setValues(row.original)
                setPage('add')
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
            ):null}
         
         {!['opec', 'financeiro', 'comercial', 'subadmin' ].includes(logged_user.role) ? (   

<IconButton
              onClick={(ev) => {
                setMailingSelected(row.original)
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
    if (props.fk_id_mailing){
      const data = {id_mailing : props.fk_id_mailing}

      axios.post(Constants.APIEndpoints.MAILING + "/getMailingById", data).then((res) => {
        viewMailing(res.data[0]);
      });
    }
  }, []);




  const deleteMailing = (id) => {
    const data = {id_mailing : mailingSelected.id_mailing}

    axios.post(Constants.APIEndpoints.MAILING + "/deleteMailing", data).then((res) => {
      getData();
    });
  };


  const viewMailing = (mailing) => {
    setMailingDialog(true)
    let data = [
      {
        col: 12,
        label :'NOME',
        value : mailing.name
      },
      {col : 8,
        label : 'FUNÇÃO',
        value : mailing.company_function
      },
      {
        col: 4,
        label: 'EMAIL',
        value : mailing.email
      },
      
      {
        col: 6,
        label: 'DATA DE NASCIMENTO',
        value : moment(mailing.dt_birthday).format('DD/MM/YYYY')
      },
      {
        col: 6,
        label: 'DATA DE INGRESSO NA EMPRESA',
        value : mailing.dt_start_company ? moment(mailing.dt_start_company).format('DD/MM/YYYY') : '-'
      },
      {
        col: 4,
        label: 'TELEFONE',
        value : mailing.phone
      },
      
      {
        col: 8,
        label: 'ENDEREÇO',
        value : mailing.address
      },
      {
        col: 6,
        label: 'TIPO',
        value : typeList[mailing.fk_id_type]
      },
  
      {
        col: 6,
        label: 'LOCAL',
        value : mailing.place
      },
      ]
    
    setSingleMailing(data)
  }

  const getData = () => {
    axios.get(Constants.APIEndpoints.MAILING + "/getAllMailings").then((res) => {
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
        open={mailingDialog}
        onClose={() => setMailingDialog(false)}
        title="Ver Mailing"
        width = "xl"
        print = {true}
      >
{deleteDialog ? (
  <ConfirmDialog  title = "Deseja deletar esse Mailing?" cancel={() => setDeleteDialog(false)} confirm={deleteMailing} />
):null}


        <CommonView  dialog = {true} data = {singleMailing} title = "Ver Mailing" onBack = {() => setPage('list')}/>

      </CommonDialog>

      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="people"
          newText="Adicionar Novo Mailing"
          onAdd={!['checking', 'opec', 'financeiro', 'comercial'].includes(logged_user.role) ? onAdd : null}
          headerTitle = "Mailings"
          onRowClick={(ev, row) => {
            if (row) {
              //            dispatch(openEditContactDialog(row.original));
            }
          }}
        />
      ) : (
        <MailingForm values={values} setPage={setPage} getData={getData} />
      )}
    </motion.div>
  );
}

