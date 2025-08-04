import { Github } from 'lucide-react';

const GitHubLink = () => {
  return (
    <a
      href='https://github.com/bradtraversy/apiprobe'
      target='_blank'
      rel='noopener noreferrer'
      className='p-2 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-lg hover:bg-slate-800 hover:border-slate-700 transition-all duration-200 group'
      aria-label='View on GitHub'
    >
      <Github className='w-5 h-5 text-slate-600 group-hover:text-white transition-colors' />
    </a>
  );
};

export default GitHubLink;
