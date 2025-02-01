import axios from 'axios';

// Define the base URL for the Alephium API (adjust if needed)
const API_BASE_URL = 'https://api.alephium.org';  // This is a placeholder; replace it with the actual API endpoint if necessary.

// Function to fetch the balance for an address
export const getAddressBalance = async (address: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/addresses/${address}/balance`);
    return response.data; // Return the balance from the API response
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

// Placeholder for any other future API interactions (e.g., transaction creation)
