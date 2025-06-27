'use client';

import SectionWrapper from '@/components/common/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GithubIcon, LinkedinIcon, MailIcon, SendIcon } from 'lucide-react';
import Link from 'next/link';
import type { PersonalInfo } from '@/lib/supabase-types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { submitContactForm } from '@/lib/actions';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactSection = ({ personalInfo }: { personalInfo: PersonalInfo }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    const result = await submitContactForm(values);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Submission Failed', description: result.error });
    } else {
      toast({ title: 'Message Sent!', description: "Thanks for reaching out. I'll get back to you soon." });
      form.reset();
    }
    setIsSubmitting(false);
  };

  return (
    <SectionWrapper id="contact" title="Get In Touch" subtitle="Contact">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Let's Collaborate</CardTitle>
             <CardDescription>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of an amazing team.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-muted-foreground">
              If you have a project in mind, or just want to say hi, feel free to reach out using the form or through my social channels. Let's build something amazing together!
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href={personalInfo.github_url || '#'} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <GithubIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={personalInfo.linkedin_url || '#'} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <LinkedinIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={`mailto:${personalInfo.contact_email}`} aria-label="Email">
                  <MailIcon className="h-5 w-5 text-muted-foreground hover:text-primary" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm">
           <CardHeader>
            <CardTitle>Send me a message</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Hi, I'd like to talk about..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                   {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : (
                    <SendIcon className="mr-2 h-4 w-4" />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
