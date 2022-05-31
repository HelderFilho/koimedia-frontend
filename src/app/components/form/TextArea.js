import React, { useState, useRef, useEffect } from "react";
import "jodit/build/jodit.min.css";
import classnames from 'classnames';
import JoditEditor from "jodit-react";
let delayTimer;

export default function TextArea({ onBlur, disabled, value, onChange }) {
  const editorJodit = React.useRef(null);
	let [value_, setValue_] = useState('');
	let [data, setData] = useState('');

  const [config, setConfig] = useState({
    readonly: false,
    toolbar: true,
    language: 'pt_br',
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarAdaptive: true,
    exec: (instance) => {
      const content = instance.editor.innerHTML
      handleSaveContent(content)
    },
  })
	useEffect(()=>{
		setValue_(value);
	}, [value])

  const onEditorChange = (editorNewValue, name, selected) => {
		setData(editorNewValue)
		clearTimeout(delayTimer);
		delayTimer = setTimeout(() => {
			onChange(editorJodit.current.value)
		  }, 400);

	  };

  return (

    <JoditEditor
      ref={editorJodit}
      onBlur={(content, delta, source, editor) => onBlur(content)}
      onChange={(content, delta, source, editor) => onEditorChange(content)}

      config={config}
      value={value_ || ''}
      //	onChange={onEditorChange}
      readOnly={disabled}
      placeholder='Digite aqui'


      tabIndex={1} // tabIndex of textarea
    />


  );
}
