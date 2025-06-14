import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Collapse
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import fdaApi from '../../services/fdaApi';

const SafetyAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAlerts, setExpandedAlerts] = useState({});

  useEffect(() => {
    fetchSafetyAlerts();
  }, []);

  const fetchSafetyAlerts = async () => {
    try {
      const data = await fdaApi.getSafetyAlerts();
      setAlerts(data);
    } catch (err) {
      setError('Error loading safety alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAlert = (alertId) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }));
  };

  const getSeverityColor = (classification) => {
    switch (classification?.toLowerCase()) {
      case 'class i':
        return 'error';
      case 'class ii':
        return 'warning';
      case 'class iii':
        return 'info';
      default:
        return 'default';
    }
  };

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

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Recent Safety Alerts
      </Typography>

      <List>
        {alerts.map((alert, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {alert.product_description}
                  </Typography>
                  <Chip 
                    label={alert.classification || 'Unclassified'} 
                    color={getSeverityColor(alert.classification)}
                    sx={{ mb: 1 }}
                  />
                  <Typography color="textSecondary" variant="body2">
                    {new Date(alert.recall_initiation_date).toLocaleDateString()}
                  </Typography>
                </Box>
                <IconButton onClick={() => toggleAlert(index)}>
                  {expandedAlerts[index] ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Collapse in={expandedAlerts[index]}>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Reason for Recall
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {alert.reason_for_recall}
                  </Typography>

                  <Typography variant="subtitle1" gutterBottom>
                    Product Details
                  </Typography>
                  <ListItem>
                    <ListItemText 
                      primary="Manufacturer"
                      secondary={alert.recalling_firm}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Distribution"
                      secondary={alert.distribution_pattern}
                    />
                  </ListItem>
                  {alert.product_quantity && (
                    <ListItem>
                      <ListItemText 
                        primary="Quantity"
                        secondary={alert.product_quantity}
                      />
                    </ListItem>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
};

export default SafetyAlerts;
