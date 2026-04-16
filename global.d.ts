declare module '*.css' {
  const content: { readonly [className: string]: string };
  export default content;
}

declare module '*.scss';
declare module '*.sass';
