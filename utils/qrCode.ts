import QRCode from "qrcode";

export const generateQR = async (url: string) => {
  try {
    return await QRCode.toDataURL(url);
  } catch (err) {
    console.error(err);
  }
};
