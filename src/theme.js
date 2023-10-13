// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
        default: '#FFFFFF', // Set the default background color to white
      },
    primary: {
      main: '#96B34F', // Your primary color
    },
    secondary: {
      main: '#1976D2', // Your secondary color
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default theme;