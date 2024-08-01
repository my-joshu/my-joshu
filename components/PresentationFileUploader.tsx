"use client";

import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";

import { MAX_FILE_SIZE_STRING, VALID_MIME_TYPES } from "@/shared/lib/constants";

registerPlugin(FilePondPluginFileValidateType, FilePondPluginFileValidateSize);

export function PresentationFileUploader({
  onFileProcessed,
}: {
  onFileProcessed: (text: string) => void;
}) {
  return (
    <FilePond
      /** FilePond properties: https://pqina.nl/filepond/docs/api/instance/properties/ */
      allowMultiple={false}
      maxFiles={1}
      name="files"
      credits={false}
      labelIdle='Drag & Drop your slides or <span class="filepond--label-action">Browse</span>'
      labelFileProcessing="Uploading..."
      labelFileProcessingComplete="Upload complete"
      labelFileProcessingAborted="Upload cancelled"
      labelFileProcessingError="Error during upload"
      /** Server configuration: https://pqina.nl/filepond/docs/api/server/ */
      server={{
        process: {
          url: "/api/slidesToText", // Async uploading files to the endpoint
          onload: (response) => {
            const data = JSON.parse(response);
            if (data.status === "ok") {
              onFileProcessed(data.text);
              return 1; // No meaning. But it needs to return number or string
            } else {
              return 0; // No meaning. But it needs to return number or string
            }
          },
          onerror: (error) => {
            console.error("Error during file processing:", error);
          },
        },
        fetch: null,
        revert: null,
      }}
      /** File size validation: https://pqina.nl/filepond/docs/api/plugins/file-validate-size/ */
      allowFileSizeValidation={true}
      maxFileSize={MAX_FILE_SIZE_STRING}
      /** File type validation: https://pqina.nl/filepond/docs/api/plugins/file-validate-type/ */
      allowFileTypeValidation={true}
      acceptedFileTypes={VALID_MIME_TYPES}
    />
  );
}
