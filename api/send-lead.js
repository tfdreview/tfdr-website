export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  let form = {};

  try {
    form = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    form = {};
  }

  const name = form.name || form.fullName || form.full_name || "";
  const email = form.email || form.emailAddress || form.email_address || "";
  const phone = form.phone || form.phoneNumber || form.phone_number || "";
  const agency = form.agency || form.federalAgency || form.department || "";
  const process = form.process || form.status || form.stage || "";
  const message = form.message || form.description || form.situation || "";

  const emailBody = `
New TFDR website lead received:

Name: ${name}
Email: ${email}
Phone: ${phone}
Agency: ${agency}
Process Status: ${process}
Message: ${message}

Submitted from tfdrconsulting.com
`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TFDR Website <leads@send.thefederaldisabilityreview.com>",
        to: ["support@thefederaldisabilityreview.com"],
        subject: "New TFDR Website Lead",
        reply_to: email || "support@thefederaldisabilityreview.com",
        text: emailBody,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("RESEND ERROR:", error);
      return res.status(500).json({ message: error });
    }

    return res.status(200).json({ message: "Lead sent successfully" });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
}
