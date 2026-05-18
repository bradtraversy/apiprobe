import { Github } from "lucide-react";

const GitHubLink = () => {
  return (
    <a
      href="https://github.com/bradtraversy/apiprobe"
      target="_blank"
      rel="noopener noreferrer"
      className="p-2 bg-card border border-line rounded-md text-fg-muted hover:text-fg hover:border-line-strong transition-colors duration-150"
      aria-label="View on GitHub"
    >
      <Github className="w-4 h-4" />
    </a>
  );
};

export default GitHubLink;
