import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  hasBottomBorder?: boolean;
}

const SectionWrapper = ({
  id,
  title,
  subtitle,
  children,
  className,
  titleClassName,
  subtitleClassName,
  contentClassName,
  hasBottomBorder = false,
  ...props
}: SectionWrapperProps) => {
  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24 w-full',
        hasBottomBorder && 'border-b border-border',
        className
      )}
      {...props}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-12 text-center">
            {subtitle && (
              <p
                className={cn(
                  'text-base font-semibold uppercase tracking-wider text-primary mb-2 font-headline',
                  subtitleClassName
                )}
              >
                {subtitle}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  'text-3xl md:text-4xl font-bold text-foreground font-headline',
                  titleClassName
                )}
              >
                {title}
              </h2>
            )}
          </div>
        )}
        <div className={cn('animate-fade-in-up', contentClassName)} style={{ animationDelay: '0.2s', opacity: 0 }}>
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;
