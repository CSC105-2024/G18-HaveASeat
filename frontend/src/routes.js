import pages from "~react-pages";

const pageModules = import.meta.glob("./pages/**/*.jsx", { eager: true });

const routes = pages.map((route) => {
  let pageModule;

  if (route.path === "/") {
    pageModule = pageModules[`./pages/index.jsx`];
  } else {
    pageModule = pageModules[`./pages/${route.path}.jsx`] || pageModules[`./pages/${route.path}/index.jsx`];
  }

  return {
    ...route,
    metadata: pageModule?.metadata || {},
    generateMetadata: pageModule?.generateMetadata || null,
  };
});

export default routes;
