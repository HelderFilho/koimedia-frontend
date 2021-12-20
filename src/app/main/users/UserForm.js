import { useState, useEffect } from "react";
import CommonHeader from "app/components/table/CommonHeader";
import CommonForm from "app/components/form/CommonForm";
import axios from "axios";
import Constants from "app/utils/Constants";

function UserForm({ values, setPage, getData }) {
  const [valuesForm, setValuesForm] = useState(values)
  const [vehicles, setVehicles] = useState([])

  if (values){
    values.dt_birthday = values.dt_birthday ? moment(values.dt_birthday).format('YYYY-MM-DD') : ''

  }

  useEffect(() => {
    axios
    .get(
      Constants.APIEndpoints.VEHICLE + "/getAllVehicles")
     .then((res) => {
      setVehicles(res.data[0])
    })


  }, [])

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
      name: "email",
      label: "Email",
      required : true
    },
    {
      col: 6,
      type: "password",
      name: "password",
      label: "Senha",
      required : true,
      visible : values.id_user ? false : true
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
      name: "local",
      label: "Local",
    },

    {
      col: 4,
      type: "date",
      name: "dt_birthday",
      label: "Data de Nascimento",
    },
    {
      col: 12,
      type: "multiselect",
      name: "fk_id_vehicle",
      label: "Veículos",
      options: vehicles.map(v => {
        return {
        value: v.id_vehicle,
        label: v.fancy_name
        }
      }),
    },
    {
      col: 12,
      type: "select",
      name: "fk_id_role",
      label: "Regra",
      options: [
        { value: "admin", label: "Admin" },
        { value: "checking", label: "Checking" },
        { value: "comercial", label: "Comercial" },
        { value: "financeiro", label: "Financeiro" },
        { value: "mailing", label: "Mailing" },
        { value: "opec", label: "Opec" },
        { value: "subadmin", label: "Subadmin" },
      
      
      ],
    },


    {
      col: 1,
      label: "Ativo",
      name: "active",
      type: "checkbox",
    },
    {
      col: 12,
      label: "Foto",
      name: "profile_pic",
      type: "file",
    },
  ];


const onSubmit = () => {
 axios.post(Constants.APIEndpoints.USER + (values.id_user ? '/updateUser' : '/createUser'), valuesForm).then(res => {
  setPage('list')
  getData();
}).catch(error => {
  console.log(error)
})

 
}
 
  return (
    <div>
      <CommonHeader title="Criar Usuário" onBack = {() => setPage('list')}/>
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

export default UserForm;
