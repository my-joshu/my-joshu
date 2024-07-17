"use client";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";

/**
 * FilePond properties:
 * https://pqina.nl/filepond/docs/api/instance/properties/
 *
 * File type validation:
 * https://pqina.nl/filepond/docs/api/plugins/file-validate-type/
 *
 * File size validation:
 * https://pqina.nl/filepond/docs/api/plugins/file-validate-size/
 *
 * MIME types for acceptedFileTypes:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 *
 */

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export default function Home() {
  return (
    <FilePond
      /**
       * FilePond properties
       */
      allowMultiple={false}
      maxFiles={1}
      name="files"
      labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      onaddfile={(error, file) => {
        console.log("filename", file.filename);
      }}
      onprocessfile={(error, file) => {
        console.log("filename", file.filename);
      }}
      /**
       * Server configuration
       */
      server={{
        process: "/api/file-to-text", // Async uploading files to the endpoint
        fetch: null,
        revert: null,
      }}
      /**
       * File size validation
       */
      allowFileSizeValidation={true}
      maxFileSize={"10MB"}
      /**
       * File type validation
       */
      allowFileTypeValidation={true}
      acceptedFileTypes={[
        "application/vnd.ms-powerpoint", // .ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
      ]}
      fileValidateTypeDetectType={(file, type) => {
        return new Promise((resolve, reject) => {
          // Do custom type detection here and return with promise
          resolve(type);
        });
      }}
    />
  );
}
