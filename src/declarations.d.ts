declare module '*.css';
declare module '*.png';

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}
