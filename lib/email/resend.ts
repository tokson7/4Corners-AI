import { Resend } from 'resend'
import sharp from 'sharp'

const resendApiKey = process.env.RESEND_API_KEY

if (!resendApiKey) {
  console.error('❌ CRITICAL: RESEND_API_KEY is not set in environment variables')
  console.error('   Emails will NOT be sent!')
  console.error('   Check your .env.local file')
} else {
  console.log('✅ Resend API Key detected:', resendApiKey.substring(0, 8) + '...')
}

export const resend = new Resend(resendApiKey)

// Generate exact cube logo from AnimatedCubeLogo component as PNG
const generateCubeLogoPNG = async (): Promise<string> => {
  // Exact SVG from AnimatedCubeLogo.tsx component
  const svg = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
      <feOffset dx="0" dy="2" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Top Face with 3 lines -->
  <g filter="url(#shadow)">
    <path d="M50 20 L80 35 L50 50 L20 35 Z" fill="rgba(139, 92, 246, 0.15)" stroke="rgba(139, 92, 246, 0.4)" stroke-width="1"/>
    <line x1="35" y1="30" x2="65" y2="30" stroke="#06B6D4" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    <line x1="35" y1="37" x2="65" y2="37" stroke="#3B82F6" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    <line x1="35" y1="44" x2="65" y2="44" stroke="#8B5CF6" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
  </g>
  
  <!-- Left Face with 3 lines -->
  <g filter="url(#shadow)">
    <path d="M20 35 L20 65 L50 80 L50 50 Z" fill="rgba(99, 102, 241, 0.12)" stroke="rgba(99, 102, 241, 0.3)" stroke-width="1"/>
    <line x1="25" y1="47" x2="45" y2="57" stroke="#06B6D4" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    <line x1="25" y1="54" x2="45" y2="64" stroke="#3B82F6" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
    <line x1="25" y1="61" x2="45" y2="71" stroke="#8B5CF6" stroke-width="2" opacity="0.7" stroke-linecap="round"/>
  </g>
  
  <!-- Right Face with 3 lines -->
  <g filter="url(#shadow)">
    <path d="M50 50 L50 80 L80 65 L80 35 Z" fill="rgba(167, 139, 250, 0.18)" stroke="rgba(167, 139, 250, 0.4)" stroke-width="1"/>
    <line x1="55" y1="47" x2="75" y2="57" stroke="#06B6D4" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    <line x1="55" y1="54" x2="75" y2="64" stroke="#3B82F6" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
    <line x1="55" y1="61" x2="75" y2="71" stroke="#8B5CF6" stroke-width="2" opacity="0.8" stroke-linecap="round"/>
  </g>
  
  <!-- Edge highlights -->
  <path d="M50 20 L80 35" stroke="rgba(255, 255, 255, 0.2)" stroke-width="0.5"/>
  <path d="M50 20 L20 35" stroke="rgba(255, 255, 255, 0.15)" stroke-width="0.5"/>
  <path d="M50 80 L50 50" stroke="rgba(255, 255, 255, 0.1)" stroke-width="0.5"/>
</svg>`

  try {
    // Convert SVG to PNG
    const pngBuffer = await sharp(Buffer.from(svg))
      .png({ compressionLevel: 9 })
      .resize(160, 160, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer()

    return `data:image/png;base64,${pngBuffer.toString('base64')}`
  } catch (error) {
    console.error('Failed to generate cube logo PNG:', error)
    return ''
  }
}

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}) {
  try {
    if (!resendApiKey) {
      throw new Error('Resend API key is not configured')
    }

    // For Resend test domain, convert Gmail aliases to base email
    const normalizeEmail = (email: string): string => {
      if (email.includes('+') && email.includes('@gmail.com')) {
        const [localPart, domain] = email.split('@')
        const baseLocal = localPart.split('+')[0]
        return `${baseLocal}@${domain}`
      }
      return email
    }

    const normalizedTo = Array.isArray(to) 
      ? to.map(normalizeEmail)
      : [normalizeEmail(to)]

    // IMPORTANT: Resend test domain (onboarding@resend.dev) can only send to verified email
    // For development, redirect all emails to the verified address
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isTestDomain = process.env.RESEND_FROM_EMAIL?.includes('@resend.dev') ?? true
    
    let finalRecipient = normalizedTo
    let originalRecipient = to
    
    if (isDevelopment && isTestDomain) {
      // In development with test domain, send all emails to verified address
      finalRecipient = ['zaridze2909@gmail.com']
      console.log('   ⚠️  DEV MODE: Redirecting email to verified address')
      console.log('   Original recipient:', to)
      console.log('   Actual recipient:', finalRecipient[0])
    }

    console.log('📧 [EMAIL] Sending email...')
    console.log('   To (original):', to)
    if (to !== normalizedTo[0]) {
      console.log('   To (normalized):', normalizedTo[0], '(Resend test domain requires base Gmail address)')
    }
    if (isDevelopment && isTestDomain && String(to) !== 'zaridze2909@gmail.com') {
      console.log('   ⚠️  Redirected to:', finalRecipient[0], '(Resend test domain limitation)')
    }
    console.log('   Subject:', subject)

    const response = await resend.emails.send({
      from: '4Corners AI <onboarding@resend.dev>',
      to: finalRecipient,
      subject,
      html,
    })

    // Resend API returns { data, error }
    if (response.error) {
      console.error('❌ [EMAIL] Resend API returned error!')
      console.error('   Error:', response.error)
      return { success: false, error: response.error.message || String(response.error) }
    }

    console.log('✅ [EMAIL] Email sent successfully!')
    console.log('   Email ID:', response.data?.id)
    console.log('   Full response:', response.data)
    return { success: true, data: response.data }
  } catch (error: any) {
    console.error('❌ [EMAIL] Email send failed with exception!')
    console.error('   Error:', error.message || error)
    if (error.statusCode) {
      console.error('   Status Code:', error.statusCode)
    }
    if (error.name) {
      console.error('   Error Type:', error.name)
    }
    return { success: false, error: error.message }
  }
}

// Export the PNG generation function for use in email templates
export { generateCubeLogoPNG }
