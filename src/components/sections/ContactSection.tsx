'use client';

import { useState } from 'react';
import SectionWrapper from '@/components/common/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon, SendIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { personalInfo } from '@/lib/data';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    
    // For demonstration, we'll show a success toast.
    // In a real app, this would involve a server action or API call.
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out, I'll get back to you soon.",
      variant: "default", 
    });
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <SectionWrapper id="contact" title="Get In Touch" subtitle="Contact Me">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Send me a message</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="font-semibold">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 bg-background/70 focus:bg-background"
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 bg-background/70 focus:bg-background"
                />
              </div>
              <div>
                <Label htmlFor="message" className="font-semibold">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Your message..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="mt-1 bg-background/70 focus:bg-background"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-accent hover:text-accent-foreground text-primary-foreground shadow-md" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && <SendIcon className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MailIcon className="w-6 h-6 text-accent" />
                <Link href={`mailto:${personalInfo.email}`} className="text-foreground hover:text-primary transition-colors">
                  {personalInfo.email}
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <PhoneIcon className="w-6 h-6 text-accent" />
                <span className="text-foreground">{personalInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <GithubIcon className="w-6 h-6 text-accent" />
                <Link href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                  GitHub Profile
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <LinkedinIcon className="w-6 h-6 text-accent" />
                <Link href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">
                  LinkedIn Profile
                </Link>
              </div>
            </CardContent>
          </Card>
          <div className="text-center md:text-left">
            <p className="text-muted-foreground">
              I&apos;m currently available for freelance projects or full-time opportunities. Let&apos;s build something amazing together!
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
