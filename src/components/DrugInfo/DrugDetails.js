import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper
} from '@mui/material';
import fdaApi from '../../services/fdaApi';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} role="tabpanel">
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const DrugDetails = () => {
  const { id } = useParams();
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchDrugDetails = async () => {
      try {
        const data = await fdaApi.getDrugDetails(id);
        setDrug(data);
      } catch (err) {
        setError('Error loading medication details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDrugDetails();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!drug) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        No medication details found.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {drug.openfda?.brand_name?.[0] || drug.openfda?.generic_name?.[0]}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            {drug.openfda?.manufacturer_name?.[0]}
          </Typography>
          
          <Paper sx={{ mt: 3 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Usage" />
              <Tab label="Warnings" />
              <Tab label="Side Effects" />
              <Tab label="Storage" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Indications & Usage
              </Typography>
              <Typography>
                {drug.indications_and_usage?.[0]}
              </Typography>
              
              <Typography variant="h6" sx={{ mt: 2 }} gutterBottom>
                Dosage
              </Typography>
              <Typography>
                {drug.dosage_and_administration?.[0]}
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <List>
                {drug.warnings?.map((warning, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={warning} />
                  </ListItem>
                ))}
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography>
                {drug.adverse_reactions?.[0]}
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Typography>
                {drug.storage_and_handling?.[0]}
              </Typography>
            </TabPanel>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DrugDetails;
