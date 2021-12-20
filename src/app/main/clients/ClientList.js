import { motion } from "framer-motion";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import ClientForm from "./ClientForm";
import axios from "axios";
import Constants from "app/utils/Constants";

import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
import Store from 'app/utils/Store'

let logged_user = Store.USER

function ClientList(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({ contactsApp }) => contactsApp.user);
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");
  const [values, setValues] = useState({});

  const [singleClient, setSingleClient] = useState([])
  const [clientDialog, setClientDialog] = useState(false)
 
  let agencies_ = []


  useEffect(() => {
    axios
    .get(
      Constants.APIEndpoints.CLIENT + "/getAllClients")
     .then((res) => {
       console.log('rrr', res.data[0])
      agencies_ = res.data[0]

    })
  }, [])

  const columns = useMemo(
    () => [
      
      {
        Header: "Nome Fantasia",
        accessor: "fancy_name",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "Razão Social",
        accessor: "company_name",
        sortable: true,
      },
      {
        Header: "CNPJ",
        accessor: "cnpj",
        sortable: true,
      },
      {
        Header: "Contato",
        accessor: "contact",
        sortable: true,
      },
      {
        Header: "Representante",
        accessor: "sponsor",
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
                viewClient(row.original);
              }}
            >
              <Icon>remove_red_eye</Icon>
            </IconButton>

           {!['checking', 'opec', 'comercial' ].includes(logged_user.role) ? (   
            <IconButton
              onClick={(ev) => {
                setValues(row.original)
                setPage('add')
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
           ):null}
           {!['checking','opec', 'financeiro', 'comercial'].includes(logged_user.role) ? (   
           
            <IconButton
              onClick={(ev) => {
                deleteClient({ id_client: row.original.id_client });
              }}
            >
              <Icon>delete</Icon>
            </IconButton>
           ): null }
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

  const deleteClient = (id_client) => {
    axios.post(Constants.APIEndpoints.CLIENT + "/deleteClient", id_client).then((res) => {
      getData();
    });
  };

    
  const viewClient = (client) => {

    setClientDialog(true)
    let data = [
      {
        col: 12,
        label :'NOME FANTASIA',
        value : client.fancy_name
      },
      {col : 12,
        label : 'RAZÃO SOCIAL',
        value : client.company_name
      },
      {
        col: 4,
        label: 'CNPJ',
        value : client.cnpj
      },
      
      {
        col: 8,
        label: 'CONTATO',
        value : client.contact
      },
      {
        col: 6,
        label: 'TELEFONE',
        value : client.phone
      },
      {
        col: 6,
        label: 'EMAIL',
        value : client.email
      },
      
      {
        col: 12,
        label: 'ENDEREÇO',
        value : client.address
      },
      {
        col: 6,
        label: 'AGÊNCIA',
        value : agencies_.filter(a => a.id_agency == client.fk_id_agency)[0] ? agencies_.filter(a => a.id_agency ==  client.fk_id_agency)[0].fancy_name : ''
      },
  
      {
        col: 6,
        label: 'REPRESENTANTE',
        value : client.sponsor
      },
      ]
    
    setSingleClient(data)
  }




  const getData = () => {
    axios.get(Constants.APIEndpoints.CLIENT + "/getAllClients").then((res) => {
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
        open={clientDialog}
        onClose={() => setClientDialog(false)}
        title="Ver Client"
        width = "xl"
        print = {true}
      >
        <CommonView  dialog = {true} data = {singleClient} title = "Ver Client" onBack = {() => setPage('list')}/>

      </CommonDialog>

      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="people"
          newText="Adicionar Novo Cliente"
          onAdd={!['checking', 'opec', 'comercial', 'subadmin'].includes(logged_user.role) ? onAdd : null}
          headerTitle = "Clientes"
          onRowClick={(ev, row) => {
            if (row) {
              //            dispatch(openEditContactDialog(row.original));
            }
          }}
        />
      ) : (
        <ClientForm values={values} setPage={setPage} getData={getData} />
      )}
    </motion.div>
  );
}

export default ClientList;
