import { filesize } from "filesize";

/**
 * MIME types:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
 */
export const VALID_MIME_TYPES = [
  "application/vnd.ms-powerpoint", // .ppt
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
];

/**
 * Max file size for slides with human-readable and byte type
 *
 * 1000000   -> 1MB
 * 10000000  -> 10MB
 * 100000000 -> 100MB
 */
export const MAX_FILE_SIZE_BYTE = 10000000; // 10000000  -> 10MB
export const MAX_FILE_SIZE_STRING = filesize(MAX_FILE_SIZE_BYTE) || "10MB";
