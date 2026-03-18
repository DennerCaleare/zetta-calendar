"use client";

import { useEffect, useRef, useState } from "react";

import { Logo } from "./logo";
import UserAvatar from "./user-avatar";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-30 border-b transition-all duration-300 ${
        scrolled
          ? "border-border/80 bg-card/95 backdrop-blur-md shadow-sm shadow-slate-900/5"
          : "border-border/30 bg-card/70 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />
        <UserAvatar />
      </div>
    </header>
  );
};

export default Header;
