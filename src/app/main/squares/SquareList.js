import { motion } from "framer-motion";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import SquareForm from "./SquareForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import Store from 'app/utils/Store'

let logged_user = Store.USER

import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
export default function SquareList(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({ contactsApp }) => contactsApp.user);
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");
  const [values, setValues] = useState({});
  const [singleSquare, setSingleSquare] = useState([])
  const [squareDialog, setSquareDialog] = useState(false)
 
  const columns = useMemo(
    () => [
      
      {
        Header: "Código UF",
        accessor: "cod_uf",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "UF",
        accessor: "uf",
        sortable: true,
      },
      {
        Header: "Unidade Federativa",
        accessor: "federative_unit",
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
                viewSquare(row.original);
              }}
            >
              <Icon>remove_red_eye</Icon>
            </IconButton>
            {!['checking', 'opec', 'financeiro', 'comercial', 'subadmin' ].includes(logged_user.role) ? (   

            <IconButton
              onClick={(ev) => {
                setValues(row.original)
                setPage('add')
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
            ):null}
                          {!['checking', 'opec', 'financeiro', 'comercial', 'subadmin' ].includes(logged_user.role) ? (   

<IconButton
              onClick={(ev) => {
                deleteSquare({ id_square: row.original.id_square });
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

  const deleteSquare = (id) => {
    axios.post(Constants.APIEndpoints.SQUARE + "/deleteSquare", id).then((res) => {
      getData();
    });
  };


  const viewSquare = (square) => {

    setSquareDialog(true)
    let data = [
      {
        col: 12,
        label :'CÓDIGO UF',
        value : square.cod_uf
      },
      {col : 12,
        label : 'UF',
        value : square.uf
      },
      {
        col: 12,
        label: 'UNIDADE FEDERATIVA',
        value : square.federative_unit
      }
      ]
    
    setSingleSquare(data)
  }



  const getData = () => {
    axios.get(Constants.APIEndpoints.SQUARE + "/getAllSquares").then((res) => {
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
        open={squareDialog}
        onClose={() => setSquareDialog(false)}
        title="Ver Praça"
        width = "xl"
        print = {true}
      >
        <CommonView  dialog = {true} data = {singleSquare} title = "Ver Praça" onBack = {() => setPage('list')}/>

      </CommonDialog>


      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="people"
          newText="Adicionar Nova Praça"
          onAdd={!['checking', 'opec', 'financeiro', 'comercial'].includes(logged_user.role) ? onAdd : null}
          headerTitle = "Praças"
          onRowClick={(ev, row) => {
            if (row) {
              //            dispatch(openEditContactDialog(row.original));
            }
          }}
        />
      ) : (
        <SquareForm values={values} setPage={setPage} getData={getData} />
      )}
    </motion.div>
  );
}

