import { useState } from "react";
import CommonHeader from "app/components/table/CommonHeader";
import CommonForm from "app/components/form/CommonForm";
import axios from "axios";
import Constants from "app/utils/Constants";
export default function MailingForm({ values, setPage, getData }) {
  const [valuesForm, setValuesForm] = useState(values)
  let fields = [
    {
      col: 12,
      type: "text",
      name: "name",
      label: "Nome",
      required : true

    },
    {
      col: 6,
      type: "text",
      name: "company_function",
      label: "Função",
    },
    {
      col: 6,
      type: "text",
      name: "email",
      label: "Email",

    },

    {
      col: 4,
      type: "date",
      name: "dt_birthday",
      label: "Data de Nascimento",
    },
    {
      col: 4,
      type: "date",
      name: "dt_start_company",
      label: "Data de início na empresa",
    },

    {
      col: 4,
      type: "text",
      name: "address",
      label: "Endereço",
    },
    {
      col: 12,
      type: "text",
      name: "phone",
      label: "Telefone",
    },
    {
      col: 6,
      type: "select",
      name: "fk_id_type",
      label: "Tipo",
      options: [
        { value: 1, label: "Veículo" },
        { value: 2, label: "Agência" },
        { value: 3, label: "Cliente" },
        { value: 4, label: "Interno" },
      ],
    },

    {
      col: 6,
      label: "Local",
      name: "place",
      type: "text",
    }   
  ];


const onSubmit = () => {
 axios.post(Constants.APIEndpoints.MAILING + (values.id_mailing ? '/updateMailing' : '/createMailing'), valuesForm).then(res => {
  setPage('list')
  getData();
}).catch(error => {
  console.log(error)
})

 
}
 
  return (
    <div>
      <CommonHeader title="Criar Mailing" onBack = {() => setPage('list')}/>
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

