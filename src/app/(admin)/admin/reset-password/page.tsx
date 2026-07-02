'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MailIcon } from 'lucide-react'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { AuthCard } from '@/components/admin/AuthCard'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const supabase = createSupabaseBrowserClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/new-password-reset`
      })

      if (error) {
        setError(error.message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Reset Password"
      description="Enter your email to receive a password reset link"
      error={error}
    >
      {success ? (
        <div className="text-center py-4">
          <MailIcon className="mx-auto h-12 w-12 text-green-500 mb-3" />
          <h3 className="text-lg font-medium mb-2">Check your email</h3>
          <p className="text-sm text-muted-foreground">
            We've sent a password reset link to {email}. Please check your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}