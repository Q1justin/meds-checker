import React, { useState } from 'react';
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import fdaApi from '../../../services/fdaApi';

const InteractionChecker = () => {
  const [selectedDrugs, setSelectedDrugs] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (value) => {
    if (!value) {
      setSearchResults([]);
      return;
    }

    try {
      const results = await fdaApi.searchDrugs(value);
      setSearchResults(results.map(drug => ({
        id: drug.id,
        label: drug.openfda?.brand_name?.[0] || drug.openfda?.generic_name?.[0]
      })));
    } catch (err) {
      console.error('Error searching drugs:', err);
    }
  };

  const handleAddDrug = (drug) => {
    if (drug && !selectedDrugs.find(d => d.id === drug.id)) {
      setSelectedDrugs([...selectedDrugs, drug]);
    }
    setSearchInput('');
  };

  const handleRemoveDrug = (drugToRemove) => {
    setSelectedDrugs(selectedDrugs.filter(drug => drug.id !== drugToRemove.id));
  };

  const checkInteractions = async () => {
    if (selectedDrugs.length < 2) {
      setError('Please select at least two medications to check for interactions.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await fdaApi.getDrugInteractions(selectedDrugs.map(drug => drug.id));
      setInteractions(results);
    } catch (err) {
      setError('Error checking drug interactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Medication Interaction Checker
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Selected Medications
          </Typography>
          
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {selectedDrugs.map((drug) => (
              <Chip
                key={drug.id}
                label={drug.label}
                onDelete={() => handleRemoveDrug(drug)}
              />
            ))}
          </Box>

          <Autocomplete
            freeSolo
            options={searchResults}
            inputValue={searchInput}
            onInputChange={(event, value) => {
              setSearchInput(value);
              handleSearch(value);
            }}
            onChange={(event, value) => handleAddDrug(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add medication"
                variant="outlined"
                fullWidth
              />
            )}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={checkInteractions}
            disabled={selectedDrugs.length < 2 || loading}
          >
            Check Interactions
          </Button>
        </CardContent>
      </Card>

      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {interactions.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Interaction Results
            </Typography>
            {interactions.map((interaction, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" color="primary">
                  {interaction.drug_interactions?.[0]}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default InteractionChecker;
