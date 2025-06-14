import axios from 'axios';

const BASE_URL = 'https://api.fda.gov/drug';

const fdaApi = {
  // Search for drugs by name
  searchDrugs: async (query) => {
    try {
      const response = await axios.get(`${BASE_URL}/label.json`, {
        params: {
          search: `openfda.brand_name:"${query}" OR openfda.generic_name:"${query}"`,
          limit: 10
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching drugs:', error);
      throw error;
    }
  },

  // Get detailed drug information
  getDrugDetails: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/label.json`, {
        params: {
          search: `id:${id}`
        }
      });
      return response.data.results[0];
    } catch (error) {
      console.error('Error fetching drug details:', error);
      throw error;
    }
  },

  // Get drug interactions
  getDrugInteractions: async (drugs) => {
    try {
      const response = await axios.get(`${BASE_URL}/label.json`, {
        params: {
          search: `drug_interactions:${drugs.join(' AND ')}`,
          limit: 100
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching drug interactions:', error);
      throw error;
    }
  },

  // Get latest drug safety alerts
  getSafetyAlerts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/enforcement.json`, {
        params: {
          limit: 50,
          sort: 'recall_initiation_date:desc'
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error fetching safety alerts:', error);
      throw error;
    }
  }
};

export default fdaApi;
