import { Github } from 'lucide-react';

export const GITHUB_REPOSITORY_URL = 'https://github.com/jarvanstack/markdown-to-resume';

export function GitHubLink({ className = '' }: { className?: string }) {
  return (
    <a
      className={`github-link${className ? ` ${className}` : ''}`}
      href={GITHUB_REPOSITORY_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub"
      title="GitHub"
    >
      <Github size={17} aria-hidden="true" />
    </a>
  );
}
