# Authentication Setup Guide

This document explains how to set up authentication for DesignForge AI using NextAuth.js.

## Environment Variables

Add the following variables to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email Provider (Magic Link)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=noreply@designforge.ai

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## OAuth Provider Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Set application type to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env.local`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Application name: "DesignForge AI"
4. Set Homepage URL: `http://localhost:3000`
5. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
6. Copy Client ID and Client Secret to `.env.local`

## Email Provider Setup

For email magic links, configure an SMTP server. Options:

- **SendGrid**: Free tier available
- **Resend**: Modern email API
- **AWS SES**: Scalable email service
- **Mailgun**: Developer-friendly

## Protected Routes

The following routes require authentication:
- `/generate` - Design system generator
- `/export` - Export functionality

Unauthenticated users are automatically redirected to `/signin`.

## Session Management

- Sessions use JWT strategy
- Session duration: 30 days
- Sessions persist across page refreshes
- User info available via `useSession()` hook

## Testing Authentication

1. Start the development server: `npm run dev`
2. Navigate to `/signin`
3. Try signing in with:
   - Email (magic link)
   - Google OAuth
   - GitHub OAuth

## Production Deployment

For production:

1. Update `NEXTAUTH_URL` to your production domain
2. Update OAuth callback URLs in provider settings
3. Ensure all environment variables are set in your hosting platform
4. Use a secure `NEXTAUTH_SECRET` (never commit to git)
