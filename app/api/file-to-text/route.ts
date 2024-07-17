import officeParser from "officeparser";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const uploadedFiles = formData.getAll("files");

  console.log("cdcdcd before", uploadedFiles);
  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[1];

    if (uploadedFile instanceof File) {
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
      const data = await officeParser.parseOfficeAsync(fileBuffer);
      console.log("data", data);
    }
  }
  return Response.json({ status: "ok" });
}
