// TODO This page is for development use to test out QR code with anonymous sign in. Should be deleted later on

import QRCode from "qrcode";

export default async function Live() {
  const generateQR = async () => {
    try {
      const url = "http://localhost:3000/auth/anonymous?presentationId=1";
      return await QRCode.toDataURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const qrCode = await generateQR();

  return (
    <>
      <div>Live</div>
      <img src={qrCode} alt="" />
    </>
  );
}
