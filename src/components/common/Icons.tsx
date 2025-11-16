import type { SVGProps } from 'react';

export const JQueryIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 18L10 13L6 8" />
      <path d="M12 18L16 13L12 8" />
    </svg>
);
  
export const FormikIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.07 19.32h-2.43v-7.9l-1.9-3.21h2.52l.95 1.83.92-1.83h2.51l-1.95 3.21v7.9zm6.18-5.37c0 .54-.05.98-.16 1.33s-.26.63-.46.84-.45.35-.75.43-.65.12-1.04.12h-2.1v-3.79h2.02c.47 0 .85.06 1.15.17.3.11.53.28.69.52.16.23.25.53.25.88zm.27-2.62c0 .4-.07.75-.22 1.05-.15.3-.36.54-.64.72-.28.18-.62.3-.99.37-.38.06-.79.09-1.22.09h-3.41V6.15h3.33c.48 0 .9.04 1.25.11s.63.19.85.34.4.36.51.61.17.55.17.89v2.92z" />
    </svg>
);

export const VercelIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="m12 1.5l12 21H0z"/></svg>
);

export const ReactRouterIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M4 16.965v-3.372h2.813v1.365h-1.39v1.402H4Zm3.555-3.372v-1.402h1.42v3.372h-1.42v-1.97Zm2.188 3.372v-3.372h1.42v3.372h-1.42Zm3.594-3.372v-1.402h1.42v3.372h-1.42v-1.97ZM18.598 6.03h1.42v3.372h-1.42V6.03Zm-2.148 3.372h1.42V6.03h-1.42v3.372Zm-4.336-3.372v3.372h2.812v-1.402h-1.39V6.03H12.13Z"/></svg>
);
