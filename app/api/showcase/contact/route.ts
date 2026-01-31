import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

// Validation schema
const contactFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.string(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to terms and conditions',
  }),
})

export async function POST(req: NextRequest) {
  try {
    console.log('📧 [CONTACT] Step 1: Request received')
    
    // Parse request body
    const body = await req.json()
    console.log('📧 [CONTACT] Step 2: Body parsed:', { 
      email: body.email, 
      category: body.category,
      hasMessage: !!body.message,
      agreedToTerms: body.agreedToTerms
    })
    
    // Validate data
    const validatedData = contactFormSchema.parse(body)
    console.log('📧 [CONTACT] Step 3: Validation passed')
    
    // Get user metadata
    const ipAddress = req.headers.get('x-forwarded-for') || 
                      req.headers.get('x-real-ip') || 
                      'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    
    console.log('📧 [CONTACT] Step 4: Metadata collected:', { ipAddress, userAgent: userAgent.substring(0, 50) })

    // Save to database
    console.log('📧 [CONTACT] Step 5: Attempting database save...')
    const submission = await prisma.contactSubmission.create({
      data: {
        email: validatedData.email,
        message: validatedData.message,
        category: validatedData.category,
        agreedToTerms: validatedData.agreedToTerms,
        ipAddress,
        userAgent,
        status: 'new',
      },
    })

    console.log('✅ [CONTACT] Step 6: Database save SUCCESS! ID:', submission.id)

    // Email sending (optional - will fail gracefully if RESEND_API_KEY not set)
    try {
      if (process.env.RESEND_API_KEY) {
        console.log('📧 [CONTACT] Step 7: Attempting to send emails...')
        const { sendAdminNotification, sendUserConfirmation } = await import('@/lib/email')
        
        // Send emails in background (non-blocking)
        sendAdminNotification({
          email: validatedData.email,
          message: validatedData.message,
          category: validatedData.category,
          submissionId: submission.id,
        }).catch(err => console.error('⚠️  [CONTACT] Admin email failed (non-blocking):', err))

        sendUserConfirmation({
          email: validatedData.email,
          message: validatedData.message,
          category: validatedData.category,
        }).catch(err => console.error('⚠️  [CONTACT] User email failed (non-blocking):', err))
        
        console.log('✅ [CONTACT] Step 8: Email jobs queued')
      } else {
        console.log('⚠️  [CONTACT] Step 7: RESEND_API_KEY not configured, skipping emails')
      }
    } catch (emailError) {
      console.error('⚠️  [CONTACT] Email error (non-blocking):', emailError)
      // Continue anyway - emails are optional
    }

    console.log('📧 [CONTACT] Step 9: Preparing response...')
    
    // Return success response
    const responseData = {
      success: true,
      message: "Form submitted successfully! We'll get back to you soon.",
      submissionId: submission.id,
    }
    
    console.log('✅ [CONTACT] Step 10: Sending response:', responseData)
    
    return NextResponse.json(
      responseData,
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('❌ [CONTACT] ERROR CAUGHT:', error)
    console.error('❌ [CONTACT] Error type:', error instanceof Error ? error.constructor.name : typeof error)
    console.error('❌ [CONTACT] Error message:', error instanceof Error ? error.message : String(error))
    console.error('❌ [CONTACT] Error stack:', error instanceof Error ? error.stack : 'No stack trace')

    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.log('❌ [CONTACT] Zod validation error:', error.issues)
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: error.issues.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit form. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
