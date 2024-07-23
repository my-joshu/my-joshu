import { filesize } from "filesize";

/** MIME types: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types */
export const VALID_MIME_TYPES = [
  "application/pdf", // .pdf
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];
/**
 * Max file size for slides with byte type. On vercel, serverless functions max request body size is 4.5 MB
 * https://vercel.com/docs/functions/runtimes#size-limits
 */
export const MAX_FILE_SIZE_BYTE = process.env.NODE_ENV === "production" ? 4 * 1000 * 1000 : 30 * 1000 * 1000;
/** Max file size for slides with human-readable. */
export const MAX_FILE_SIZE_STRING = filesize(MAX_FILE_SIZE_BYTE);
