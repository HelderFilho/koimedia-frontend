
import Form from "../../components/form/Form.config";
import './CommonForm.css'

function UserForm({ values, fields, onSubmit, onChangeField, removeFile }) {  
  return (
    <div className='form'>
        <Form
          values={values}
          spacing={2}
          fields={fields}
          onChangeField = {onChangeField}
          onSubmit={onSubmit}
          removeFile = {removeFile}
        />
      </div>  
  );
}

export default UserForm;
