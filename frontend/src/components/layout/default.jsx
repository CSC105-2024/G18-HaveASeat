import { Fragment } from "react";
import { NavLink } from "react-router";

function Layout({children}) {
  return (
    <div className="flex flex-col gap-8 justify-between min-h-screen">
      <section className="flex flex-col gap-8">
        <header className="bg-gray-50 py-4 px-4">
          <NavLink to="/">
            <h1 className="font-semibold">Have A Seat</h1>
            <span className="text-xs">Book It. Sip It. Love It.</span>
          </NavLink>
        </header>
        <main className="px-4">
          {children}
        </main>
      </section>
      <footer className="bg-zinc-900 text-center text-white py-4 px-4">
        <p className="font-semibold">Have A Seat</p>
        <span className="text-xs">Book It. Sip It. Love It. © {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default Layout;
