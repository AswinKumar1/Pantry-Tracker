import { useState } from 'react';
import { TextField, Button, Grid, Box } from '@mui/material';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const PantryForm = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'pantry'), {
        name,
        quantity,
      });
      onAdd({ name, quantity, id: docRef.id });
      setName('');
      setQuantity('');
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Item
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PantryForm;
