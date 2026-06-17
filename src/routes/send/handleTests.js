export function handleTests(qData, aData) {
  let points = 0;

  const types = [
    "grammar",
    "vocabulary",
    "reading1",
    "reading2",
    "reading3"
  ];

  let HTML = "";

  for (let i = 0; i < types.length; i++) {
    let type = types[i];

    HTML += `<h1>${type}</h1>`;

    HTML += qData[type]
      .map((qData, i) => {
        const question = qData.question;
        const answer = qData.answer;
        const a = qData.a;
        const b = qData.b;
        const c = qData.c;

        const userAnswer = aData[type][i];

        if (userAnswer === answer) {
          points++;
        }

        return `
          <p>${question}</p>
          <p class="${userAnswer === a ? "selected" : ""}">${a} ${answer === a ? "✔️" : ""}</p>
          <p class="${userAnswer === b ? "selected" : ""}">${b} ${answer === b ? "✔️" : ""}</p>
          <p class="${userAnswer === c ? "selected" : ""}">${c} ${answer === c ? "✔️" : ""}</p>
        `;
      })
      .join("");
  }

  return `<h1>${points} points</h1>` + HTML;
}