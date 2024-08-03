import { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PantryForm from '../components/PantryForm';
import SearchBar from '../components/SearchBar';
import Camera from '../components/Camera';
import RecipeGenerator from '../components/RecipeGenerator';
import { Card, CardContent, Typography, Container, Grid, Button, Box } from '@mui/material';

export default function Home() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const q = query(collection(db, 'pantry'));
      const querySnapshot = await getDocs(q);
      const itemsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setItems(itemsData);
      setFilteredItems(itemsData);
    };

    fetchItems();
  }, []);

  const handleSearch = (searchTerm) => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  const handleAdd = (item) => {
    setItems(prevItems => [...prevItems, item]);
    setFilteredItems(prevItems => [...prevItems, item]);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'pantry', id));
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);
      setFilteredItems(updatedItems);
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        My Pantry
      </Typography>
      <Box sx={{ mb: 4 }}>
        <PantryForm onAdd={handleAdd} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <SearchBar onSearch={handleSearch} />
      </Box>
      <Box sx={{ mb: 4 }}>
        <Camera />
      </Box>
      <Box sx={{ mb: 4 }}>
        <RecipeGenerator />
      </Box>
      <Grid container spacing={3}>
        {filteredItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {item.name}
                </Typography>
                <Typography color="textSecondary">
                  Quantity: {item.quantity}
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
