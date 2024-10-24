import { Editor } from "@tinymce/tinymce-react";
import React from "react";

/**
 * CustomEditor component renders a rich text editor using the TinyMCE library.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.value - The current value of the editor.
 * @param {function} props.onChange - The function to call when the editor content changes.
 *
 * @returns {JSX.Element} The rendered editor component.
 */
function CustomEditor({ value, onChange }) {
  const apiKey = "fwe21jibsfxuz1zbvgae1we3jmur4a4kumcmipnpkl7chzeb";
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
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
    />
  );
}

export default CustomEditor;
