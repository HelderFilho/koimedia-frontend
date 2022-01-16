import { motion } from "framer-motion";
import Icon from "@material-ui/core/Icon";
import {} from '@material-ui/data-grid'
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import ProductForm from "./ProductForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
import Store from 'app/utils/Store'
import ConfirmDialog from "app/components/dialog/ConfirmDialog";

let logged_user = Store.USER

export default function ProductList(props) {
  const dispatch = useDispatch();
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");

  const [values, setValues] = useState({});
  const [vehicles, setVehicles] = useState([])
 
  const [singleProduct, setSingleProduct] = useState([])
  const [productDialog, setProductDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  let [productSelected, setProductSelected] = useState([])

  let vehicles_ = []

  let middleList = [
  "TV",
  "INTERNET",
  "RADIO",
  "OOH",
  "DOOH",
  "JORNAL",
  "REVIST",

]


  useEffect(() => {
    axios
    .get(
      Constants.APIEndpoints.VEHICLE + "/getAllVehicles")
     .then((res) => {
      setVehicles(res.data[0])
      vehicles_ = res.data[0]

    })
  }, [])


useEffect(() => {
  data.map(d => {
    d.vehicle =vehicles.filter(v => v.id_vehicle == d.fk_id_vehicle)[0] ? vehicles.filter(v => v.id_vehicle ==  d.fk_id_vehicle)[0].fancy_name : '' 
  })
}, [data])




  const columns = useMemo(
    () => [
      
      {
        Header: "Nome",
        accessor: "name",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "Veículo",
        accessor: "vehicle",
        sortable: true,
      },
      {
        Header: "Formato",
        accessor: "format",
        sortable: true,
      },
      {
        Header: "Objetivo/Descrição",
        accessor: "objective",
        sortable: true,
      },
      {
        Header: "Valor",
        accessor: "value",
        sortable: true,
      },
      {
        Header: "Meio",
        accessor: "fk_id_middle",
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
                viewProduct(row.original);
              }}
            >
              <Icon>remove_red_eye</Icon>
            </IconButton>

            {!['checking', 'financeiro' ].includes(logged_user.role) ? (   

                <IconButton
              onClick={(ev) => {
             
                setValues(row.original)
                setPage('form')
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
            ):null}

{!['checking', 'opec', 'financeiro', 'comercial', 'subadmin' ].includes(logged_user.role) ? (   
            <IconButton
              onClick={(ev) => {
                setProductSelected(row.original)
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
    setPage("form");
  };

  useEffect(() => {
    getData();
  }, []);


  const deleteProduct = (id) => {
    const data = {id_product : productSelected.id_product}

    axios.post(Constants.APIEndpoints.PRODUCT + "/deleteProduct", data).then((res) => {
      getData();
    });
  };




  const viewProduct = (product) => {

    setProductDialog(true)
    let data = [
    {
      col: 12,
      label :'NOME',
      value : product.name
    },
    {col : 6,
      label : 'FORMATO',
      value : product.format
    },
    {
      col: 6,
      label: 'OBJETIVO',
      value : product.objective
    },
    {
      col: 4,
      label: 'PREÇO',
      value : (parseFloat(product.value)).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    },
    {
      col: 4,
      label: 'MEIO',
      value : middleList[product.fk_id_middle]
    },
    
    {
      col: 4,
      label: 'VEÍCULO',
      value : vehicles_.filter(v => v.id_vehicle == product.fk_id_vehicle)[0] ? vehicles_.filter(v => v.id_vehicle ==  product.fk_id_vehicle)[0].fancy_name : ''
    },
    
    ]
    
    setSingleProduct(data)
  }


  const getData = () => {
    axios.get(Constants.APIEndpoints.PRODUCT + "/getAllProducts").then((res) => {
      setData(res.data[0]);
    });
  };
  if (!data) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
    >

<CommonDialog
        open={productDialog}
        onClose={() => setProductDialog(false)}
        title="Ver Produto"
        width = "xl"
        print = {true}
      >

{deleteDialog ? (
  <ConfirmDialog  title = "Deseja deletar esse Produto?" cancel={() => setDeleteDialog(false)} confirm={deleteProduct} />
):null}

        <CommonView  dialog = {true} data = {singleProduct} title = "Ver Produto" onBack = {() => setPage('list')}/>

      </CommonDialog>



      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="people"
          newText="Adicionar Novo Produto"
          onAdd={!['checking', 'financeiro'].includes(logged_user.role) ? onAdd : null}
          headerTitle = "Produtos"
          onRowClick={(ev, row) => {
            if (row) {
              //            dispatch(openEditContactDialog(row.original));
            }
          }}
        />
      ) : (
        <ProductForm values={values} setPage={setPage} getData={getData} />
      )}
        </motion.div>
  );
}

