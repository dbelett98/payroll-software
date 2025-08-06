// types.d.ts: Custom declarations for modules to fix TS resolution errors (free open-source TS feature, zero cost—no installs needed).
declare module 'react' {
  import * as React from 'react';  // Declares React (free, resolves import).
  export = React;
}

declare module 'axios' {
  import * as Axios from 'axios';  // Declares Axios (free, resolves import).
  export = Axios;
}

declare module '@tanstack/react-table' {
  export function useTable<TData>(options: any): any;  // Basic declaration for useTable (free placeholder; expand if needed).
  export type Column<TData> = any;  // Placeholder for Column type (free).
}