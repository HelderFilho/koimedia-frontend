import { useState, useEffect } from "react";
import CommonHeader from "app/components/table/CommonHeader";
import CommonForm from "app/components/form/CommonForm";
import axios from "axios";
import Constants from "app/utils/Constants";
import { useResizeDetector } from 'react-resize-detector';

export default function SquareForm({ values, setPage, getData }) {
  const [valuesForm, setValuesForm] = useState(values)
  const { width, height, ref } = useResizeDetector();

  let fields = [
    {
      col: 12,
      type: "text",
      name: "cod_uf",
      label: "Código UF",
      required: true

    },
    {
      col: 12,
      type: "text",
      name: "uf",
      label: "UF",
    },
    {
      col: 12,
      type: "text",
      name: "federative_unit",
      label: "Unidade Federativa",

    },

  ];


  const onSubmit = () => {
    axios.post(Constants.APIEndpoints.SQUARE + (values.id_square ? '/updateSquare' : '/createSquare'), valuesForm).then(res => {
      setPage('list')
      getData();
    }).catch(error => {
      console.log(error)
    })


  }

  return (
    <div ref={ref}>
      <CommonHeader title="Criar Praça"
        width={width}
        onBack={() => setPage('list')} />
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
