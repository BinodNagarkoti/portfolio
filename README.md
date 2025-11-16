# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.


## Password Reset Flow

The admin password reset functionality is implemented with two pages:

1. **Request Password Reset**: `/admin/reset-password`
   - Allows users to enter their email to receive a password reset link
   - Sends a reset link via email using Supabase's `resetPasswordForEmail` method
   - Redirects to `/admin/new-password-reset` after sending

2. **Set New Password**: `/admin/new-password-reset`
   - Handles the PASSWORD_RECOVERY event when users click the reset link
   - Allows users to enter and confirm their new password
   - Updates the password using Supabase's `updateUser` method

### How to Test

1. Navigate to `/admin/reset-password`
2. Enter your admin email address
3. Check your email for the reset link
4. Click the link (redirects to `/admin/new-password-reset`)
5. Enter a new password and confirm it
6. The password will be updated and you'll be redirected to login

### Route Protection

- The middleware has been updated to allow access to password reset routes
- Admin dashboard routes still require authentication
- Password reset pages are accessible without authentication
