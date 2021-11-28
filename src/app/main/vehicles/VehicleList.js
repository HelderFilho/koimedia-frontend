import { motion } from "framer-motion";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import VehicleForm from "./VechileForm";
import axios from "axios";

import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
import Constants from "app/utils/Constants";
import Store from 'app/utils/Store'

let logged_user = Store.USER

function VehicleList(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({ contactsApp }) => contactsApp.user);
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");
  const [values, setValues] = useState({});
  const [singleVehicle, setSingleVehicle] = useState([])
  const [vehicleDialog, setVehicleDialog] = useState(false)

  const [squares, setSquares] = useState([])
  let squares_ = []

  useEffect(() => {
    axios
    .get(
      Constants.APIEndpoints.SQUARE + "/getAllSquares")
     .then((res) => {
      setSquares(res.data[0])
      squares_ = res.data[0]
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
                viewVehicle(row.original);
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
                deleteUser({ id_user: row.original.id_user });
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


  const viewVehicle = (vehicle) => {
    setVehicleDialog(true)
    let data = [
    {
      col: 12,
      label :'NOME FANTASIA',
      value : vehicle.fancy_name
    },
    {col : 12,
      label : 'RAZÃO SOCIAL',
      value : vehicle.company_name
    },
    {
      col: 4,
      label: 'CNPJ',
      value : vehicle.cnpj
    },
    
    {
      col: 8,
      label: 'CONTATO',
      value : vehicle.contact
    },
    {
      col: 6,
      label: 'TELEFONE',
      value : vehicle.phone
    },
    {
      col: 6,
      label: 'EMAIL',
      value : vehicle.email
    },
    
    {
      col: 12,
      label: 'ENDEREÇO',
      value : vehicle.address
    },
    {
      col: 6,
      label: 'PRAÇA',
      value : squares_.filter(s => s.id_square == vehicle.fk_id_square)[0] ? squares_.filter(s => s.id_square ==  vehicle.fk_id_square)[0].uf : ''
    },

    {
      col: 6,
      label: 'REPRESENTANTE',
      value : vehicle.sponsor
    },
    ]
    
    setSingleVehicle(data)
  }

  const onAdd = () => {
    setValues({})
    setPage("add");
  };

  useEffect(() => {
    getData();
  }, []);

  const deleteUser = (id) => {
    axios.post(Constants.APIEndpoints.VEHICLE + "/deleteVehicle", id).then((res) => {
      getData();
    });
  };

  const getData = () => {
    axios.get(Constants.APIEndpoints.VEHICLE + "/getAllVehicles").then((res) => {
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
        open={vehicleDialog}
        onClose={() => setVehicleDialog(false)}
        title="Ver Veiculo"
        width = "xl"
        print = {true}
      >
        <CommonView  dialog = {true} data = {singleVehicle} title = "Ver Veiculo" onBack = {() => setPage('list')}/>

      </CommonDialog>

      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="directions_car"
          newText="Adicionar Novo Veículo"
          onAdd={!['checking', 'opec', 'financeiro', 'comercial', 'subadmin'].includes(logged_user.role) ? onAdd : null}
          headerTitle = "Veículos"
          onRowClick={(ev, row) => {
            if (row) {
              //            dispatch(openEditContactDialog(row.original));
            }
          }}
        />
      ) : (
        <VehicleForm values={values} setPage={setPage} getData={getData} />
      )}
    </motion.div>
  );
}

export default VehicleList;
