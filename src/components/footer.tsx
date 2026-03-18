
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 py-4 text-center text-xs text-muted-foreground">
      <div className="flex flex-wrap items-center justify-center gap-1">
        <span>© {year} Zetta — Todos os direitos reservados.</span>
      </div>
    </footer>
  );
};

export default Footer;
