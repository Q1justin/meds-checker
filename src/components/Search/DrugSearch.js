import { useState } from 'react';
import { 
  TextField, 
  IconButton, 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import fdaApi from '../../services/fdaApi';

const DrugSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const searchResults = await fdaApi.searchDrugs(searchText);
      setResults(searchResults);
    } catch (err) {
      setError('Error searching for medications. Please try again.');
      setResults([]);
    }
	setLoading(false);
  };

  const handleDrugSelect = (drugId) => {
    navigate(`/drug/${drugId}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Search Medications
      </Typography>
      
      <form onSubmit={handleSearch}>
        <Box sx={{ display: 'flex', gap: 1, mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter a medicine name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <IconButton 
            type="submit" 
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <SearchIcon />
          </IconButton>
        </Box>
      </form>

	  {
		loading
		? (
			<Box display="flex" justifyContent="center">
			<CircularProgress />
			</Box>
      	)
		: error
		? (
			<Alert severity="error" sx={{ mb: 2 }}>
			{error}
			</Alert>
      	)
		: results.length > 0
		? (
			<Card>
				<CardContent>
					<List>
					{results.map((drug, index) => (
						<ListItem
						key={index}
						button
						onClick={() => handleDrugSelect(drug.id)}
						divider={index !== results.length - 1}
						>
						<ListItemText
							primary={drug.openfda?.brand_name?.[0] || drug.openfda?.generic_name?.[0]}
							secondary={drug.openfda?.manufacturer_name?.[0]}
						/>
						</ListItem>
					))}
					</List>
				</CardContent>
			</Card>
      	)
		: <></>
	  }
    </Box>
  );
};

export default DrugSearch;
