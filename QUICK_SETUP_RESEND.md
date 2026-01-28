# 🚀 Quick Setup: Activate Email Notifications

## ⏱️ 5-Minute Setup

Your production contact form is **100% complete** and working!  
Just need to add email credentials to activate notifications.

---

## ✅ STEP 1: Get Free Resend API Key

1. Go to **https://resend.com**
2. Click **Sign Up** (free 100 emails/day)
3. Verify your email address
4. Click **API Keys** in left sidebar
5. Click **Create API Key**
6. Copy the key (starts with `re_`)

---

## ✅ STEP 2: Update .env.local

Open `.env.local` in your project root and add these 2 lines:

```bash
RESEND_API_KEY=re_paste_your_key_here
ADMIN_EMAIL=your-email@gmail.com
```

**Replace:**
- `re_paste_your_key_here` → Your actual Resend API key
- `your-email@gmail.com` → Email where you want to receive notifications

**Example:**
```bash
RESEND_API_KEY=re_1a2b3c4d5e6f7g8h9i0j
ADMIN_EMAIL=john@example.com
```

---

## ✅ STEP 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

---

## 🎉 THAT'S IT!

Your contact form now has **full email functionality**:

✅ **Admin Emails:** You receive notification when someone submits  
✅ **User Emails:** User gets automatic confirmation  
✅ **Database:** All submissions saved (already working)  
✅ **Admin Dashboard:** View/manage submissions at `/admin/submissions`  

---

## 🧪 TEST IT NOW

1. Go to **http://localhost:3002/showcase/components**
2. Click **Forms** tab
3. Submit a test form
4. Check your email! 📧

---

## 📊 VIEW SUBMISSIONS

**Admin Dashboard:**  
**http://localhost:3002/admin/submissions**

Features:
- View all submissions
- Filter by status
- Export to CSV
- Mark as read/replied

---

## ⚠️ IMPORTANT NOTES

### Email Limitations (Free Tier)
- **Test Mode:** Resend uses `onboarding@resend.dev` as sender
- **Limit:** 100 emails/day (free)
- **Upgrade:** Add your domain for custom sender address

### Production Deployment
When deploying to production:
1. Add your domain to Resend
2. Update sender email in `lib/email.ts`
3. Change `localhost:3002` URLs to production URL
4. Set `RESEND_API_KEY` in production environment variables

### No API Key? No Problem!
If you don't configure Resend:
- ✅ Form still works
- ✅ Submissions still saved to database
- ✅ Admin dashboard still works
- ❌ No email notifications

---

## 🐛 Troubleshooting

**Emails not arriving?**
- Check spam/junk folder
- Verify `RESEND_API_KEY` in `.env.local`
- Check server console for error messages
- Verify you restarted dev server after adding keys

**Need help?**
- Check full docs: `PRODUCTION_CONTACT_FORM_COMPLETE.md`
- Check Resend logs: https://resend.com/emails
- Check server console for detailed logs

---

**Setup Time:** ~5 minutes  
**Cost:** Free (100 emails/day)  
**Status:** Ready to activate! 🚀
