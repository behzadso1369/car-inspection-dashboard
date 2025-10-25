import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.scss'
import '@fortawesome/fontawesome-free/css/all.min.css';
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional Theme applied to the grid
// const THEME = createTheme({
//   direction: 'rtl',
//   typography: {
//     fontFamily: 'IRANYekan',
//   },
//   breakpoints: {
//     values: {
//       xs: 640,
//       sm: 768,
//       md: 1024,
//       lg: 1280,
//       xl: 1636,
//     },
//   },
// });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
  
      <App />

  
  

    </StrictMode>
);
document.dir = "rtl";
