// Email sending is stubbed — swap the sendWateringReminder body for a real
// Resend/Nodemailer call once a sending domain is configured.

type PlantEntry = {
  name: string;
  token: string;
  daysOverdue: number;
};

function buildWateringEmail(plants: PlantEntry[], appUrl: string): string {
  const heading =
    plants.length === 1
      ? `${plants[0].name} needs water`
      : `${plants.length} plants need water today`;

  const intro =
    plants.length === 1
      ? "One of your plants is due for watering. Tap the button to log it without opening the app."
      : "Some of your plants are due for watering. Tap each button to log it without opening the app.";

  const cards = plants
    .map(
      (p) => `
    <div style="background:#FDFBF7;border:1px solid #DDD8CC;border-radius:14px;padding:20px 24px;margin-bottom:12px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="vertical-align:middle;">
            <div style="font-size:16px;font-weight:600;color:#1E2A1E;margin-bottom:4px;">${p.name}</div>
            <div style="font-size:13px;color:${p.daysOverdue > 0 ? "#8C4030" : "#7A8A7A"};">
              ${p.daysOverdue > 0 ? `${p.daysOverdue} day${p.daysOverdue === 1 ? "" : "s"} overdue` : "Due today"}
            </div>
          </td>
          <td style="vertical-align:middle;text-align:right;padding-left:16px;">
            <a href="${appUrl}/api/water/confirm/${p.token}"
               style="background:#3D5A3E;color:#FDFBF7;text-decoration:none;padding:10px 18px;border-radius:10px;font-size:13px;font-weight:500;white-space:nowrap;display:inline-block;">
              Mark watered ✓
            </a>
          </td>
        </tr>
      </table>
    </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#F5F0E8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">

    <div style="margin-bottom:32px;">
      <span style="font-family:Georgia,serif;font-style:italic;font-size:24px;color:#3D5A3E;">Folia</span>
    </div>

    <h1 style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#1E2A1E;margin:0 0 10px;line-height:1.25;">
      ${heading}
    </h1>
    <p style="font-size:15px;color:#3A4A3A;margin:0 0 32px;line-height:1.65;">
      ${intro}
    </p>

    ${cards}

    <div style="margin-top:40px;padding-top:24px;border-top:1px solid #DDD8CC;">
      <p style="font-size:12px;color:#7A8A7A;margin:0;line-height:1.6;">
        You're receiving this because you have plants in Folia. &nbsp;
        <a href="${appUrl}/dashboard" style="color:#3D5A3E;text-decoration:none;">View your plants →</a>
      </p>
    </div>

  </div>
</body>
</html>`;
}

export async function sendWateringReminder({
  to,
  plants,
  appUrl,
}: {
  to: string;
  plants: PlantEntry[];
  appUrl: string;
}) {
  const subject =
    plants.length === 1
      ? `${plants[0].name} needs water — Folia`
      : `${plants.length} plants need water today — Folia`;

  // Stubbed — log instead of sending until a domain is configured
  console.log(`[email stub] To: ${to}`);
  console.log(`[email stub] Subject: ${subject}`);
  console.log(`[email stub] Confirmation links:`);
  for (const p of plants) {
    console.log(`  ${p.name}: ${appUrl}/api/water/confirm/${p.token}`);
  }
}
