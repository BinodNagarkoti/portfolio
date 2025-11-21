import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutContent = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-xs">
      <CardHeader>
        <CardTitle>Professional Background</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">
        <p>
          I am a full-stack developer who focuses on the NodeJS(ExpressJS) backend and is familiar with core technologies such as Postgres, MySQL, NoSQL(MongoDB) Redis and can build high-performance, maintainable server-side architectures. At the same time, I have good front-end development capabilities and can build highly interactive web applications using modern frameworks such as ReactJS, NextJs, and Vite. I focus on product experience and design details, and am committed to creating products that combine technical depth and user value.
        </p>
      </CardContent>
    </Card>
  );
};

export default AboutContent;