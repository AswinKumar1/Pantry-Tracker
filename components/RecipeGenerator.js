import React, { useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Button, Typography, List, ListItem } from '@mui/material';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
    dangerouslyAllowBrowser: true,
  });
  
  const RecipeGenerator = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const generateRecipes = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'pantry'));
        const items = querySnapshot.docs.map(doc => doc.data());
  
        console.log('Pantry Items:', items);
  
        const itemNames = items.map(item => item.name).join(', ');
  
        const response = await fetchWithRetry(() => openai.chat.completions.create({
          model: 'openai/gpt-3.5-turbo',  // Using openai/gpt-3.5-turbo model from OpenRouter
          messages: [
            { role: 'user', content: `Generate a recipe using the following ingredients: ${itemNames}.` }
          ],
        }));
  
        console.log('API Response:', response);
  
        const text = response.choices[0]?.message.content.trim() || 'No recipes found.';
        const generatedRecipes = text.split('\n').filter(recipe => recipe.trim().length > 0);
        setRecipes(generatedRecipes);
      } catch (error) {
        console.error('Error generating recipes:', error.message || error);
        setRecipes(['Error generating recipes']);
      } finally {
        setLoading(false);
      }
    };
  
    // Retry logic with exponential backoff
    const fetchWithRetry = async (fetchFn, retries = 3, delay = 1000) => {
      try {
        return await fetchFn();
      } catch (error) {
        if (retries > 0 && error.status === 429) {
          console.warn(`Retrying due to rate limit: ${retries} retries left`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(fetchFn, retries - 1, delay * 2);
        } else {
          throw error;
        }
      }
    };
  
    return (
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={generateRecipes} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Recipes'}
        </Button>
        <Typography variant="h6" component="h2" style={{ marginTop: '20px' }}>
          Recipes:
        </Typography>
        <List>
          {recipes.length > 0 ? (
            recipes.map((recipe, index) => (
              <ListItem key={index}>
                <Typography variant="body1">
                  {recipe}
                </Typography>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <Typography variant="body1">
                No recipes to display.
              </Typography>
            </ListItem>
          )}
        </List>
      </div>
    );
  };
  
  export default RecipeGenerator;
  