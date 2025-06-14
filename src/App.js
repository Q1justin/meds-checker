import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import theme from './styles/theme';

import Navbar from './components/Navbar';
import DrugSearch from './components/Search/DrugSearch';
import DrugDetails from './components/DrugInfo/DrugDetails';
import InteractionChecker from './components/Interactions/InteractionChecker';
import SafetyAlerts from './components/Safety/SafetyAlerts';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<DrugSearch />} />
              <Route path="/drug/:id" element={<DrugDetails />} />
              <Route path="/interactions" element={<InteractionChecker />} />
              <Route path="/safety" element={<SafetyAlerts />} />
            </Routes>
          </ErrorBoundary>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
