import PDFDocument from "pdfkit";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

// správná absolutní cesta k fontu (funguje i v build/serverless)
const fontPath = fileURLToPath(
  new URL("../../lib/fonts/Roboto-Regular.ttf", import.meta.url)
);

export async function generatePdf(qData, aData, name = "") {
  const doc = new PDFDocument({ margin: 40 });

  const buffers = [];
  const pdfBufferPromise = new Promise((resolve) => {
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  // ✅ FONT SAFE LOAD
  const fontBuffer = fs.readFileSync(fontPath);
  doc.font(fontBuffer);

  let points = 0;

  const types = ["grammar", "vocabulary", "reading1", "reading2", "reading3"];

  const typeLabels = {
    grammar: "GRAMMAR",
    vocabulary: "VOCABULARY",
    reading1: "READING 1",
    reading2: "READING 2",
    reading3: "READING 3"
  };

  const lineHeight = 14;
  const paddingX = 6;
  const paddingY = 2;
  const optionBoxHeight = lineHeight + paddingY * 2;

  doc.fontSize(20).fillColor("black").text("English Test Results");
  doc.moveDown();

  if (name) {
    doc.fontSize(14).text(`Name: ${name}`);
    doc.moveDown();
  }

  for (const type of types) {
    doc.fontSize(16).text(typeLabels[type] ?? type.toUpperCase());
    doc.moveDown(0.5);

    qData[type].forEach((q, i) => {
      const userAnswer = aData[type]?.[i];

      const options = [
        { label: "A", value: q.a },
        { label: "B", value: q.b },
        { label: "C", value: q.c },
        { label: "D", value: q.d }
      ].filter(o => o.value);

      if (userAnswer === q.answer) {
        points++;
      }

      const questionHeight = doc.heightOfString(q.question);
      const totalHeight =
        questionHeight +
        8 +
        options.length * optionBoxHeight +
        10;

      if (doc.y + totalHeight > doc.page.height - doc.page.margins.bottom) {
        doc.addPage();
      }

      // QUESTION
      doc.fontSize(12).fillColor("black").text(q.question);
      doc.moveDown(0.3);

      // OPTIONS
      options.forEach((opt) => {
        const text = `${opt.label}) ${opt.value}`;

        const x = doc.x;
        const y = doc.y;

        const textWidth = doc.widthOfString(text);

        const isSelected = userAnswer === opt.value;
        const isCorrect = q.answer === opt.value;

        if (isSelected) {
          doc
            .rect(
              x - paddingX,
              y - paddingY,
              textWidth + paddingX * 2,
              optionBoxHeight
            )
            .stroke("#0000ff");
        }

        doc
          .fontSize(12)
          .fillColor(isCorrect ? "green" : "black")
          .text(text);
      });

      doc.fillColor("black");
      doc.moveDown();
    });

    doc.moveDown();
  }

  doc.fontSize(18).fillColor("black").text(`Points: ${points}`);

  doc.end();

  return await pdfBufferPromise;
}