import { staticPersonalInfo } from '@/lib/data';
import { getCachedPersonalInfo } from '@/lib/seo/cache';

const Footer = async () => {
  const personalInfo = await getCachedPersonalInfo();
  const info = personalInfo ?? staticPersonalInfo;

  return (
    <footer className="text-muted-foreground py-6 border-t border-border/20 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs">
          &copy; {new Date().getFullYear()} {info.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
