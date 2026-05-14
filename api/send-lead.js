export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let form = {};

  try {
    form = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (error) {
    form = {};
  }

  form = form || {};

  const emailBody = `
New TFDR website lead received:

Name: ${form.name || form.fullName || ""}
Email: ${form.email || ""}
Phone: ${form.phone || ""}
Agency: ${form.agency || form.department || ""}
Process Status: ${form.process || ""}
Message: ${form.message || form.description || ""}

Submitted from tfdrconsulting.com
`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY || ""}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "TFDR Website <leads@send.thefederaldisabilityreview.com>",
        to: "support@thefederaldisabilityreview.com",
        subject: "New TFDR Website Lead",
        text: emailBody
      })
    });

    const result = await response.text();

    if (!response.ok) {
      console.error("RESEND ERROR:", result);
      return res.status(500).json({ message: result });
    }

    return res.status(200).json({ message: "Lead sent successfully" });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}
