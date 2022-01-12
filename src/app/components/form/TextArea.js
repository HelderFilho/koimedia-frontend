import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";

export default function TextArea({ onBlur, disabled, value }) {
  const editor = useRef(null);
  const [content, setContent] = useState(value);
  const config = {
    readonly: disabled, // all options from https://xdsoft.net/jodit/doc/
  };

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      tabIndex={1} 
      onBlur={onBlur} 
    />
  );
}
