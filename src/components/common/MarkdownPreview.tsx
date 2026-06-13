'use client';

import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import remarkGfm from 'remark-gfm';
import remarkDeflist from 'remark-deflist';
import remarkHeadingId from 'remark-heading-id';
import remarkSupersub from 'remark-supersub';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';

type MarkdownPreviewProps = {
  source: string;
};

function getTheme() {
  if (typeof document === 'undefined') return 'dark';
  const saved = localStorage.getItem('theme');
  if (saved === 'light') return 'light';
  if (saved === 'dark') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function MarkdownPreview({ source }: MarkdownPreviewProps) {
  const [colorMode, setColorMode] = useState<'light' | 'dark'>(getTheme());

  useEffect(() => {
    setColorMode(getTheme());
    const observer = new MutationObserver(() => setColorMode(getTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const onStorage = () => setColorMode(getTheme());
    window.addEventListener('storage', onStorage);
    const origSetItem = localStorage.setItem;
    localStorage.setItem = function (...args) {
      origSetItem.apply(this, args);
      if (args[0] === 'theme') onStorage();
    };

    return () => {
      observer.disconnect();
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return (
    <MDEditor
      value={source}
      preview="preview"
      hideToolbar
      visibleDragbar={false}
      height="100lvh"
      enableScroll={false}
      data-color-mode={colorMode}
      previewOptions={{
        remarkPlugins: [
          remarkGfm,
          remarkDeflist,
          remarkHeadingId,
          remarkSupersub,
        ],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeHighlight,
        ],
        components: {
          h1: ({ children, ...props }) => (
            <h1 className="scroll-mt-24 text-4xl font-bold" {...props}>{children}</h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="scroll-mt-24 text-3xl font-semibold" {...props}>{children}</h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="scroll-mt-24 text-2xl font-semibold" {...props}>{children}</h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="scroll-mt-24 text-xl font-semibold" {...props}>{children}</h4>
          ),
          h5: ({ children, ...props }) => (
            <h5 className="scroll-mt-24 text-lg font-semibold" {...props}>{children}</h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="scroll-mt-24 text-base font-semibold uppercase tracking-wide" {...props}>{children}</h6>
          ),
          p: ({ children, ...props }) => (
            <p className="leading-7 text-foreground/90" {...props}>{children}</p>
          ),
          a: ({ href, children, ...props }) => {
            const isExternal = !!href && /^https?:\/\//i.test(href);
            return (
              <a
                href={href}
                className="font-medium underline-offset-4 hover:underline"
                rel={isExternal ? 'noreferrer noopener' : undefined}
                target={isExternal ? '_blank' : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },
          img: ({ alt, ...props }) => (
            <img
              alt={alt ?? ''}
              className="my-6 max-h-[520px] w-full rounded-md border object-contain"
              loading="lazy"
              {...props}
            />
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc space-y-2 pl-6" {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal space-y-2 pl-6" {...props}>{children}</ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-7" {...props}>{children}</li>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-2 border-foreground/30 pl-4 italic text-foreground/80" {...props}>
              {children}
            </blockquote>
          ),
          hr: (props) => <hr className="my-8 border-foreground/20" {...props} />,
          table: ({ children, ...props }) => (
            <div className="my-6 w-full overflow-x-auto">
              <table className="w-full border-collapse text-left" {...props}>{children}</table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-muted/50" {...props}>{children}</thead>
          ),
          th: ({ children, ...props }) => (
            <th className="border px-3 py-2 text-sm font-semibold" {...props}>{children}</th>
          ),
          td: ({ children, ...props }) => (
            <td className="border px-3 py-2 text-sm align-top" {...props}>{children}</td>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children, ...props }) => (
            <pre className="my-6 overflow-x-auto rounded-md border bg-muted/60 p-4 text-sm leading-6" {...props}>
              {children}
            </pre>
          ),
          del: ({ children, ...props }) => (
            <del className="text-foreground/70" {...props}>{children}</del>
          ),
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 align-middle"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
          mark: ({ children, ...props }) => (
            <mark className="rounded bg-yellow-200/70 px-1 dark:bg-yellow-400/30" {...props}>
              {children}
            </mark>
          ),
          sub: ({ children, ...props }) => (
            <sub className="text-xs" {...props}>{children}</sub>
          ),
          sup: ({ children, ...props }) => (
            <sup className="text-xs" {...props}>{children}</sup>
          ),
          dl: ({ children, ...props }) => (
            <dl className="my-6 space-y-2" {...props}>{children}</dl>
          ),
          dt: ({ children, ...props }) => (
            <dt className="font-semibold" {...props}>{children}</dt>
          ),
          dd: ({ children, ...props }) => (
            <dd className="ml-4 text-foreground/80" {...props}>{children}</dd>
          ),
        },
      }}
    />
  );
}
