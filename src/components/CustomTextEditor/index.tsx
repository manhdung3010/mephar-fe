import { EditorState } from 'draft-js';
import { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const EditorConvertToHTML = (
  {
    value,
    onChange
  }: {
    value: string | any,
    onChange: (value: string) => void
  }
) => {

  return (
    <div>
      <Editor
        editorState={value}
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        onEditorStateChange={onChange}
      />
      {/* <textarea
        disabled
        value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
      /> */}
    </div>
  );
}

export default EditorConvertToHTML;
