function constructAPIUrl(path) {
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  return baseURL + path;
}

export { constructAPIUrl };
