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

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const [allRealized, setAllRealized] = useState(0)
  const [allApproved, setAllAproved] = useState(0)

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
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
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
console.log('data,', data)
  useEffect(() => {
    data.map(d => {
      d.vehicle = vehicles.filter(v => v.id_vehicle == d.fk_id_vehicle)[0] ? vehicles.filter(v => v.id_vehicle == d.fk_id_vehicle)[0].fancy_name : ''
      d.client = clients.filter(v => v.id_client == d.fk_id_client)[0] ? clients.filter(v => v.id_client == d.fk_id_client)[0].fancy_name : ''
      d.agency = agencies.filter(v => v.id_agency == d.fk_id_agency)[0] ? agencies.filter(v => v.id_agency == d.fk_id_agency)[0].fancy_name : ''
      d.square = squares.filter(v => v.id_square == d.fk_id_square)[0] ? squares.filter(v => v.id_square == d.fk_id_square)[0].uf : ''
      d.month = monthList[d.month_sell]
    })
  }, [data])
  const columns = useMemo(
    () => [
      {
        Header: 'Nº PI/PP',
        accessor: "number",
        className: "font-medium",
        sortable: true,
      },
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
        Header: "Cliente",
        accessor: "client",
        sortable: true,
      },
      {
        Header: "Agência",
        accessor: "agency",
        sortable: true,
      },
      {
        Header: "Status",
        accessor: "status_name",
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
                openView(row.original.id_proposals)

              }}
            >
              <Icon>remove_red_eye</Icon>
            </IconButton>

            {!['opec', 'subadmin'].includes(logged_user.role) ? (

              <IconButton
                onClick={(ev) => {
                  openEdit(row.original.id_proposals, true)
                }}
              >
                <Icon>content_copy</Icon>
              </IconButton>
            ) : null}
            {!['opec', 'subadmin'].includes(logged_user.role) ? (

              <IconButton
                onClick={(ev) => {
                  openEdit(row.original.id_proposals, false)
                }}
              >
                <Icon>edit</Icon>
              </IconButton>
            ) : null}
            {!['checking', 'opec', 'financeiro', 'subadmin'].includes(logged_user.role) ? (

              <IconButton

                onClick={(ev) => {
                  setProposalSelected(row.original)
                  setDeleteDialog(true)
                }}
              >
                <Icon>delete</Icon>
              </IconButton>
            ) : null}
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

  const openView = (id_proposals) => {
    const notification = toast("Buscando informações");

    axios.post(Constants.APIEndpoints.PROPOSAL + '/getSingleProposal', { id_proposals: id_proposals }).then(res => {
      toast.dismiss(notification)
      setProposalSelected(res.data)
      viewProposal(res.data);
    })
  }

  const openEdit = (id_proposals, duplicate) => {
    const notification = toast("Buscando informações");

    axios.post(Constants.APIEndpoints.PROPOSAL + '/getSingleProposal', { id_proposals: id_proposals }).then(res => {

      toast.dismiss(notification)
      let values = res.data
      values.duplicate = duplicate
      setValues(res.data)
      setPage('add')
    })
  }

  useEffect(() => {
    getData();
  }, []);

  const deleteProposal = (id) => {
    const data = { id_proposals: proposalSelected.id_proposals }
    axios.post(Constants.APIEndpoints.PROPOSAL + "/deleteProposal", data).then((res) => {
      setDeleteDialog(false)
      getData();
    });

  };

  const viewProposal = (proposal) => {

    setProposalDialog(true)
    let data = [
      {
        isMulti: true,
        col: 3,
        values: [
          {
            label: 'Cliente: ',
            value: proposal.fk_id_client ? clients_.filter(c => c.id_client == proposal.fk_id_client)[0].fancy_name : ''
          },
          {
            label: 'Razão Social: ',
            value: proposal.fk_id_client ? clients_.filter(c => c.id_client == proposal.fk_id_client)[0].company_name : ''
          },
          {
            label: 'CNPJ: ',
            value: proposal.fk_id_client ? clients_.filter(c => c.id_client == proposal.fk_id_client)[0].cnpj : ''
          }

        ]
      },
      {
        isMulti: true,
        col: 3,
        values: [
          {
            label: 'Agência: ',
            value: proposal.fk_id_agency ? agencies_.filter(c => c.id_agency == proposal.fk_id_agency)[0].fancy_name : ''
          },
          {
            label: 'Razão Social: ',
            value: proposal.fk_id_agency ? agencies_.filter(c => c.id_agency == proposal.fk_id_agency)[0].company_name : ''
          },
          {
            label: 'CNPJ: ',
            value: proposal.fk_id_agency ? agencies_.filter(c => c.id_agency == proposal.fk_id_agency)[0].cnpj : ''
          }
        ]
      },
      {
        isMulti: true,
        col: 3,
        values: [
          {
            label: 'Veículo: ',
            value: proposal.fk_id_vehicle ? vehicles_.filter(c => c.id_vehicle == proposal.fk_id_vehicle)[0].fancy_name : ''
          },
          {
            label: 'Razão Social: ',
            value: proposal.fk_id_vehicle ? vehicles_.filter(c => c.id_vehicle == proposal.fk_id_vehicle)[0].company_name : ''
          },
          {
            label: 'CNPJ: ',
            value: proposal.fk_id_vehicle ? vehicles_.filter(c => c.id_vehicle == proposal.fk_id_vehicle)[0].cnpj : ''
          }
        ]
      },
      {
        isMulti: true,
        col: 3,
        values: [
          {
            label: 'N° PI/PP : ',
            value: proposal.number
          },
          {
            label: 'Dt. Emissão: ',
            value: moment(proposal.dt_emission).format('DD/MM/YYYY')
          },
          {
            label: 'Dt. Criação: ',
            value: moment(proposal.dt_cad).format('DD/MM/YYYY')
          },

        ]
      },
      {
        col: 3,
        label: 'Campanha',
        value: proposal.campaign
      },
      {
        col: 3,
        label: 'Praça',
        value: proposal.square
      },
      {
        col: 3,
        label: 'Mês',
        value: proposal.month
      },
      {
        col: 3,
        label: 'N° Proposta',
        value: proposal.id_proposals
      },

    ]

    setSingleProposal(data)
    let data2 = [
      {
        col: 6,
        label: 'Usuário',
        value: proposal.fk_id_user ? users_.filter(c => c.id_user == proposal.fk_id_user)[0].name : ''
      },
      {
        col: 6,
        label: 'Responsável',
        value: proposal.fk_id_responsable ? users_.filter(c => c.id_user == proposal.fk_id_responsable)[0].name : ''
      },
      {
        col: 12,
        label: 'Anotações',
        value: proposal.observation,
        isHTML: true

      },
      {
        col: 12,
        label: 'Arquivos Material',
        values: proposal.file_material || [],
        isFile: true,
      },
      {
        col: 12,
        label: 'Arquivos PI/PP',
        values: proposal.file_pp || [],
        isFile: true,

      }

    ]
    setSingleProposal2(data2)

  }




  const getData = () => {
    axios.get(Constants.APIEndpoints.PROPOSAL + "/getAllProposals").then((res) => {
      setData(res.data[0]);
    });
  };

  const updateRealizedApprovedTotal = (data) => {
    let allRealized_ = data && data.reduce((current, next) => {
      let value = next.proposal_values != null && next.proposal_values[0] ? next.proposal_values[0].gross_value_proposal : 0
      return current + value
    }, 0)

    let allApproved_ = data && data.reduce((current, next) => {
      let value = next.proposal_values != null && next.proposal_values[0] ? next.proposal_values[0].approved_gross_value : 0
      return current + value
    }, 0)
    setAllAproved(allApproved_)
    setAllRealized(allRealized_)
  }


  const underHeader = (
    <div style={{ padding: 10 }}>
      <p style={{ fontSize: 14 }}>Total das Propostas: <strong>{allRealized.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</strong></p>
      <p style={{ fontSize: 14 }}>Total Aprovado: <strong>{allApproved.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</strong></p>
    </div>
  )
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
    >
      {deleteDialog ? (
        <ConfirmDialog title="Deseja deletar essa Proposta?" cancel={() => setDeleteDialog(false)} confirm={deleteProposal} />
      ) : null}


      <CommonDialog
        open={proposalDialog}
        onClose={() => setProposalDialog(false)}
        title="Ver Proposta"
        width="xl"
        print={true}
      >
        <CommonView dialog={true} data={singleProposal} title="Ver Proposta" onBack={() => setPage('list')} />

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
                  <th style={{ color: "black" }}>Valor Final</th>
                </tr>
              </thead>

              <tbody style={{ backgroundColor: "var(--purple)", width: "100%" }}>
                {proposalSelected.products.map((p) => (
                  <tr key={p.fk_id_product} style={{ color: "black" }}>
                    <td className="table_td">{p.name}</td>
                    <td className="table_td">{p.objective}</td>
                    <td className="table_td">{parseFloat(p.price).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                    <td className="table_td">{p.quantity_hired}</td>
                    <td className="table_td">{p.negociation}</td>
                    <td className="table_td">{moment(p.dt_start).format('DD/MM/YYYY')}</td>
                    <td className="table_td">{moment(p.dt_end).format('DD/MM/YYYY')}</td>
                    <td className="table_td">{(p.negociation > 0 ? ((p.price - p.price * p.negociation / 100) * p.quantity_hired) : (p.price * p.quantity_hired)).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <div style={{ width: '100%', display: 'flex', marginTop: 10 }}>
                <label className="label_values" style={{ fontWeight: 'bold' }}>Desc. Padrão%</label>
                <label className="label_values" style={{ fontWeight: 'bold' }}>Valor Bruto Proposta</label>
                <label className="label_values" style={{ fontWeight: 'bold' }}>Desconto Padrão Proposta</label>
                <label className="label_values" style={{ fontWeight: 'bold' }}>Valor Líquido Proposta</label>
              </div>
              <div style={{ width: '100%', display: 'flex' }}>
                <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].standard_discount : ''}%</label>
                <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].gross_value_proposal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : ''}</label>
                <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].standard_discount_proposal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : ''}</label>
                <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].net_value_proposal.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : ''} </label>
              </div>
            </div>
            <div>
              <div style={{ width: '100%', display: 'flex', marginTop: 10 }}>
                <label className="label_values" style={{ fontWeight: 'bold' }}></label>
                <label className="label_values" style={{ fontWeight: 'bold' }}>Valor Bruto Aprovado</label>
                <label className="label_values" style={{ fontWeight: 'bold' }}>Desconto Padrão Aprovado</label>
                <label className="label_values" style={{ fontWeight: 'bold' }}>Valor Líquido Aprovado</label>
              </div>
              <div style={{ width: '100%', display: 'flex' }}>
                <label className="label_values"></label>
                <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].approved_gross_value.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : ''}</label>
                <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].standard_discount_approved.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : ''}</label>
                <label className="label_values">{proposalSelected.proposal_values ? proposalSelected.proposal_values[0].net_value_approved.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }) : ''} </label>
              </div>
            </div>
          </div>
        ) : null}
        <CommonView dialog={true} data={singleProposal2} />

      </CommonDialog>



      {page == "list" ? (
        <div>
          <CommonTable
            underHeader={underHeader}
            columns={columns}
            data={data}
            icon="people"
            updateValues={updateRealizedApprovedTotal}
            newText="Adicionar Nova Proposta"
            onAdd={!['opec'].includes(logged_user.role) ? onAdd : null}
            headerTitle="Propostas"
            onRowClick={(ev, row) => {
              if (row) {
                //            dispatch(openEditContactDialog(row.original));
              }
            }}
          />
        </div>
      ) : (
        <ProductForm values={values} setPage={setPage} getData={getData} />
      )}
      <ToastContainer
        position="bottom-right"
        autoClose={4500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
    </motion.div>
  );
}

