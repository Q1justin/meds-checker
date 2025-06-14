import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <LocalHospitalIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Meds Checker
          </Button>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
          >
            Search
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/interactions"
          >
            Interactions
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/safety"
          >
            Safety Alerts
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
