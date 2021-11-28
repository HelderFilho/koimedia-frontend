import { useState, useEffect } from "react";
import CommonHeader from "app/components/table/CommonHeader";
import CommonForm from "app/components/form/CommonForm";
import axios from "axios";
import Constants from "app/utils/Constants";
export default function ProductForm({ values, setPage, getData }) {
  const [valuesForm, setValuesForm] = useState(values)
  const [vehicles, setVehicles] = useState([])
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
      name: "format",
      label: "Formato",
      required : true
    },
    {
      col: 6,
      type: "text",
      name: "objective",
      label: "Objetivo/Descrição",

    },

    {
      col: 4,
      type: "text",
      name: "value",
      label: "Valor",
    },
    {
      col: 6,
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
    {
      col: 6,
      type: "select",
      name: "fk_id_middle",
      label: "Meio",
      options: [
        { value: 1, label: "TV" },
        { value: 2, label: "INTERNET" },
        { value: 3, label: "RADIO" },
        { value: 4, label: "OOH" },
        { value: 5, label: "DOOH" },
        { value: 6, label: "JORNAL" },
        { value: 7, label: "REVIST" },

      ],
    },
  
  ];


const onSubmit = () => {
 axios.post(Constants.APIEndpoints.PRODUCT + (values.id_product ? '/updateProduct' : '/createProduct'), valuesForm).then(res => {
  setPage('list')
  getData();
}).catch(error => {
  console.log(error)
})

 
}
 
  return (
    <div>
      <CommonHeader title="Criar Produto" onBack = {() => setPage('list')}/>
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

