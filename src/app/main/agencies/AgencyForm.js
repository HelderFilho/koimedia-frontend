import { useState, useEffect } from "react";
import CommonHeader from "app/components/table/CommonHeader";
import CommonForm from "app/components/form/CommonForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import { useResizeDetector } from 'react-resize-detector';

export default function AgencyForm({ values, setPage, getData }) {
  const [valuesForm, setValuesForm] = useState(values)
  const [clients, setClients] = useState([])
  const { width, height, ref } = useResizeDetector();

  useEffect(() => {
    axios
    .get(
      Constants.APIEndpoints.CLIENT + "/getAllClients")
     .then((res) => {
      setClients(res.data[0])
    })


  }, [])


  let fields = [
    {
      col: 12,
      type: "text",
      name: "fancy_name",
      label: "Nome Fantasia",
      required : true

    },
    {
      col: 6,
      type: "text",
      name: "company_name",
      label: "Razão Social",
      required : true
    },
    {
      col: 6,
      type: "text",
      name: "cnpj",
      label: "CNPJ",
      format:'##.###.###/#####-##',

    },

    {
      col: 4,
      type: "text",
      name: "contat",
      label: "Contato",
    },
    {
      col: 4,
      type: "text",
      name: "phone",
      label: "Telefone",
    },

    {
      col: 4,
      type: "text",
      name: "email",
      label: "Email",
    },
    {
      col: 12,
      type: "text",
      name: "address",
      label: "Endereço",
    },
    {
      col: 6,
      type: "multiselect",
      name: "fk_id_client",
      label: "Clientes",
      options: clients.map(v => {
        return {
        value: v.id_client,
        label: v.fancy_name
        }
      }),
    },

  ];


const onSubmit = () => {
 axios.post(Constants.APIEndpoints.AGENCY + (values.id_agency ? '/updateAgency' : '/createAgency'), valuesForm).then(res => {
  setPage('list')
  getData();
}).catch(error => {
  console.log(error)
})

 
}
 
  return (
    <div       ref={ref}>
      <CommonHeader 
      title="Criar Agência" 
      width = {width}
      onBack = {() => setPage('list')}/>
      <CommonForm
        values={valuesForm}
        fields={fields}
        onChangeField={(f, v) => {
          values[f.name] = v;
          setValuesForm(values)
        }}
         onSubmit={onSubmit}
      />
     
    </div>
  );
}

