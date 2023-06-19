import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ArticleTable from '@/components/ArticleTable';
import Header from '@/components/Header/Header';

const defaultTheme = createTheme();
const MainPage = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <Header />
      <Container disableGutters maxWidth="xl" component="main" sx={{ pt: 8, pb: 6 }}>
        <ArticleTable />
      </Container>
    </ThemeProvider>
  );
};

export default MainPage;
