import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-12 pt-6 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <div>
          Created by <a href="https://x.com/desktopofsamuel" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">@desktopofsamuel</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://buymeacoffee.com/desktopofsamuel" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Buy me a coffee</Link>
          <a href="/changelog" className="text-brand hover:underline">Changelog</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
} 