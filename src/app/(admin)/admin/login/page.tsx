'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login} from '@/lib/actions'
import { EyeClosed, EyeIcon } from 'lucide-react'
import { useState } from 'react'

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
  return ( <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <form className="w-full max-w-sm bg-card p-8 rounded-2xl shadow-md space-y-6">
    <h2 className="text-2xl font-bold text-card-foreground text-center">Login</h2>
    <div className="space-y-2">
      <label htmlFor="email">Email:</label>
      <Input id="email" name="email" type="email" required className="w-full bg-input"/>
      </div>
      <div className="space-y-2">
      <label htmlFor="password">Password:</label>
      <div className="relative flex w-full max-w-sm items-center gap-2">
      <Input id="password" name="password" type={showPassword ? "text" : "password"} required className="bg-input w-full"/>
      <Button type="button" variant="secondary" size="icon" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 end-0 text-primary-foreground">{showPassword ? <EyeClosed className='size-5 text-primary'/> : <EyeIcon className='size-5 text-primary' />}</Button>
      </div>
      </div>
      <Button formAction={login} className="w-full bg-primary text-primary-foreground p-2 rounded-md">Log in</Button>
    </form>
  </div>)
}