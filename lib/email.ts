import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendAdminNotification(data: {
  email: string
  message: string
  category: string
  submissionId: string
}) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'DesignForge AI <onboarding@resend.dev>', // Will use Resend's test domain
      to: [process.env.ADMIN_EMAIL || 'support@designforge.ai'],
      subject: `🔔 New Contact Form: ${data.category}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #8B5CF6; margin-top: 0;">Submission Details</h2>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Category:</strong> ${data.category}</p>
              <p><strong>Submission ID:</strong> ${data.submissionId}</p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #8B5CF6; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap;">${data.message}</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="http://localhost:3002/admin/submissions" 
                 style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View in Admin Dashboard
              </a>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>© 2026 DesignForge AI. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('❌ Failed to send admin notification:', error)
      return { success: false, error }
    }

    console.log('✅ Admin notification sent:', emailData?.id)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('❌ Email error:', error)
    return { success: false, error }
  }
}

export async function sendUserConfirmation(data: {
  email: string
  message: string
  category: string
}) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: 'DesignForge AI <onboarding@resend.dev>', // Will use Resend's test domain
      to: [data.email],
      subject: '✅ We received your message - DesignForge AI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You for Contacting Us!</h1>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                Hi there,
              </p>
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                We've received your message and will get back to you as soon as possible. 
                Our team typically responds within 24-48 hours.
              </p>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;"><strong>Category:</strong> ${data.category}</p>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;"><strong>Your message:</strong></p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #374151; white-space: pre-wrap;">${data.message}</p>
              </div>
              
              <p style="font-size: 16px; color: #374151; line-height: 1.6;">
                In the meantime, feel free to explore our platform:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3002/generate" 
                   style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
                  Generate Design System
                </a>
                <a href="http://localhost:3002/showcase" 
                   style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 5px;">
                  View Showcase
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                Best regards,<br>
                <strong>The 4Corners AI Team</strong>
              </p>
            </div>
          </div>
          
          <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>© 2026 DesignForge AI. All rights reserved.</p>
            <p>If you didn't submit this form, please ignore this email.</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('❌ Failed to send user confirmation:', error)
      return { success: false, error }
    }

    console.log('✅ User confirmation sent:', emailData?.id)
    return { success: true, data: emailData }
  } catch (error) {
    console.error('❌ Email error:', error)
    return { success: false, error }
  }
}
