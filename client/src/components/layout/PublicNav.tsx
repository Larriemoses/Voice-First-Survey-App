import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import AppLogo from "../AppLogo";
import { Button } from "../ui/button";

const links = ["Product", "Use cases", "Pricing"];

export function PublicNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-5">
        <Link to="/" className="flex h-7 items-center" aria-label="Survica home">
          <AppLogo className="h-6" imageClassName="max-w-[96px]" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} className="text-base text-gray-500 hover:text-primary-500">
              {link}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link to="/signup">
            <Button className="hero-cta-gradient border-accent-500 text-white hover:border-accent-600">Get started free</Button>
          </Link>
        </div>
        <button type="button" className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden" onClick={() => setOpen((current) => !current)} aria-label="Open menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-gray-200 bg-white px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} className="text-base text-gray-700" onClick={() => setOpen(false)}>
                {link}
              </a>
            ))}
          </div>
          <div className="mt-4 grid gap-2">
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">Log in</Button>
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)}>
              <Button className="hero-cta-gradient w-full border-accent-500 text-white">Get started free</Button>
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
