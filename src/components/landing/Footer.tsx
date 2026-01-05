const Footer = () => {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">P</span>
            </div>
            <span className="font-semibold">Propel</span>
          </div>
          
          <nav className="flex items-center gap-6">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Refund Policy
            </a>
          </nav>
          
          <p className="text-sm text-muted-foreground">
            © 2024 Propel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
