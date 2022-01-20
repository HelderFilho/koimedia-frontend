import { useState } from "react";
import CommonHeader from "app/components/table/CommonHeader";
import CommonForm from "app/components/form/CommonForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import { useResizeDetector } from 'react-resize-detector';

export default function StatusForm({ values, setPage, getData }) {
  const [valuesForm, setValuesForm] = useState(values)
  const { width, height, ref } = useResizeDetector();

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
      name: "sector",
      label: "Setor",
      required : true
    },
    ];


const onSubmit = () => {
 axios.post(Constants.APIEndpoints.STATUS + (values.id_status ? '/updateStatus' : '/createStatus'), valuesForm).then(res => {
  setPage('list')
  getData();
}).catch(error => {
  console.log(error)
})

 
}
 
  return (
    <div       ref={ref}>
      <CommonHeader 
      title="Criar Status" 
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

