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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function ProposalForm({ values, setPage, getData }) {
  console.log('values', values)
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
  const [users, setUsers] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(0)

  const [filesToRemove, setFilesToRemove] = useState([])
  useEffect(() => {
    axios
      .get(
        Constants.APIEndpoints.AGENCY + "/getAllAgencies")
      .then((res) => {
        setAgencies(res.data[0])
      })
    axios
      .get(
        Constants.APIEndpoints.USER + "/getAllUsers")
      .then((res) => {
        setUsers(res.data[0])
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
      handleProducts(values.products)
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
console.log('ussers', users)
  const monthList = [
    { value: 0, label: "Janeiro" },
    { value: 1, label: "Fevereiro" },
    { value: 2, label: "Mar??o" },
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
      label: "M??s de venda",
      options: monthList,
      required: true,
    },
    {
      col: 5,
      type: "text",
      name: "number",
      label: "N?? PI/PP",
      required: true,
    },
    {
      col: 5,
      type: "date",
      name: "dt_emission",
      label: "Data de emiss??o",
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
      label: "Ag??ncia",
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
      label: "Pra??a de venda",
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
      label: "M??s de Veicula????o",
      options: monthList,
      required: true
    },
    {
      col: 10,
      type: "select",
      name: "fk_id_vehicle",
      label: "Ve??culo",
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
      col: 12,
      type: "select",
      name: "fk_id_responsable",
      label: "Usu??rio Respons??vel",
      options: users.filter(u => u.fk_id_role == 'admin' || u.fk_id_role == 'comercial' || u.fk_id_role == 'subadmin').map(v => {
        return {
          value: v.id_user,
          label: v.name
        }
      }),
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
      label: "Anota????es Propostas",
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
      label: "Pre??o",
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


  const handleProducts = (products) => {
    products.map((product, i) => {
      let value = product.negociation > 0 ? ((product.price - product.price * product.negociation / 100) * product.quantity_hired) : (product.price * product.quantity_hired)
      product.key = i
      product.final_value = value
    })


    setProductsSelected([...products])
  }

  const addProduct = (product) => {
    product.key = productsSelected.length
    product.final_value = product.negociation > 0 ? ((product.price - product.price * product.negociation / 100) * product.quantity_hired) : (product.price * product.quantity_hired)
    productsSelected.push(product);
    updateValues();
    setOpenModalProduct(false);
    setProductsSelected(productsSelected);
    setValuesProduct([]);
  };

  const changeProduct = (field, id_product, value) => {
    productsSelected.filter((p) => p.key == id_product).map((p) => p[field] = value);
    setProductsSelected([...productsSelected]);
    calcFinalValue();
    updateValues();
  };

  const calcFinalValue = () => {

    productsSelected.map(product => {
      let value = product.negociation > 0 ? ((product.price - product.price * product.negociation / 100) * product.quantity_hired) : (product.price * product.quantity_hired)
      product.final_value = value
    })
    setProductsSelected([...productsSelected])
  }
  const updateValues = () => {

    let gross_value = productsSelected.reduce((sum, item) => {
      let price = parseFloat(item.price)
      let negociation = parseFloat(item.negociation)
      let quantity_hired = parseInt(item.quantity_hired)
      return sum + (negociation > 0 ? ((price - price * negociation / 100) * quantity_hired) : (price * quantity_hired))
    }, 0)
    let discount_proposal = (gross_value * standardDiscount / 100).toFixed(2).replace('.', ',')
    let net_proposal = gross_value - discount_proposal
    setGrossValueProposal(gross_value)
    setApprovedGrossValue(gross_value)

    setStandardDiscountProposal(discount_proposal)
    setStandardDiscountApproved(discount_proposal)

    setNetValueApproved(net_proposal)
    setNetValueProposal(net_proposal)
  }

  const removeProduct = (id_product) => {
    let products_filter = productsSelected.filter((p) => p.key != id_product);
    products_filter.map((p, i) => p.key = i)
    setProductsSelected(products_filter);
    updateValues();
  };

  useEffect(() => {
    let gross_value = grossValueProposal ? grossValueProposal.toString().replace('R$', '').replaceAll('.', '').replace(',', '.') : 0
    let standard_discount = (grossValueProposal * standardDiscount / 100).toFixed(2)
    let net_proposal = (grossValueProposal - standard_discount).toFixed(2)
    setStandardDiscountProposal(standard_discount.replace('.', ','))
    setNetValueProposal(net_proposal.replace('.', ','))


    let approved_value = approvedGrossValue ? (approvedGrossValue.toString().replace('R$', '').replaceAll('.', '').replace(',', '.')) : 0
    let discount_approved = (approvedGrossValue * standardDiscount / 100).toFixed(2)
    let net_approved = (approvedGrossValue - discount_approved).toFixed(2)

    setStandardDiscountApproved(discount_approved.replace('.', ','))
    setNetValueApproved(net_approved.replace('.', ','))

  }, [grossValueProposal, approvedGrossValue])


  const onSubmit = () => {
    const notification = toast("Salvando dados");

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
    let values = [valuesForm, productsSelected, valuesProposal, filesToRemove, logged_user]

    axios
      .post(
        Constants.APIEndpoints.PROPOSAL +
        (valuesForm.id_proposals && !valuesForm.duplicate ? "/updateProposal" : "/createProposal"),
        values
      )
      .then((res) => {
        toast.update(notification, { render: "Dados salvos com sucesso", type: toast.TYPE.SUCCESS, isLoading: false });
        setTimeout(function () {
          setPage("list");
          getData();
        }, 2000)
       
      })
      .catch((error) => {
        toast.update(notification, { render: "Erro ao salvar dos dados", type: toast.TYPE.ERROR, isLoading: false });

      });
  };


  const removeFile = (field, file) => {
    let files = filesToRemove
    files.push(file)
    setFilesToRemove(files)
    valuesForm[field] = valuesForm[field].filter(v => v.id != file.id)
    setValuesForm({ ...valuesForm })
  }
  return (
    <div ref={ref}>
      <CommonHeader title={values.id_proposals && values.duplicate == true ? "Duplicar Proposta" : values.id_proposals && values.duplicate == false ? "Editar Proposta" : "Criar Proposta"} onBack={() => setPage("list")}
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
              newProduct.name = product.name
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
                <th style={{ color: "black" }}>Pre??o</th>
                <th style={{ color: "black" }}>Qtd. Contratada</th>
                <th style={{ color: "black" }}>Negocia????o </th>
                <th style={{ color: "black" }}>Dt. Inicial</th>
                <th style={{ color: "black" }}>Dt. Final</th>
                <th style={{ color: "black" }}>Valor Final</th>
                <th style={{ color: "black" }}>Remover</th>
              </tr>
            </thead>

            <tbody style={{ backgroundColor: "var(--purple)", width: "100%" }}>
              {productsSelected.map((p, i) => (
                <tr key={p.fk_id_product} style={{ color: "black" }}>
                  <td className="table_input">
                    <input name="product_name" onChange={(evt) => changeProduct('name', i, evt.target.value)} value={p.name}></input>
                  </td>
                  <td className="table_input"><input name="objective_" onChange={(evt) => changeProduct("objective", i, evt.target.value)} value={p.objective}></input></td>
                  <td className="table_input"><input type="number" step="any" name="price_" onChange={(evt) => changeProduct("price", i, evt.target.value)} value={p.price}></input></td>
                  <td className="table_input"><input name="quantity_hired_" onChange={(evt) => changeProduct("quantity_hired", i, evt.target.value)} value={p.quantity_hired}></input></td>
                  <td className="table_input"><input name="negociation_" onChange={(evt) => changeProduct("negociation", i, evt.target.value)} value={p.negociation}></input></td>
                  <td className="table_input"><input type="date" name="dt_start_" onChange={(evt) => changeProduct("dt_start", i, evt.target.value)} value={p.dt_start}></input></td>
                  <td className="table_input"><input type="date" name="dt_end_" onChange={(evt) => changeProduct("dt_end", i, evt.target.value)} value={p.dt_end}></input></td>
                  <td className="table_input"><input type="number" name="final_value" disabled value={p.final_value.toFixed(2)}></input></td>
                  <td className="button"><button onClick={() => removeProduct(i)}>X</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div style={{ padding: 20, width: '100%' }}>
        <div style={{ display: 'inline-flex', width: '100%' }}>
          <Input label="Desconto padr??o" value={standardDiscount} onchange={(evt) => setStandardDiscount(evt.target.value)} />
          <Input label="Valor Bruto Proposta" money={true} value={grossValueProposal} onchange={(evt) => setGrossValueProposal(evt.target.value)} />
          <Input label="Desconto Padr??o Proposta" money={true} value={standardDiscountProposal} onchange={(evt) => setStandardDiscountProposal(evt.target.value)} />
          <Input label="Valor L??quido Proposta" money={true} value={netValueProposal} onchange={(evt) => setNetValueProposal(evt.target.value)} />

        </div>
        <div style={{ display: 'inline-flex', width: '100%' }}>

          <Input hidden={true} />

          <Input label="Valor Bruto Aprovado" money={true} value={approvedGrossValue} onchange={(evt) => setApprovedGrossValue(evt.target.value)} />
          <Input label="Desconto Padr??o Aprovado" money={true} value={standardDiscountApproved} onchange={(evt) => setStandardDiscountApproved(evt.target.value)} />
          <Input label="Valor L??quido Aprovado" money={true} value={netValueApproved} onchange={(evt) => setNetValueApproved(evt.target.value)} />

        </div>

      </div>
      <CommonForm
        values={valuesForm}
        fields={fieldsProposal2}
        onChangeField={(f, v) => {
          values[f.name] = v;
          setValuesForm(values);
        }}
        removeFile={removeFile}
        onSubmit={onSubmit}
      />
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
    </div>
  );
}
