import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { memo } from 'react';

// Define the content structure for better maintainability
interface AboutContentProps {
  className?: string;
}

interface AboutSection {
  title: string;
  paragraphs: string[];
}

const aboutData: AboutSection = {
  title: "Professional Background",
  paragraphs: [
    "I am a full-stack developer who focuses on the NodeJS(ExpressJS) backend and is familiar with core technologies such as Postgres, MySQL, NoSQL(MongoDB) and Redis. I can build high-performance, maintainable server-side architectures.",
    "At the same time, I have good front-end development capabilities and can build highly interactive web applications using modern frameworks such as ReactJS, NextJs, and Vite.",
    "I focus on product experience and design details, and am committed to creating products that combine technical depth and user value."
  ]
};

const AboutContent = memo(({ className = "" }: AboutContentProps) => {
  // Error handling for missing content
  if (!aboutData || !aboutData.title || !aboutData.paragraphs || aboutData.paragraphs.length === 0) {
    console.error("AboutContent: Missing required content data");
    return (
      <Card className={`bg-card/50 backdrop-blur-xs ${className}`}>
        <CardHeader>
          <CardTitle>Professional Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Content temporarily unavailable.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-card/50 backdrop-blur-xs ${className}`}
      role="region"
      aria-labelledby="about-title"
    >
      <CardHeader>
        <CardTitle id="about-title">{aboutData.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">
        {aboutData.paragraphs.map((paragraph, index) => (
          <p
            key={`about-paragraph-${index}`}
            className="leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
      </CardContent>
    </Card>
  );
});

AboutContent.displayName = 'AboutContent';

export default AboutContent;