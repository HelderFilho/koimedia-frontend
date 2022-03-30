import { useState, Fragment, useEffect } from "react";
import CommonHeader from "app/components/table/CommonHeader";
import CommonForm from "app/components/form/CommonForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import CommonDialog from "app/components/dialog/CommonDialog";
import "./Proposal.css";
import { Button } from "@material-ui/core";
import Input from 'app/components/input/Input'
import Store from 'app/utils/Store'
import moment from 'moment'
import { useResizeDetector } from 'react-resize-detector';

export default function ProposalForm({ values, setPage, getData }) {
  let logged_user = Store.USER
  if (values) {
    values.dt_emission = values.dt_emission ? moment(values.dt_emission).format('YYYY-MM-DD') : ''
    values.dt_start = values.dt_start ? moment(values.dt_start).format('YYYY-MM-DD') : ''
    values.dt_end = values.dt_end ? moment(values.dt_end).format('YYYY-MM-DD') : ''

  }
  const { width, height, ref } = useResizeDetector();

  const [valuesForm, setValuesForm] = useState(values);
  const [productsSelected, setProductsSelected] = useState([]);
  const [openModalProduct, setOpenModalProduct] = useState(false);
  const [valuesProduct, setValuesProduct] = useState([]);

  const [standardDiscount, setStandardDiscount] = useState(20)
  const [grossValueProposal, setGrossValueProposal] = useState(0)
  const [standardDiscountProposal, setStandardDiscountProposal] = useState(0)
  const [netValueProposal, setNetValueProposal] = useState(0)
  const [approvedGrossValue, setApprovedGrossValue] = useState(0)
  const [standardDiscountApproved, setStandardDiscountApproved] = useState(0)
  const [netValueApproved, setNetValueApproved] = useState(0)

  const [agencies, setAgencies] = useState([])
  const [clients, setClients] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [squares, setSquares] = useState([])
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(0)
  useEffect(() => {
    axios
      .get(
        Constants.APIEndpoints.AGENCY + "/getAllAgencies")
      .then((res) => {
        setAgencies(res.data[0])
      })

    axios
      .get(
        Constants.APIEndpoints.CLIENT + "/getAllClients")
      .then((res) => {
        setClients(res.data[0])
      })

    axios
      .get(
        Constants.APIEndpoints.VEHICLE + "/getAllVehicles")
      .then((res) => {
        setVehicles(res.data[0])
      })

    axios
      .get(
        Constants.APIEndpoints.SQUARE + "/getAllSquares")
      .then((res) => {
        setSquares(res.data[0])
      })


    axios
      .get(
        Constants.APIEndpoints.PRODUCT + "/getAllProducts")
      .then((res) => {
        setProducts(res.data[0])
      })


    axios
      .get(
        Constants.APIEndpoints.STATUS + "/getAllStatus")
      .then((res) => {
        setStatus(res.data[0])
      })

    if (values.products) {
      setProductsSelected(JSON.parse(values.products))
    }
    if (values.proposal_values) {
      setGrossValueProposal(values.proposal_values[0].gross_value_proposal)
      setApprovedGrossValue(values.proposal_values[0].approved_gross_value)
      setNetValueApproved(values.proposal_values[0].net_value_approved)
      setNetValueProposal(values.proposal_values[0].net_value_proposal)
      setStandardDiscount(values.proposal_values[0].standard_discount)
      setStandardDiscountApproved(values.proposal_values[0].standard_discount_approved)
      setStandardDiscountProposal(values.proposal_values[0].standard_discount_proposal)
    }
    if (values.fk_id_vehicle) {
      setSelectedVehicle(values.fk_id_vehicle)
    }

  }, [])
  const monthList = [
    { value: 0, label: "Janeiro" },
    { value: 1, label: "Fevereiro" },
    { value: 2, label: "Março" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Maio" },
    { value: 5, label: "Junho" },
    { value: 6, label: "Julho" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Setembro" },
    { value: 9, label: "Outubro" },
    { value: 10, label: "Novembro" },
    { value: 11, label: "Dezembro" },
  ];
  let fieldsProposal = [
    {
      col: 2,
      type: "select",
      name: "month_sell",
      label: "Mês de venda",
      options: monthList,
      required: true,
    },
    {
      col: 5,
      type: "text",
      name: "number",
      label: "Nº PI/PP",
      required: true,
    },
    {
      col: 5,
      type: "date",
      name: "dt_emission",
      label: "Data de emissão",
      required: true
    },

    {
      col: 12,
      type: "select",
      name: "fk_id_client",
      label: "Cliente",
      options: clients.map(c => {
        return {
          value: c.id_client,
          label: c.fancy_name
        }
      }),
    },
    {
      col: 6,
      type: "select",
      name: "fk_id_agency",
      label: "Agência",
      options: agencies.map(ag => {
        return {
          value: ag.id_agency,
          label: ag.fancy_name
        }
      }),
    },
    {
      col: 6,
      type: "text",
      name: "campaign",
      label: "Campanha",
      required: true
    },
    {
      col: 6,
      type: "select",
      name: "fk_id_square",
      label: "Praça de venda",
      options: squares.map(sq => {
        return {
          value: sq.id_square,
          label: sq.uf
        }
      }),
    },
    {
      col: 6,
      type: "select",
      name: "fk_id_status",
      label: "Status",
      options: status.map(st => {
        return {
          value: st.id_status,
          label: st.name
        }
      }),
    },
    {
      col: 2,
      type: "select",
      name: "month_placement",
      label: "Mês de Veiculação",
      options: monthList,
      required: true
    },
    {
      col: 10,
      type: "select",
      name: "fk_id_vehicle",
      label: "Veículo",
      options: vehicles.map(v => {
        return {
          value: v.id_vehicle,
          label: v.fancy_name
        }
      }),
    },
  ];


  let fieldsProposal2 = [
    {
      col: 6,
      type: "text",
      name: "notification_text",
      label: "Texto da Notificação",
    },
    {
      col: 6,
      type: "number",
      name: "notification_frequency",
      label: "Frequência de notificação",
    },
    {
      col: 6,
      type: "file",
      name: "file_pp",
      label: "Arquivo PI/PP",
    },

    {
      col: 6,
      type: "file",
      name: "file_material",
      label: "Arquivo Material",

    },
    {
      col: 12,
      type: "textarea",
      name: "observation",
      label: "Anotações Propostas",
    },
  ];



  let fieldsProduct = [
    {
      col: 12,
      type: "select",
      name: "fk_id_product",
      label: "Produto",
      options: products.filter(p => p.fk_id_vehicle == selectedVehicle).map(p => {
        return {
          value: p.id_product,
          label: p.name
        }
      }),
    },
    {
      col: 12,
      type: "text",
      name: "objective",
      label: "Objetivo",
    },
    {
      col: 12,
      type: "number",
      name: "price",
      label: "Preço",
    },
    {
      col: 12,
      type: "number",
      name: "quantity_hired",
      label: "Quantidade contratada",
    },
    {
      col: 12,
      type: "number",
      name: "negociation",
      label: "Desconto",
    },
    {
      col: 12,
      type: "date",
      name: "dt_start",
      label: "Data Inicial",
    },
    {
      col: 12,
      type: "date",
      name: "dt_end",
      label: "Data Final",
    },
  ];

  const addProduct = (product) => {
    productsSelected.push(product);
    updateValues();
    setOpenModalProduct(false);
    setProductsSelected(productsSelected);
    setValuesProduct([]);
  };

  const changeProduct = (field, id_product, value) => {
    productsSelected.filter((p) => p.fk_id_product == id_product).map((p) => p[field] = value);
    setProductsSelected([...productsSelected]);
    updateValues();
  };

  const updateValues = () => {
  
    let gross_value = productsSelected.reduce((sum, item) => {
      return sum + item.negociation > 0 ? ((item.price - item.price * item.negociation/100) * item.quantity_hired): (item.price * item.quantity_hired)
    }, 0)
    
    let discount_proposal = gross_value * standardDiscount / 100
    let net_proposal = gross_value - discount_proposal
    setGrossValueProposal(gross_value)
    setStandardDiscountProposal(discount_proposal)
    setNetValueProposal(net_proposal)
  }

  const removeProduct = (id_product) => {
    let products_filter = productsSelected.filter((p) => p.fk_id_product != id_product);
    setProductsSelected(products_filter);
  };

  const onSubmit = () => {
    let valuesProposal = {
      standardDiscount: standardDiscount,
      grossValueProposal: grossValueProposal,
      standardDiscountProposal: standardDiscountProposal,
      netValueProposal: netValueProposal,
      approvedGrossValue: approvedGrossValue,
      standardDiscountApproved: standardDiscountApproved,
      netValueApproved: netValueApproved
    }
    valuesForm.fk_id_user = logged_user.id_user
    let values = [valuesForm, productsSelected, valuesProposal]

    axios
      .post(
        Constants.APIEndpoints.PROPOSAL +
        (valuesForm.id_proposals ? "/updateProposal" : "/createProposal"),
        values
      )
      .then((res) => {
        setPage("list");
        getData();
      })
      .catch((error) => {
        setPage("list");
        console.log(error);
      });
  };

  const gross = (v) => {
    setGrossValueProposal(v)
  }

  console.log('********', productsSelected)
  console.log('typeof', typeof(productsSelected))
  return (
    <div ref={ref}>
      <CommonHeader title="Criar Proposta" onBack={() => setPage("list")}
        width={width}
      />
      <CommonForm
        values={valuesForm}
        fields={fieldsProposal}
        onChangeField={(f, v) => {
          values[f.name] = v;
          setValuesForm(values);
          if (f.name == "fk_id_vehicle") {
            setProductsSelected([])
            setSelectedVehicle(v)
          }
        }}
      />

      <Button
        className="whitespace-nowrap"
        variant="contained"
        color="primary"
        onClick={() => setOpenModalProduct(true)}
        style={{ marginLeft: 20 }}
      >
        <span className="hidden sm:flex">Adicionar Produto</span>
      </Button>
      <CommonDialog
        open={openModalProduct}
        onClose={() => setOpenModalProduct(false)}
        title="Adicionar Novo Produto"
        width="xs"
        keep={true}
      >
        <CommonForm
          values={valuesProduct}
          fields={fieldsProduct}
          onChangeField={(f, v) => {
            let newProduct = []
            if (f.name == 'fk_id_product') {
              setValuesProduct([])
              let product = products.filter(p => p.id_product == v)[0]
              newProduct.objective = product.objective
              newProduct.price = parseFloat(product.value)

            }

            newProduct[f.name] = v;

            setValuesProduct(newProduct)
          }}
          onSubmit={addProduct}
        />
      </CommonDialog>

      {productsSelected.length > 0 ? (
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
                <th style={{ color: "black" }}>Remover</th>
              </tr>
            </thead>

            <tbody style={{ backgroundColor: "var(--purple)", width: "100%" }}>
              {productsSelected.map((p) => (
                <tr key={p.fk_id_product} style={{ color: "black" }}>
                  <td style={{ textAlign: "center", height: 40 }}>
                    {products.length > 0 && products.filter(pr => pr.id_product == p.fk_id_product)[0].name}
                  </td>
                  <td className="table_input"><input name="objective_" onChange={(evt) => changeProduct("objective", p.fk_id_product, evt.target.value)} value={p.objective}></input></td>
                  <td className="table_input"><input name="price_" onChange={(evt) => changeProduct("price", p.fk_id_product, evt.target.value)} value={p.price}></input></td>
                  <td className="table_input"><input name="quantity_hired_" onChange={(evt) => changeProduct("quantity_hired", p.fk_id_product, evt.target.value)} value={p.quantity_hired}></input></td>
                  <td className="table_input"><input name="negociation_" onChange={(evt) => changeProduct("negociation", p.fk_id_product, evt.target.value)} value={p.negociation}></input></td>
                  <td className="table_input"><input type="date" name="dt_start_" onChange={(evt) => changeProduct("dt_start", p.fk_id_product, evt.target.value)} value={p.dt_start}></input></td>
                  <td className="table_input"><input type="date" name="dt_end_" onChange={(evt) => changeProduct("dt_end", p.fk_id_product, evt.target.value)} value={p.dt_end}></input></td>
                  <td className="button"><button onClick={() => removeProduct(p.fk_id_product)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div style={{ padding: 20, width: '100%' }}>
        <div style={{ display: 'inline-flex', width: '100%' }}>
          <Input label="Desconto padrão" value={standardDiscount} onchange={(evt) => setStandardDiscount(evt.target.value)} />
          <Input label="Valor Bruto Proposta" money={true} value={(grossValueProposal || 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} onchange={(evt) => gross(evt.target.value)} />
          <Input label="Desconto Padrão Proposta" money={true} value={(standardDiscountProposal || 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} onchange={(evt) => setStandardDiscountProposal(evt.target.value)} />
          <Input label="Valor Líquido Proposta" money={true} value={(netValueProposal || 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} onchange={(evt) => setNetValueProposal(evt.target.value)} />

        </div>
        <div style={{ display: 'inline-flex', width: '100%' }}>

          <Input hidden={true} />

          <Input label="Valor Bruto Aprovado" money={true} value={(approvedGrossValue || 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} onchange={(evt) => setApprovedGrossValue(evt.target.value)} />
          <Input label="Desconto Padrão Aprovado" money={true} value={(standardDiscountApproved || 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} onchange={(evt) => setStandardDiscountApproved(evt.target.value)} />
          <Input label="Valor Líquido Aprovado" money={true} value={(netValueApproved || 0).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })} onchange={(evt) => setNetValueApproved(evt.target.value)} />

        </div>

      </div>
      <CommonForm
        values={valuesForm}
        fields={fieldsProposal2}
        onChangeField={(f, v) => {
          values[f.name] = v;
          setValuesForm(values);
        }}

        onSubmit={onSubmit}
      />

    </div>
  );
}
