import { useState, useEffect } from "react";
import CommonHeader from "app/components/table/CommonHeader";
import CommonForm from "app/components/form/CommonForm";
import axios from "axios";
import Constants from "app/utils/Constants";
function ClientForm({ values, setPage, getData }) {
  const [valuesForm, setValuesForm] = useState(values)
  const [agencies, setAgencies] = useState([])
  useEffect(() => {
    axios
    .get(
      Constants.APIEndpoints.AGENCY + "/getAllAgencies")
     .then((res) => {
      setAgencies(res.data[0])
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
      type: "select",
      name: "fk_id_agency",
      label: "Agência",
      options: agencies.map(v => {
        return {
        value: v.id_agency,
        label: v.fancy_name
        }
      }),

    },

    {
      col: 6,
      label: "Representante",
      name: "sponsor",
      type: "text",
    }   
  ];


const onSubmit = () => {
 axios.post(Constants.APIEndpoints.CLIENT + (values.id_client ? '/updateClient' : '/createClient'), valuesForm).then(res => {
  setPage('list')
  getData();
}).catch(error => {
  console.log(error)
})

 
}
 
  return (
    <div>
      <CommonHeader title="Criar Cliente" onBack = {() => setPage('list')}/>
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

export default ClientForm;
