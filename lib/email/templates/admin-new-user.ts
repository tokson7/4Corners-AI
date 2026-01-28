export function AdminNewUserTemplate({
  userName,
  userEmail,
  userId,
  registrationDate,
  totalUsers,
  usersToday,
}: {
  userName: string
  userEmail: string
  userId: string
  registrationDate: string
  totalUsers?: number
  usersToday?: number
}) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New User Registration - 4 Corners AI</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a;">
  
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0 0 8px 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                🎉 New User Registration
              </h1>
              <p style="margin: 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 500;">
                4 Corners AI Platform
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              
              <p style="margin: 0 0 24px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                A new user just joined your platform!
              </p>
              
              <!-- User Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: rgba(147, 51, 234, 0.1); border: 2px solid rgba(167, 139, 250, 0.3); border-radius: 12px; margin-bottom: 32px;">
                <tr>
                  <td style="padding: 24px;">
                    <h2 style="margin: 0 0 20px 0; color: #a78bfa; font-size: 18px; font-weight: 700;">
                      User Details
                    </h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Name:</td>
                        <td style="padding: 8px 0; color: #e2e8f0; font-size: 14px; font-weight: 600; text-align: right;">${userName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Email:</td>
                        <td style="padding: 8px 0; color: #a78bfa; font-size: 14px; font-weight: 600; text-align: right;">${userEmail}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">User ID:</td>
                        <td style="padding: 8px 0; color: #cbd5e1; font-size: 13px; font-family: monospace; text-align: right;">${userId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Registered:</td>
                        <td style="padding: 8px 0; color: #e2e8f0; font-size: 14px; font-weight: 600; text-align: right;">${registrationDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Platform Stats -->
              ${totalUsers !== undefined ? `
              <div style="background-color: rgba(71, 85, 105, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 32px;">
                <h3 style="margin: 0 0 16px 0; color: #e2e8f0; font-size: 16px; font-weight: 600;">
                  Platform Stats
                </h3>
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #cbd5e1; font-size: 14px;">• Total Users:</span>
                      <span style="color: #a78bfa; font-size: 16px; font-weight: 700; margin-left: 8px;">${totalUsers}</span>
                    </td>
                  </tr>
                  ${usersToday !== undefined ? `
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #cbd5e1; font-size: 14px;">• New Today:</span>
                      <span style="color: #10b981; font-size: 16px; font-weight: 700; margin-left: 8px;">${usersToday}</span>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
              ` : ''}
              
              <!-- Action Button -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/users?search=${encodeURIComponent(userEmail)}" 
                       style="display: inline-block; 
                              background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); 
                              color: #ffffff; 
                              text-decoration: none; 
                              padding: 14px 32px; 
                              border-radius: 10px; 
                              font-size: 15px; 
                              font-weight: 600;
                              box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);">
                      View in Admin Panel →
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px; text-align: center; border-top: 1px solid rgba(148, 163, 184, 0.1);">
              <p style="margin: 0; color: #64748b; font-size: 13px;">
                This is an automated notification from 4 Corners AI admin system
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
