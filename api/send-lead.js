export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const form = req.body;

  const emailBody = `
New TFDR website lead received:

Name: ${form.name || ""}
Email: ${form.email || ""}
Phone: ${form.phone || ""}
Agency: ${form.agency || ""}
Position: ${form.position || ""}
Message: ${form.message || ""}

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
        from: "TFDR Website <support@thefederaldisabilityreview.com>",
        to: ["support@thefederaldisabilityreview.com"],
        subject: "New TFDR Website Lead",
        text: emailBody,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ message: error });
    }

    return res.status(200).json({ message: "Lead sent successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
