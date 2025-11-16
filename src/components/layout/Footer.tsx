import { getPersonalInfo } from '@/lib/actions';
import { staticPersonalInfo } from '@/lib/data';

const Footer = async () => {
  const currentYear = new Date().getFullYear();
  const personalInfo = await getPersonalInfo();
  const info = personalInfo ?? staticPersonalInfo;

  return (
    <footer className="text-muted-foreground py-6 border-t border-border/20 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs">
          &copy; {currentYear} {info.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
