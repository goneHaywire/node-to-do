const applyMiddleware =
  (middleware: unknown) =>
  <T extends { use: Function }>(router: T): T =>
    router.use(middleware);

export { applyMiddleware };
