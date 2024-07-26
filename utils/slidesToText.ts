import officeParser from "officeparser";
import {
  MAX_FILE_SIZE_BYTE,
  MAX_FILE_SIZE_STRING,
  VALID_MIME_TYPES,
} from "@/shared/lib/constants";

const validateFile = (file: File): string | undefined => {
  const { size, type } = file;

  // Validate file type
  if (!VALID_MIME_TYPES.includes(type)) {
    return "Invalid file type";
  }

  // Validate file size
  if (size > MAX_FILE_SIZE_BYTE) {
    return `Maximum file size is ${MAX_FILE_SIZE_STRING}`;
  }
};

/** Currently office files only supported. */
export const extractText = async (file: File): Promise<string> => {
  try {
    const message = validateFile(file);
    if (message) {
      throw new Error(message);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const text = await officeParser.parseOfficeAsync(fileBuffer);

    return text.trim();
  } catch (error: unknown) {
    let message = "An error occurred during text extraction.";
    if (error instanceof Error) {
      message += " " + error.message;
    }
    throw Error(message);
  }
};
