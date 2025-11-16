'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { EyeClosed, EyeIcon, ArrowLeftIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function NewPasswordResetPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()

   useEffect(() => {
     // Listen for auth state changes to handle password recovery
     const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
       if (event === 'PASSWORD_RECOVERY') {
         // This event is triggered when the user clicks the password reset link
         console.log('Password recovery event triggered');
         
         // Optionally, we can prompt the user for the new password here
         // For now, we'll just let the form be visible for the user to enter the new password
       }
     });
 
     // Clean up subscription on unmount
     return () => {
       subscription.unsubscribe();
     };
   }, [supabase]);
 
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     
     if (password !== confirmPassword) {
       setError('Passwords do not match');
       return;
     }
     
     if (password.length < 6) {
       setError('Password must be at least 6 characters long');
       return;
     }
 
     setLoading(true);
     
     try {
       // Update the user's password
       const { error: updateError } = await supabase.auth.updateUser({
         password: password
       });
 
       if (updateError) {
         setError(updateError.message);
       } else {
         setSuccess(true);
         // Optionally redirect to login after a short delay
         setTimeout(() => {
           router.push('/admin/login');
         }, 2000);
       }
     } catch (err) {
       setError(err instanceof Error ? err.message : 'An unexpected error occurred');
     } finally {
       setLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center bg-background px-4">
       <Card className="w-full max-w-md">
         <CardHeader className="text-center">
           <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
           <CardDescription>Enter your new password</CardDescription>
         </CardHeader>
         <CardContent>
           {error && (
             <Alert variant="destructive" className="mb-4">
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}
           
           {success ? (
             <div className="text-center py-4">
               <div className="text-lg font-medium mb-2 text-green-600">Password Updated!</div>
               <p className="text-sm text-muted-foreground">
                 Your password has been successfully updated. Redirecting to login...
               </p>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="password">New Password</Label>
                 <div className="relative">
                   <Input
                     id="password"
                     type={showPassword ? "text" : "password"}
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                     disabled={loading}
                     placeholder="Enter new password"
                   />
                   <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     className="absolute right-0 top-0 h-full px-3"
                     onClick={() => setShowPassword(!showPassword)}
                     disabled={loading}
                   >
                     {showPassword ? <EyeClosed className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                   </Button>
                 </div>
               </div>
               
               <div className="space-y-2">
                 <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <div className="relative">
                   <Input
                     id="confirmPassword"
                     type={showConfirmPassword ? "text" : "password"}
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     required
                     disabled={loading}
                     placeholder="Confirm new password"
                   />
                   <Button
                     type="button"
                     variant="ghost"
                     size="icon"
                     className="absolute right-0 top-0 h-full px-3"
                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                     disabled={loading}
                   >
                     {showConfirmPassword ? <EyeClosed className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                   </Button>
                 </div>
               </div>
               
               <Button
                 type="submit"
                 className="w-full"
                 disabled={loading}
               >
                 {loading ? 'Updating Password...' : 'Update Password'}
               </Button>
             </form>
           )}
         </CardContent>
         <CardFooter className="flex justify-center">
           <Button
             variant="outline"
             onClick={() => router.push('/admin/login')}
             className="w-full"
           >
             <ArrowLeftIcon className="mr-2 h-4 w-4" />
             Back to Login
           </Button>
         </CardFooter>
       </Card>
     </div>
   );
 }