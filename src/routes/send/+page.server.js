import { fail } from "@sveltejs/kit";
import { Resend } from "resend";
import { RESEND_API_KEY } from "$env/static/private";

import { data as qData } from "../data.js";
import { generatePdf } from "./generatePdf.js";

const resend = new Resend(RESEND_API_KEY);

export const actions = {
  send: async ({ request }) => {
    const form = await request.formData();

    const sender = form.get("sender");
    const to = form.get("to");
    const name = form.get("name");

    const aData = JSON.parse(form.get("answers"));

    // parse nested arrays
    aData.grammar = JSON.parse(aData.grammar);
    aData.vocabulary = JSON.parse(aData.vocabulary);
    aData.reading1 = JSON.parse(aData.reading1);
    aData.reading2 = JSON.parse(aData.reading2);
    aData.reading3 = JSON.parse(aData.reading3);

    if (!to || !aData) {
      return fail(400, { error: "Missing fields" });
    }

    // 👉 PDF GENERATION
    const pdfBuffer = await generatePdf(qData, aData, name);

    // 👉 EMAIL
    const data = await resend.emails.send({
      from: `${name} <${sender}@lucik.org>`,
      to,
      subject: `${name}'s test results`,
      html: "<p>Your test results are in the attached PDF.</p>",
      attachments: [
        {
          filename: "test-results.pdf",
          content: pdfBuffer.toString("base64")
        }
      ]
    });

    return {
      success: true,
      data
    };
  }
};