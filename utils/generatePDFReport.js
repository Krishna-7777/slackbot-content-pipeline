import fs from "fs";
import PDFDocument from "pdfkit";

export async function generatePDFReport(summary, clusters, ideas) {
  const doc = new PDFDocument({ margin: 50 });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = `./reports/report_${timestamp}.pdf`;

  // making a reports directory if not exists
  if (!fs.existsSync("./reports")) fs.mkdirSync("./reports");

  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // HEADER
  doc
    .fontSize(22)
    .text("Slackbot Content Pipeline Report", { align: "center" })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" })
    .moveDown(1.5);

  // SUMMARY
  doc
    .fontSize(14)
    .text("Processing Summary", { underline: true })
    .moveDown(0.5);

  doc.fontSize(11);
  Object.entries(summary || {}).forEach(([key, value]) => {
    doc.text(`${key}: ${value}`);
  });
  doc.moveDown(1);

  // CLUSTERS & IDEAS
  clusters.forEach((cluster, i) => {
    doc
      .fontSize(14)
      .text(`Group ${i + 1}:`, { bold: true })
      .moveDown(0.3);

    const groupIdeas = ideas?.[i]?.ideas || [];
    if (groupIdeas.length > 0) {
      doc.fontSize(11).text("Ideas:").moveDown(0.2);
      groupIdeas.forEach((idea, j) => {
        doc.text(`- ${idea}`);
      });
      doc.moveDown(0.3)
      doc.fontSize(11).text("Keywords:").moveDown(0.2);
      doc.text(`- ${cluster.keywords.join(", ")}`);
    }
    doc.moveDown(1);
  });

  // FOOTER
  doc
    .moveDown(2)
    .fontSize(10)
    .text(
      "Generated automatically by Slackbot Content Pipeline",
      { align: "center", italics: true }
    );

  doc.end();

  await new Promise((resolve) => stream.on("finish", resolve));
  return filePath;
}
