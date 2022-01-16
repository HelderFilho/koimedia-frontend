import { motion } from "framer-motion";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import AgencyForm from "./AgencyForm";
import axios from "axios";

import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
import Constants from "app/utils/Constants";
import Store from 'app/utils/Store'
import ConfirmDialog from "app/components/dialog/ConfirmDialog";

let logged_user = Store.USER

export default function AgencyList(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({ contactsApp }) => contactsApp.user);
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");
  const [values, setValues] = useState({});
  const [singleAgency, setSingleAgency] = useState([])
  const [agencyDialog, setAgencyDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  let [agencySelected, setAgencySelected] = useState([])

  let clients_ = []


  useEffect(() => {
    axios
    .get(
      Constants.APIEndpoints.CLIENT + "/getAllClients")
     .then((res) => {
      clients_ = res.data[0]

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
                viewAgency(row.original);
              }}
            >
              <Icon>remove_red_eye</Icon>
            </IconButton>
            {!['checking', 'opec', 'financeiro', 'comercial' ].includes(logged_user.role) ? (   
         
            <IconButton
              onClick={(ev) => {
                setValues(row.original)
                setPage('add')
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
            ): null}
              {!['checking', 'opec', 'financeiro', 'comercial', 'subadmin' ].includes(logged_user.role) ? (   
         
         <IconButton
              onClick={(ev) => {
                setAgencySelected(row.original)
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

  const deleteAgency = (id) => {
    const data = {id_agency : agencySelected.id_agency}

    axios.post(Constants.APIEndpoints.AGENCY + "/deleteAgency", data).then((res) => {
      getData();
    });
  };

  const viewAgency = (agency) => {

    setAgencyDialog(true)
    let data = [
      {
        col: 12,
        label :'NOME FANTASIA',
        value : agency.fancy_name
      },
      {col : 12,
        label : 'RAZÃO SOCIAL',
        value : agency.company_name
      },
      {
        col: 4,
        label: 'CNPJ',
        value : agency.cnpj
      },
      
      {
        col: 8,
        label: 'CONTATO',
        value : agency.contact
      },
      {
        col: 6,
        label: 'TELEFONE',
        value : agency.phone
      },
      {
        col: 6,
        label: 'EMAIL',
        value : agency.email
      },
      
      {
        col: 12,
        label: 'ENDEREÇO',
        value : agency.address
      },
      {
        col: 6,
        label: 'CLIENTES',
        value : clients_.filter(c => c.id_client == agency.fk_id_client)[0] ? clients_.filter(s => s.id_client ==  agency.fk_id_client)[0].fancy_name : ''
      },
  
      {
        col: 6,
        label: 'REPRESENTANTE',
        value : agency.sponsor
      },
      ]
    
    setSingleAgency(data)
  }





  const getData = () => {
    axios.get(Constants.APIEndpoints.AGENCY + "/getAllAgencies").then((res) => {
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
  <ConfirmDialog title = "Deseja deletar essa Agência?" cancel={() => setDeleteDialog(false)} confirm={deleteAgency} />
):null}

<CommonDialog
        open={agencyDialog}
        onClose={() => setAgencyDialog(false)}
        title="Ver Agência"
        width = "xl"
        print = {true}
      >
        <CommonView  dialog = {true} data = {singleAgency} title = "Ver Agência" onBack = {() => setPage('list')}/>

      </CommonDialog>


      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="directions_car"
          newText="Adicionar Nova Agência"
          onAdd={!['checking', 'opec', 'financeiro', 'comercial'].includes(logged_user.role) ? onAdd : null}
          headerTitle = "Agências"
          onRowClick={(ev, row) => {
            if (row) {
              //            dispatch(openEditContactDialog(row.original));
            }
          }}
        />
      ) : (
        <AgencyForm values={values} setPage={setPage} getData={getData} />
      )}
    </motion.div>
  );
}

