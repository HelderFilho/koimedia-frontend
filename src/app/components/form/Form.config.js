import React, { forwardRef, Fragment } from "react";
import Form from "dinamicform";
import Select from "react-select";
import TextArea from "./TextArea";
var base64Img = require("base64-img");


//forwardRef é opcional
export default forwardRef(
  Form.bind(
    ({ props, errors, values, changeValue, submit }) => ({
      breakpoints: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
      errors: [
        (field) => {
          let { required, name } = field;
          let value = values[name];
          if (required && !value) {
            return "Campo Obrigatório";
          }
        },
      ],
      onError: (err) => console.log(err),

      components: [
        {
          type: "default",
          contentProps: {}, // passo props para a tag pai desse campo, nesse caso, é uma grid coluna
          content: (field) => (
            <Fragment>
              <label>{field.label}</label>
              <input
                type={field.type}
                value={values[field.name] || ""} // recomendo colocar o ||<formato do campo -> string|array|boolean/> caso contrário esse componente pode apresentar falhas; errado: value={values[field.name]}; certo: value={values[field.name] || []}
                onChange={(evt) => {
                  changeValue(field.name, evt.target.value);
                }}
                name={field.name}
                placeholder={field.placeholder}
                style={{ width: "100%" }}
                disabled= {field.disabled}
/>
              <span style={{ color: "red" }}>{errors[field.name]}</span>
            </Fragment>
          ),
        },
        {
          type: "checkbox",
          contentProps: {}, // passo props para a tag pai desse campo, nesse caso, é uma grid coluna
          content: (field) => (
            <Fragment>
              <label>{field.label}</label>
              <input
                type={field.type}
                checked={values[field.name] || false} // recomendo colocar o ||<formato do campo -> string|array|boolean/> caso contrário esse componente pode apresentar falhas; errado: value={values[field.name]}; certo: value={values[field.name] || []}
                onChange={(evt) => {
                  changeValue(field.name, evt.currentTarget.checked);
                }}
                name={field.name}
                placeholder={field.placeholder}
                style={{ width: "100%" }}
                disabled= {field.disabled}
/>
              <span style={{ color: "red" }}>{errors[field.name]}</span>
            </Fragment>
          ),
        },
        {
          type : 'content',
          contentProps: {},
          content: (field) => (
            field.content
          )
        },
        {
          type: "file",
          contentProps: {}, // passo props para a tag pai desse campo, nesse caso, é uma grid coluna
          content: (field) => (
            <div>
              <Fragment>
                <label>{field.label}</label>
                <input
                  type={field.type}
                  disabled= {field.disabled}

                  onChange={(evt) => {
                    Array.from(evt.target.files).map(async (e) => {

                      let reader = new FileReader();
                      reader.readAsDataURL(e);
                      reader.onload = () => {
                        e.data = reader.result;
                        e.filename = e.name;
                        e.filetype = e.type;
                      };
                    });
                    changeValue(field.name, evt.target.files);
                  }}
                 
                  multiple
                  name={field.name}
                  placeholder={field.placeholder}
                  style={{ width: "100%" }}
                />
                <span style={{ color: "red" }}>{errors[field.name]}</span>
              </Fragment>
              {props.values[field.name] && props.values[field.name].length > 0
                ?  Array.from(props.values[field.name])
                .map((f) => <div className="divFile">
                  <label className="labelFile" onClick={() => window.open(f.webViewLink, '_blank')}>{f.name}</label>
                  {f.id ? (<input type="button" className="buttonFile" onClick={() => props.removeFile(field.name, f)} value="x"/> ): null}
                </div>
                )
              :
              null
              }
            </div>
          ),
        },
        {
          type: "textarea",
          contentProps: {}, // passo props para a tag pai desse campo, nesse caso, é uma grid coluna
          content: (field) => (
            <div>
              <label>{field.label}</label>
              <TextArea
               onBlur={(evt) => {
                changeValue(field.name, evt);
              }}
              disabled = {field.disabled}
              value={values[field.name] || ""} // recomendo colocar o ||<formato do campo -> string|array|boolean/> caso contrário esse componente pode apresentar falhas; errado: value={values[field.name]}; certo: value={values[field.name] || []}
              onChange= {(evt) => {changeValue(field.name, evt)}}
              /> 
              <span style={{ color: "red" }}>{errors[field.name]}</span>
            </div>
          ),
        },
        {
          type: "select",
          contentProps: {}, // passo props para a tag pai desse campo, nesse caso, é uma grid coluna
          content: (field) => (
            <div>
              <label>{field.label}</label>

              <Select
                options={
                  props.fields.filter((f) => f.name == field.name)[0].options
                }
                value={
                  props.fields
                    .filter((f) => f.name == field.name)[0]
                    .options.filter(function (option) {
                      return option.value === values[field.name];
                    }) || []
                }
                name={field.name}
                placeholder={field.placeholder}
                onChange={(evt) => {
                  changeValue(field.name, evt.value);
                }}
                className="select"
                isDisabled = {field.disabled}
/>
              <span style={{ color: "red" }}>{errors[field.name]}</span>
            </div>
          ),
        },
        {
          type: "multiselect",
          contentProps: {}, // passo props para a tag pai desse campo, nesse caso, é uma grid coluna
          content: (field) => (
            <div>
              <label>{field.label}</label>

              <Select
                options={
                  props.fields.filter((f) => f.name == field.name)[0].options
                }
                value={values[field.name] || [1, 2]}
                value={
                  props.fields.filter((f) => f.name == field.name)[0].options
                    ? props.fields
                        .filter((f) => f.name == field.name)[0]
                        .options.filter((opt) =>
                          values[field.name]
                            ? values[field.name].includes(opt.value)
                            : 1 == 2
                        )
                    : []
                }
                name={field.name}
                placeholder={field.placeholder}
                onChange={(evt) => {
                  changeValue(
                    field.name,
                    evt.map((e) => e.value)
                  );
                }}
                isMulti
                isDisabled = {field.disabled}
              />
              <span style={{ color: "red" }}>{errors[field.name]}</span>
            </div>
          ),
        },
      ],
      button: <button className="buttonSubmit" onClick={submit}> Salvar </button>,
    })
  )
);
