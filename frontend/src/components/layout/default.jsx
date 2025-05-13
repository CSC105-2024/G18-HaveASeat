import { NavLink } from "react-router";
import { IconPicnicTable } from "@tabler/icons-react";
import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar.jsx";
import { Navigation } from "@/components/navigation/default/index.jsx";
import { NavigationProfile } from "@/components/navigation/default/profile.jsx";

function Layout({ children }) {
  return (
    <div className="flex min-h-screen w-full flex-col justify-between gap-8">
      <section data-layout="content" className="flex flex-col gap-8">
        <header className="flex flex-row items-center justify-between gap-4 bg-zinc-900 px-4 py-2 text-white md:py-2.5">
          <NavLink
            to="/"
            className="flex flex-2/12 flex-row items-center justify-start gap-4"
          >
            <IconPicnicTable className="size-8" />
            <div className="hidden md:inline-flex md:gap-1.5">
              <h1 className="font-semibold">Have A Seat</h1>
              <span className="font-noto-sans-thai self-center text-xs">
                Book It. Sip It. Love It.
              </span>
            </div>
          </NavLink>
          <Navigation />
          <div className="flex flex-row items-center justify-end gap-2 lg:flex-2/12">
            <SidebarTrigger className="flex md:hidden" />
            <NavigationProfile />
          </div>
        </header>
        <main className="px-4">{children}</main>
      </section>
      <footer className="font-noto-sans-thai px-4 py-4 text-center text-xs text-zinc-900">
        Have A Seat © {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default Layout;
