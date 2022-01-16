import { motion } from "framer-motion";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/table/CommonTable";
import ProductForm from "./ProposalForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import Store from 'app/utils/Store'
import CommonView from '../../components/commonView/CommonView'
import CommonDialog from "app/components/dialog/CommonDialog";
import moment from "moment";
import "./Proposal.css";
import Button from "@material-ui/core/Button";
import ConfirmDialog from "app/components/dialog/ConfirmDialog";

let logged_user = Store.USER
export default function ProposalList(props) {
  const dispatch = useDispatch();
  // const user = useSelector(({ contactsApp }) => contactsApp.user);
  const user = [];
  const [data, setData] = useState([]);
  const [page, setPage] = useState("list");
  const [values, setValues] = useState({});

  const [agencies, setAgencies] = useState([])
  const [clients, setClients] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [squares, setSquares] = useState([])

  let agencies_ = []
  let clients_ = []
  let vehicles_ = []
  let users_ = []
  let [proposalSelected, setProposalSelected] = useState([])
  let [products, setProducts] = useState([])
  const [singleProposal, setSingleProposal] = useState([])
  const [singleProposal2, setSingleProposal2] = useState([])
  const [proposalDialog, setProposalDialog] = useState(false)
 
  const [deleteDialog, setDeleteDialog] = useState(false)
  const monthList = [
    "Janeiro" ,
    "Fevereiro" ,
    "Março" ,
    "Abril" ,
    "Maio" ,
    "Junho" ,
    "Julho" ,
    "Agosto" ,
    "Setembro" ,
    "Outubro" ,
     "Novembro" ,
     "Dezembro" ,
  ];

    useEffect(() => {
      axios
      .get(
        Constants.APIEndpoints.AGENCY + "/getAllAgencies")
       .then((res) => {
         agencies_ = res.data[0]
        setAgencies(res.data[0])
      })
  
      axios
      .get(
        Constants.APIEndpoints.USER + "/getAllUsers")
       .then((res) => {
         users_ = res.data[0]
      })
  
      axios
      .get(
        Constants.APIEndpoints.PRODUCT + "/getAllProducts")
       .then((res) => {
        setProducts(res.data[0])
      })
      axios
      .get(
        Constants.APIEndpoints.CLIENT + "/getAllClients")
       .then((res) => {
        clients_ = res.data[0]
        setClients(res.data[0])
      })
  
      axios
      .get(
        Constants.APIEndpoints.VEHICLE + "/getAllVehicles")
       .then((res) => {
         vehicles_ = res.data[0]
        setVehicles(res.data[0])
      })
  
      axios
      .get(
        Constants.APIEndpoints.SQUARE + "/getAllSquares")
       .then((res) => {
        setSquares(res.data[0])
      })
  
  
  
  
  }, [])

useEffect(() => {
  data.map(d => {
    d.vehicle =vehicles.filter(v => v.id_vehicle == d.fk_id_vehicle)[0] ? vehicles.filter(v => v.id_vehicle ==  d.fk_id_vehicle)[0].fancy_name : '' 
    d.client =clients.filter(v => v.id_client == d.fk_id_client)[0] ? clients.filter(v => v.id_client ==  d.fk_id_client)[0].fancy_name : '' 
    d.agency =agencies.filter(v => v.id_agency == d.fk_id_agency)[0] ? agencies.filter(v => v.id_agency ==  d.fk_id_agency)[0].fancy_name : '' 
    d.square =squares.filter(v => v.id_square == d.fk_id_square)[0] ? squares.filter(v => v.id_square ==  d.fk_id_square)[0].uf : '' 
    d.month = monthList[d.month_sell]
  })
}, [data])
  const columns = useMemo(
    () => [
      
      {
        Header: "Campanha",
        accessor: "campaign",
        className: "font-medium",
        sortable: true,
      },
      {
        Header: "Veículo",
        accessor: "vehicle",
        sortable: true,
      },
      {
        Header: "Client",
        accessor: "client",
        sortable: true,
      },
      {
        Header: "Agência",
        accessor: "agency",
        sortable: true,
      },
      {
        Header: "Praça",
        accessor: "square",
        sortable: true,
      },
      {
        Header: "Mês de venda",
        accessor: "month",
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
                setProposalSelected(row.original)
                viewProposal(row.original);
              
              }}
            >
              <Icon>remove_red_eye</Icon>
            </IconButton>


                          {!['opec', 'subadmin' ].includes(logged_user.role) ? (   

            <IconButton
              onClick={(ev) => {
                setValues(row.original)
                setPage('add')
              }}
            >
              <Icon>edit</Icon>
            </IconButton>
                          ):null}
                                        {!['checking', 'opec', 'financeiro', 'subadmin' ].includes(logged_user.role) ? (   

<IconButton

            onClick={(ev) => {
              setProposalSelected(row.original)
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

  const deleteProposal = (id) => {
 const data = {id_proposals : proposalSelected.id_proposals}
    axios.post(Constants.APIEndpoints.PROPOSAL + "/deleteProposal", data).then((res) => {
      setDeleteDialog(false)
      getData();
    });
 
  };

  const viewProposal = (proposal) => {

    setProposalDialog(true)
    let data = [
      {
        isMulti : true,
        col: 3,
        values : [
          {
          label :'Cliente: ',
          value : clients_.filter(c => c.id_client == proposal.fk_id_client)[0].fancy_name
          },
          {
          label :'Razão Social: ',
          value : clients_.filter(c => c.id_client == proposal.fk_id_client)[0].company_name
          },
          {
            label :'CNPJ: ',
            value : clients_.filter(c => c.id_client == proposal.fk_id_client)[0].cnpj
          }
          
        ]
       },
       {
        isMulti : true,
        col: 3,
        values : [
          {
          label :'Agência: ',
          value : agencies_.filter(c => c.id_agency == proposal.fk_id_agency)[0].fancy_name
          },
          {
          label :'Razão Social: ',
          value : agencies_.filter(c => c.id_agency == proposal.fk_id_agency)[0].company_name
          },
          {
            label :'CNPJ: ',
            value : agencies_.filter(c => c.id_agency == proposal.fk_id_agency)[0].cnpj
          }
        ]
       },
       {
        isMulti : true,
        col: 3,
        values : [
          {
          label :'Veículo: ',
          value : vehicles_.filter(c => c.id_vehicle == proposal.fk_id_vehicle)[0].fancy_name
          },
          {
          label :'Razão Social: ',
          value : vehicles_.filter(c => c.id_vehicle == proposal.fk_id_vehicle)[0].company_name
          },
          {
            label :'CNPJ: ',
            value : vehicles_.filter(c => c.id_vehicle == proposal.fk_id_vehicle)[0].cnpj
          }
        ]
       },
       {
        isMulti : true,
        col: 3,
        values : [
          {
          label :'N° PI/PP : ',
          value : proposal.number
          },
          {
          label :'Dt. Emissão: ',
          value : moment(proposal.dt_emission).format('DD/MM/YYYY')
          },
          {
            label :'Dt. Criação: ',
            value : moment(proposal.dt_cad).format('DD/MM/YYYY')
            },
           
        ]
       },
       {
         col : 3,
        label : 'Campanha',
        value : proposal.campaign
      },
       {
        col : 3,
       label : 'Praça',
       value : proposal.square
      },
     {
      col : 3,
      label : 'Mês',
       value : proposal.month
      },
      {
      col : 3,
      label : 'N° Proposta',
      value : proposal.id_proposals
      },
 
      ]
    
    setSingleProposal(data)
      let data2 = [
        {
          col : 12,
          label : 'Usuário',
          value : users_.filter(c => c.id_user == proposal.fk_id_user)[0].name
        },
        {
          col : 12,
          label : 'Anotações',
          value : proposal.observation.replace(/<\/?[^>]+(>|$)/g, "")
        },
    
      ]
      setSingleProposal2(data2)

  }




  const getData = () => {
    axios.get(Constants.APIEndpoints.PROPOSAL + "/getAllProposals").then((res) => {
      setData(res.data[0]);
      console.log(res.data[0])
    });
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
    >
{deleteDialog ? (
  <ConfirmDialog  title = "Deseja deletar essa Proposta?" cancel={() => setDeleteDialog(false)} confirm={deleteProposal} />
):null}


<CommonDialog
        open={proposalDialog}
        onClose={() => setProposalDialog(false)}
        title="Ver Proposta"
        width = "xl"
        print = {true}
      >
        <CommonView  dialog = {true} data = {singleProposal} title = "Ver Proposta" onBack = {() => setPage('list')}/>

        {proposalSelected.products && proposalSelected.products.length > 0 ? (
        <div style={{ padding: 20 }}>
          <table style={{ width: "100%" }}>
            <thead
              style={{ backgroundColor: "var(--purple)", marginBottom: 10 }}
            >
              <tr style={{ color: "black" }}>
                <th style={{ color: "black" }}>Produto</th>
                <th style={{ color: "black" }}>Objetivo</th>
                <th style={{ color: "black" }}>Preço</th>
                <th style={{ color: "black" }}>Qtd. Contratada</th>
                <th style={{ color: "black" }}>Negociação </th>
                <th style={{ color: "black" }}>Dt. Inicial</th>
                <th style={{ color: "black" }}>Dt. Final</th>
              </tr>
            </thead>

            <tbody style={{ backgroundColor: "var(--purple)", width: "100%" }}>
              {proposalSelected.products.map((p) => (
                <tr key = {p.fk_id_product} style={{ color: "black" }}>
                  <td className="table_td">{products.length > 0 && products.filter(pr => pr.id_product == p.fk_id_product)[0].name}</td>
                  <td className="table_td">{p.objective}</td>
                  <td className="table_td">{p.price}</td>
                  <td className="table_td">{p.quantity_hired}</td>
                  <td className="table_td">{p.negociation}</td>
                  <td className="table_td">{moment(p.dt_start).format('DD/MM/YYYY')}</td>
                  <td className="table_td">{moment(p.dt_end).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
         <div>
          <div style={{width: '100%', display: 'flex', marginTop: 10}}>
            <label className="label_values title">Desc. Padrão%</label>
            <label className="label_values title">Valor Bruto Aprovado</label>
            <label className="label_values title">Desconto Padrão Aprovado</label>
            <label  className="label_values title">Valor Líquido Aprovado</label>
          </div>
         <div style={{width: '100%', display: 'flex'}}>
           <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].standard_discount : ''}%</label>
            <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].gross_value_proposal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : ''}</label>
            <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].standard_discount_proposal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}) : ''}</label>
            <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].net_value_proposal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'}): ''} </label>
          </div>
          </div>
        </div>
      ) : null}
          <CommonView  dialog = {true} data = {singleProposal2} />

      </CommonDialog>



      {page == "list" ? (
        <CommonTable
          columns={columns}
          data={data}
          icon="people"
          newText="Adicionar Nova Proposta"
          onAdd={!['opec'].includes(logged_user.role) ? onAdd : null}
          headerTitle = "Propostas"
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

