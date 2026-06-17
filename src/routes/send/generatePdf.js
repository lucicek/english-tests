import PDFDocument from "pdfkit";

export async function generatePdf(qData, aData, name = "") {
  const doc = new PDFDocument({ margin: 40 });

  const buffers = [];
  const pdfBufferPromise = new Promise((resolve) => {
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
  });

  let points = 0;

  const types = ["grammar", "vocabulary", "reading1", "reading2", "reading3"];

  const typeLabels = {
    grammar: "GRAMMAR",
    vocabulary: "VOCABULARY",
    reading1: "READING 1",
    reading2: "READING 2",
    reading3: "READING 3"
  };

  const optionHeight = 18;
  const questionSpacing = 8;

  function getQuestionHeight(q, optionsCount) {
    const questionHeight = doc.heightOfString(q.question, {
      width: doc.page.width - doc.page.margins.left - doc.page.margins.right
    });

    return questionHeight + 10 + optionsCount * optionHeight + questionSpacing;
  }

  function ensureSpace(height) {
    if (doc.y + height > doc.page.height - doc.page.margins.bottom) {
      doc.addPage();
    }
  }

  doc.fontSize(20).fillColor("black").text("English Test Results");
  doc.moveDown();

  if (name) {
    doc.fontSize(14).text(`Name: ${name}`);
    doc.moveDown();
  }

  for (const type of types) {
    doc.fontSize(16).text(typeLabels[type] ?? type.toUpperCase());
    doc.moveDown(0.5);

    qData[type].forEach((q) => {
      const userAnswer = aData[type]?.[qData[type].indexOf(q)];

      const options = [
        { label: "A", value: q.a },
        { label: "B", value: q.b },
        { label: "C", value: q.c },
        { label: "D", value: q.d }
      ].filter(o => o.value);

      if (userAnswer === q.answer) {
        points++;
      }

      // 👉 SPOČÍTÁME VÝŠKU BLOKU PŘEDEM
      const blockHeight = getQuestionHeight(q, options.length);

      // 👉 PAGE BREAK PŘED RENDEREM (KLÍČOVÉ)
      ensureSpace(blockHeight);

      // QUESTION
      doc.fontSize(12).fillColor("black").text(q.question);
      doc.moveDown(0.3);

      // OPTIONS
      options.forEach((opt) => {
        const text = `${opt.label}) ${opt.value}`;

        const isSelected = userAnswer === opt.value;
        const isCorrect = q.answer === opt.value;

        const x = doc.x;
        const y = doc.y;

        const textWidth = doc.widthOfString(text);

        if (isSelected) {
          doc
            .save()
            .lineWidth(1)
            .strokeColor("#0000ff")
            .rect(x - 2, y - 2, textWidth + 4, optionHeight)
            .stroke()
            .restore();
        }

        doc
          .fontSize(12)
          .fillColor(isCorrect ? "green" : "black")
          .text(text, x, y);

        doc.y = y + optionHeight;
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