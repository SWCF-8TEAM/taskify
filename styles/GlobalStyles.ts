import { createGlobalStyle } from "styled-components";
import { BLACK, GRAY, MAIN } from "@/styles/ColorStyles";

const GlobalStyles = createGlobalStyle`
  :root {
    ${BLACK};
    ${GRAY};
    ${MAIN};
  }

  * {
    box-sizing: border-box;
    font-family: 'Pretendard';
  }

  html {
    font-size: 62.5%;
    background-color: #ffffff;
    word-break: keep-all;
  }

  html, body, div, span, h1, h2, h3, h4, h5, h6, p,
    a, dl, dt, dd, ol, ul, li, form, label, table {
      margin: 0; 
      padding: 0;
      border: 0;
      vertical-align: baseline;

      &::-webkit-scrollbar {
        width: 0.5rem;
        height: 0.5rem;
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--ScrollBar);
        border-radius: 5rem;
      }
  }

  a {
    text-decoration: none;
    color: inherit;
  }
  
  ol, ul{
    list-style: none;
  }

  button {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
  }

`;

export default GlobalStyles;
