export function WelcomeEmailTemplate({
  userName,
  userEmail,
}: {
  userName: string
  userEmail: string
}) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to 4Corners AI</title>
  <style>
    /* Styles for email clients that support them */
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3);">
          
          <!-- Header with gradient and logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #3b82f6 100%); padding: 50px 40px 60px 40px; text-align: center;">
              <!-- Simple Logo Box with 3 Colored Lines -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto 20px; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%); border-radius: 8px; border: 2px solid rgba(139, 92, 246, 0.5);">
                <tr>
                  <td style="padding: 12px; vertical-align: middle;">
                    <div style="width: 100%; height: 6px; background: #06B6D4; margin-bottom: 6px; border-radius: 3px; box-shadow: 0 2px 4px rgba(6, 182, 212, 0.5);"></div>
                    <div style="width: 100%; height: 6px; background: #3B82F6; margin-bottom: 6px; border-radius: 3px; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.5);"></div>
                    <div style="width: 100%; height: 6px; background: #8B5CF6; border-radius: 3px; box-shadow: 0 2px 4px rgba(139, 92, 246, 0.5);"></div>
                  </td>
                </tr>
              </table>
              
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; text-shadow: 0 2px 10px rgba(0,0,0,0.3);">
                Welcome to 4Corners AI! 
                <span style="display: inline-block; vertical-align: middle; margin-left: 8px;">
                  <span style="display: block; width: 24px; height: 3px; background: #06B6D4; margin: 2px 0; border-radius: 1px;"></span>
                  <span style="display: block; width: 24px; height: 3px; background: #3B82F6; margin: 2px 0; border-radius: 1px;"></span>
                  <span style="display: block; width: 24px; height: 3px; background: #8B5CF6; margin: 2px 0; border-radius: 1px;"></span>
                </span>
              </h1>
              <p style="margin: 10px 0 0 0; color: #e9d5ff; font-size: 16px;">
                AI-Powered Design System Generator
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <p style="margin: 0 0 20px 0; color: #e2e8f0; font-size: 18px; line-height: 1.6;">
                Hi ${userName || 'there'}! 👋
              </p>
              
              <p style="margin: 0 0 20px 0; color: #cbd5e1; font-size: 16px; line-height: 1.6;">
                Thank you for joining 4Corners AI! We're excited to help you create beautiful, consistent design systems with the power of AI.
              </p>
              
              <!-- Free Credits Box -->
              <div style="background: linear-gradient(135deg, #334155 0%, #1e293b 100%); border-radius: 12px; padding: 24px; margin: 30px 0; border: 2px solid #7c3aed; text-align: center;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); border-radius: 12px; margin: 0 auto 16px; line-height: 60px; text-align: center;">
                  <span style="font-size: 32px;">🎁</span>
                </div>
                <h2 style="margin: 0 0 8px 0; color: #a78bfa; font-size: 20px; font-weight: bold;">
                  Your Free Credits
                </h2>
                <p style="margin: 0 0 8px 0; color: #e2e8f0; font-size: 16px;">
                  You've received <strong style="color: #a78bfa; font-size: 24px;">3 FREE credits</strong> to get started!
                </p>
                <p style="margin: 0; color: #94a3b8; font-size: 14px;">
                  Each credit generates one complete design system with colors, typography, spacing, and more.
                </p>
              </div>
              
              <h3 style="margin: 30px 0 16px 0; color: #e2e8f0; font-size: 18px;">
                Quick Start Guide:
              </h3>
              
              <ol style="color: #cbd5e1; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                <li style="margin-bottom: 12px;">Visit the <strong style="color: #a78bfa;">Generate</strong> page</li>
                <li style="margin-bottom: 12px;">Describe your brand or project</li>
                <li style="margin-bottom: 12px;">Let AI create your design system</li>
                <li style="margin-bottom: 12px;">Export in your preferred format (CSS, Tailwind, Figma, etc.)</li>
              </ol>
              
              <div style="text-align: center; margin: 40px 0 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/generate" style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);">
                  Start Creating →
                </a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px 40px; text-align: center; border-top: 1px solid #334155;">
              <p style="margin: 0 0 12px 0; color: #64748b; font-size: 14px;">
                Need help? Reply to this email or visit our support page.
              </p>
              <p style="margin: 0; color: #475569; font-size: 12px;">
                © 2026 4Corners AI. All rights reserved.
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
