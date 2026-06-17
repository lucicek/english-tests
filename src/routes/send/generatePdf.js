import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

import roboto from "$lib/fonts/Roboto-Regular.ttf?url";

const fontPath = fileURLToPath(new URL(roboto, import.meta.url));

export async function generatePdf(qData, aData, name = "") {
  const doc = new PDFDocument({ margin: 40 });

  const buffers = [];
  const pdfBufferPromise = new Promise((resolve) => {
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  // ✅ SAFE FONT LOAD (funguje i v build runtime)
  const fontBuffer = readFileSync(fontPath);
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

  doc.fontSize(20).text("English Test Results");
  doc.moveDown();

  if (name) {
    doc.fontSize(14).text(`Name: ${name}`);
    doc.moveDown();
  }

  for (const type of types) {
    doc.fontSize(16).text(typeLabels[type]);
    doc.moveDown(0.5);

    qData[type].forEach((q, i) => {
      const userAnswer = aData[type]?.[i];

      const options = [
        { label: "A", value: q.a },
        { label: "B", value: q.b },
        { label: "C", value: q.c },
        { label: "D", value: q.d }
      ].filter(o => o.value);

      if (userAnswer === q.answer) points++;

      doc.fontSize(12).text(q.question);
      doc.moveDown(0.3);

      options.forEach((opt) => {
        const text = `${opt.label}) ${opt.value}`;
        const isCorrect = q.answer === opt.value;

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

  doc.fontSize(18).text(`Points: ${points}`);

  doc.end();

  return await pdfBufferPromise;
}