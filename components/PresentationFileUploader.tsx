"use client";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";

import { MAX_FILE_SIZE_STRING, VALID_MIME_TYPES } from "@/shared/lib/constants";

/**
 * FilePond properties:
 * https://pqina.nl/filepond/docs/api/instance/properties/
 *
 * Server configuration:
 * https://pqina.nl/filepond/docs/api/server/
 *
 * File type validation:
 * https://pqina.nl/filepond/docs/api/plugins/file-validate-type/
 *
 * File size validation:
 * https://pqina.nl/filepond/docs/api/plugins/file-validate-size/
 */

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export function PresentationFileUploader({
  onFileProcessed,
}: {
  onFileProcessed: (text: string) => void;
}) {
  return (
    <FilePond
      /**
       * FilePond properties
       */
      allowMultiple={false}
      maxFiles={1}
      name="files"
      credits={false}
      labelIdle='Drag & Drop your slides or <span class="filepond--label-action">Browse</span>'
      labelFileProcessing="Uploading..."
      labelFileProcessingComplete="Upload complete"
      labelFileProcessingAborted="Upload cancelled"
      labelFileProcessingError="Error during upload"
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
        process: {
          url: "/api/slidesToText", // Async uploading files to the endpoint
          onload: (response) => {
            const data = JSON.parse(response);
            if (data.status === "ok") {
              onFileProcessed(data.text);
            } else {
              console.error("Error during file processing:", data.message);
            }
            return 1;
          },
          onerror: (error) => {
            console.error("Error during file processing:", error);
          },
        },
        fetch: null,
        revert: null,
      }}
      /**
       * File size validation
       */
      allowFileSizeValidation={true}
      maxFileSize={MAX_FILE_SIZE_STRING}
      /**
       * File type validation
       */
      allowFileTypeValidation={true}
      acceptedFileTypes={VALID_MIME_TYPES}
      fileValidateTypeDetectType={(file, type) => {
        return new Promise((resolve, reject) => {
          // Do custom type detection here and return with promise
          resolve(type);
        });
      }}
    />
  );
}
