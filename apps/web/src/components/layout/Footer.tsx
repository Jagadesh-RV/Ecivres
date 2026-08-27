export function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} EcivreS. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
