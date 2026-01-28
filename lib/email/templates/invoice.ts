export function InvoiceEmailTemplate({
  userName,
  planName,
  amount,
  credits,
  invoiceNumber,
  date,
  nextBillingDate,
}: {
  userName: string
  planName: string
  amount: number
  credits: number
  invoiceNumber: string
  date: string
  nextBillingDate: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - 4Corners AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ✅ Payment Successful
              </h1>
            </td>
          </tr>
          
          <!-- Invoice Details -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #e2e8f0; font-size: 16px;">
                Hi ${userName},
              </p>
              
              <p style="margin: 0 0 30px 0; color: #cbd5e1; font-size: 15px; line-height: 1.6;">
                Thank you for your payment! Your subscription has been successfully processed.
              </p>
              
              <!-- Invoice Box -->
              <div style="background-color: #334155; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 20px; border-bottom: 1px solid #475569;">
                      <h2 style="margin: 0; color: #a78bfa; font-size: 18px;">Invoice #${invoiceNumber}</h2>
                      <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">${date}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 24px 0;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 12px 0; color: #cbd5e1; font-size: 15px;">Plan</td>
                          <td style="padding: 12px 0; color: #e2e8f0; font-size: 15px; font-weight: 600; text-align: right;">${planName}</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; color: #cbd5e1; font-size: 15px;">Credits</td>
                          <td style="padding: 12px 0; color: #a78bfa; font-size: 15px; font-weight: 600; text-align: right;">${credits} credits</td>
                        </tr>
                        <tr>
                          <td style="padding: 12px 0; border-top: 1px solid #475569; color: #cbd5e1; font-size: 16px; font-weight: 600;">Total</td>
                          <td style="padding: 12px 0; border-top: 1px solid #475569; color: #10b981; font-size: 20px; font-weight: bold; text-align: right;">$${amount.toFixed(2)}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 20px; border-top: 1px solid #475569;">
                      <p style="margin: 0; color: #94a3b8; font-size: 13px;">
                        Next billing date: <strong style="color: #cbd5e1;">${nextBillingDate}</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              </div>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600;">
                  View Dashboard
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 40px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 13px;">
                Questions? Contact support@designforge.ai
              </p>
              <p style="margin: 0; color: #475569; font-size: 12px;">
                © 2026 4Corners AI
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
