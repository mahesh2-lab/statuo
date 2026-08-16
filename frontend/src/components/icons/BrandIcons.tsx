import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Better Auth Yellow Geometric Logo
export const BetterAuthLogo: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path d="M4 4h4v6h8V4h4v16h-4v-6H8v6H4V4z" />
  </svg>
);

// Google 4-Color SVG Logo
export const GoogleIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

// GitHub Solid White SVG Logo
export const GitHubIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

// Apple Logo
export const AppleIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.61 1.35-.55.63-1.03 1.67-.9 2.69 1.01.08 2.02-.51 2.58-1.19z" />
  </svg>
);

// Discord Logo
export const DiscordIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Vercel Triangle Logo
export const VercelIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M24 22.525H0l12-21.05 12 21.05z" />
  </svg>
);

// OpenAI Logo
export const OpenAIIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.771-4.204 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.746-7.075zM13.26 22.13a4.2 4.2 0 0 1-2.73-1.025l.135-.075 4.54-2.62a.91.91 0 0 0 .455-.788v-6.417l1.93 1.115v5.59a4.225 4.225 0 0 1-4.33 4.22zm-7.75-3.32a4.195 4.195 0 0 1-1.57-2.48 4.24 4.24 0 0 1 .47-2.95l.135.08 4.54 2.62a.91.91 0 0 0 .91 0l5.555-3.21v2.23l-4.84 2.8a4.22 4.22 0 0 1-5.2 0zm-1.82-8.52a4.195 4.195 0 0 1 1.16-2.69 4.24 4.24 0 0 1 2.92-1.07l-.005.155v5.24a.91.91 0 0 0 .455.788l5.555 3.208-1.93 1.115-4.84-2.795a4.225 4.225 0 0 1-3.315-3.94zm14.61 2.23-5.555-3.21 1.93-1.115 4.84 2.795a4.235 4.235 0 0 1 2.15 5.46 4.2 4.2 0 0 1-2.91 2.29v-5.432a.91.91 0 0 0-.455-.788zm2.01-4.72a4.2 4.2 0 0 1 .47 2.95l-.135-.08-4.54-2.62a.91.91 0 0 0-.91 0L9.63 11.27V9.04l4.84-2.8a4.22 4.22 0 0 1 5.2 0 4.19 4.19 0 0 1 1.15 2.48zM8.33 8.64a4.2 4.2 0 0 1 4.33-4.22 4.2 4.2 0 0 1 2.73 1.025l-.135.075-4.54 2.62a.91.91 0 0 0-.455.788v6.417l-1.93-1.115v-5.59z" />
  </svg>
);

// Databricks Logo
export const DatabricksIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M2.378 12.01l9.622-5.438 9.622 5.438-9.622 5.438-9.622-5.438zm9.622-8.01L0 10.686l12 6.786 12-6.786L12 4z" />
  </svg>
);

// Strapi Logo
export const StrapiIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-3h3v-2h-3v-3h-2v8h2z" />
  </svg>
);

// Next.js Logo
export const NextJsIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M9 8.5v7m0-7l7 9m0-9v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Nuxt Logo
export const NuxtIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M8.5 17.5l-6-10.5h4.5l3.75 6.5 4.5-8h4.5l-6.75 12z" />
  </svg>
);

// SvelteKit Logo
export const SvelteIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M19.5 7.5C18.5 5 15.5 4 12 4c-4.5 0-7.5 2-7.5 5.5 0 4.5 5 5 7.5 5.5 3 .5 4.5 1.5 4.5 3s-2.5 3-4.5 3c-3 0-5.5-1-6.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

// Astro Logo
export const AstroIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2L6 18h3.5l1.5-4h2l1.5 4H18L12 2zm0 6l1.2 3.5h-2.4L12 8z" />
  </svg>
);

// Hono Logo
export const HonoIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 2C8 6 6 9 6 13a6 6 0 0 0 12 0c0-4-2-7-6-11z" fill="#f97316" />
  </svg>
);
