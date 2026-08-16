import { type ReactNode } from 'react';

interface SectionHeaderProps {
  tag?: string;
  title: ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ tag, title, subtitle, centered = true, className = '' }: SectionHeaderProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {tag && (
        <div
          className="inline-flex items-center gap-1.5 px-2 py-0.5 mb-3 bg-muted/60 border border-border text-muted-foreground l-mono-tag select-none"
          style={{ margin: centered ? '0 auto 12px' : '0 0 12px' }}
        >
          <span className="w-1.5 h-1.5 bg-primary" />
          <span>{tag}</span>
        </div>
      )}
      <h2
        className="l-heading"
        style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', marginBottom: subtitle ? '12px' : '0' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="l-subhead"
          style={{ margin: centered ? '0 auto' : '0', maxWidth: '620px' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
