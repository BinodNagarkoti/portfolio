'use client';

import { useEffect, useRef, useState } from 'react';
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
  fullHeight?: boolean;
};

function getTheme(): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'dark';
  const saved = localStorage.getItem('theme');
  if (saved === 'light') return 'light';
  if (saved === 'dark') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function MarkdownPreview({ source, fullHeight = false }: MarkdownPreviewProps) {
  const [colorMode, setColorMode] = useState<'light' | 'dark' | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (fullHeight && containerRef.current) {
      const previewEl = containerRef.current.querySelector<HTMLDivElement>('.w-md-editor-preview');
      if (previewEl) {
        previewEl.style.height = 'auto';
        previewEl.style.overflow = 'visible';
      }
      const contentEl = containerRef.current.querySelector<HTMLDivElement>('.w-md-editor-content');
      if (contentEl) {
        contentEl.style.height = 'auto';
      }
    }
  }, [fullHeight]);

  if (colorMode === undefined) {
    return (
      <div className="bg-card/60 dark:bg-card/40 rounded">
        <div className="px-4 py-8 sm:px-6 sm:py-10 space-y-6 animate-pulse">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      <MDEditor
        value={source}
        preview="preview"
        hideToolbar
        visibleDragbar={false}
        height={fullHeight ? 'unset' : '100lvh'}
        enableScroll={!fullHeight}
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
              <h1 className="scroll-mt-24" {...props}>{children}</h1>
            ),
            h2: ({ children, ...props }) => (
              <h2 className="scroll-mt-24" {...props}>{children}</h2>
            ),
            h3: ({ children, ...props }) => (
              <h3 className="scroll-mt-24" {...props}>{children}</h3>
            ),
            h4: ({ children, ...props }) => (
              <h4 className="scroll-mt-24" {...props}>{children}</h4>
            ),
            h5: ({ children, ...props }) => (
              <h5 className="scroll-mt-24" {...props}>{children}</h5>
            ),
            h6: ({ children, ...props }) => (
              <h6 className="scroll-mt-24" {...props}>{children}</h6>
            ),
            p: ({ children, ...props }) => (
              <p {...props}>{children}</p>
            ),
            a: ({ href, children, ...props }) => {
              const isExternal = !!href && /^https?:\/\//i.test(href);
              return (
                <a
                  href={href}
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
                loading="lazy"
                {...props}
              />
            ),
            ul: ({ children, ...props }) => (
              <ul {...props}>{children}</ul>
            ),
            ol: ({ children, ...props }) => (
              <ol {...props}>{children}</ol>
            ),
            li: ({ children, ...props }) => (
              <li {...props}>{children}</li>
            ),
            blockquote: ({ children, ...props }) => (
              <blockquote {...props}>
                {children}
              </blockquote>
            ),
            hr: (props) => <hr {...props} />,
            table: ({ children, ...props }) => (
              <div className="w-full overflow-x-auto">
                <table className="text-left" {...props}>{children}</table>
              </div>
            ),
            thead: ({ children, ...props }) => (
              <thead {...props}>{children}</thead>
            ),
            th: ({ children, ...props }) => (
              <th {...props}>{children}</th>
            ),
            td: ({ children, ...props }) => (
              <td {...props}>{children}</td>
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className;
              if (isInline) {
                return (
                  <code {...props}>
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
              <pre {...props}>
                {children}
              </pre>
            ),
            del: ({ children, ...props }) => (
              <del {...props}>{children}</del>
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
              <mark {...props}>
                {children}
              </mark>
            ),
            sub: ({ children, ...props }) => (
              <sub {...props}>{children}</sub>
            ),
            sup: ({ children, ...props }) => (
              <sup {...props}>{children}</sup>
            ),
            dl: ({ children, ...props }) => (
              <dl {...props}>{children}</dl>
            ),
            dt: ({ children, ...props }) => (
              <dt {...props}>{children}</dt>
            ),
            dd: ({ children, ...props }) => (
              <dd {...props}>{children}</dd>
            ),
          },
        }}
      />
    </div>
  );
}
