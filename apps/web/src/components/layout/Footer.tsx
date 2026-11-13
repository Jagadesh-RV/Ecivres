export function Footer() {
  const currentYear = new Date().getFullYear();
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'staging';
  const version = process.env.NEXT_PUBLIC_APP_VERSION || 'v20.0.0-real-cloud-staging-operations';

  return (
    <footer className="border-t bg-muted/20 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <p>© {currentYear} EcivreS. All rights reserved.</p>
          <span className="hidden sm:inline text-muted-foreground/40">•</span>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/75 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {env} ({version})
          </span>
        </div>
        <div className="flex gap-4 text-xs sm:text-sm">
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Security</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
