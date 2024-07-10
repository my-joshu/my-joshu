// TODO This page is for development use to test out QR code with anonymous sign in. Should be deleted later on

import { generateQR } from "@/utils/qrCode";

export default async function Live() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/anonymous?presentationId=1`;
  const qrCode = await generateQR(url);

  return (
    <>
      <div>Live</div>
      <img src={qrCode} alt="" />
    </>
  );
}
