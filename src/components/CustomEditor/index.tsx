import { Editor } from '@tinymce/tinymce-react'
import React from 'react'

function CustomEditor({ value, onChange }) {
  const apiKey = 'fwe21jibsfxuz1zbvgae1we3jmur4a4kumcmipnpkl7chzeb'
  return (
    <Editor
      apiKey={apiKey}
      // onInit={(_evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  )
}

export default CustomEditor