/**
 * Clerk Email Template Content
 * 
 * This file contains the email template content for Clerk email templates.
 * These templates should be configured in the Clerk Dashboard:
 * https://dashboard.clerk.com → Email & SMS → Email Templates
 * 
 * Note: Clerk email templates are managed through the Dashboard UI,
 * not programmatically. This file serves as a reference for the content.
 */

export const welcomeEmailTemplate = {
  subject: "Welcome to 4Corners AI! 🎨",
  
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #8B5CF6; font-size: 28px; margin: 0;">Welcome to 4Corners AI!</h1>
  </div>
  
  <div style="background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
    <p style="color: white; font-size: 18px; margin: 0; font-weight: 600;">🎨 AI-Powered Design System Generator</p>
  </div>
  
  <p style="font-size: 16px; margin-bottom: 20px;">
    Hi {{user.firstName|default:"there"}},
  </p>
  
  <p style="font-size: 16px; margin-bottom: 20px;">
    We're thrilled to have you join 4Corners AI! You're now part of a community of designers and developers who are creating beautiful, consistent design systems in seconds.
  </p>
  
  <p style="font-size: 16px; margin-bottom: 20px;">
    <strong>What you can do next:</strong>
  </p>
  
  <ul style="font-size: 16px; margin-bottom: 30px; padding-left: 20px;">
    <li style="margin-bottom: 10px;">Generate your first design system by describing your brand</li>
    <li style="margin-bottom: 10px;">Get AI-powered color palettes with accessibility checks</li>
    <li style="margin-bottom: 10px;">Export ready-to-use components in React, Vue, or CSS</li>
    <li style="margin-bottom: 10px;">Create professional typography pairings automatically</li>
  </ul>
  
  <div style="text-align: center; margin: 40px 0;">
    <a href="{{application.homeUrl}}/generate" style="display: inline-block; background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
      Generate Your First Design System
    </a>
  </div>
  
  <p style="font-size: 14px; color: #666; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
    If you have any questions, feel free to reach out. We're here to help!
  </p>
  
  <p style="font-size: 14px; color: #666; margin-top: 10px;">
    Happy designing,<br>
    <strong>The 4Corners AI Team</strong>
  </p>
  
</body>
</html>`,

  plainText: `Welcome to 4Corners AI! 🎨

Hi {{user.firstName|default:"there"}},

We're thrilled to have you join DesignForge AI! You're now part of a community of designers and developers who are creating beautiful, consistent design systems in seconds.

What you can do next:
• Generate your first design system by describing your brand
• Get AI-powered color palettes with accessibility checks
• Export ready-to-use components in React, Vue, or CSS
• Create professional typography pairings automatically

Get started: {{application.homeUrl}}/generate

If you have any questions, feel free to reach out. We're here to help!

Happy designing,
The 4Corners AI Team`,
};

/**
 * Clerk Template Variables Reference
 * 
 * Available variables in Clerk email templates:
 * - {{user.firstName}} - User's first name
 * - {{user.lastName}} - User's last name
 * - {{user.emailAddress}} - User's email address
 * - {{user.username}} - User's username (if set)
 * - {{application.name}} - Application name
 * - {{application.homeUrl}} - Application home URL (configure in Clerk Dashboard)
 * - {{application.logoUrl}} - Application logo URL
 * 
 * Filters:
 * - {{user.firstName|default:"there"}} - Use "there" if firstName is empty
 */

