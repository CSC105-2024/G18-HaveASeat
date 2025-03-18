import { Fragment } from "react";

function Layout({children}) {
  return (
    <Fragment>
      <header>
        <h1>My App</h1>
      </header>
      <main className="main">
        {children}
      </main>
      <footer>
        <p>© 2025 My App</p>
      </footer>
    </Fragment>
  );
}

export default Layout;
