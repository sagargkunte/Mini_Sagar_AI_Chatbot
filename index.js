import express from 'express';
import router from './routes/ai.sagar.js';

const app = express();
const PORT = 3000;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello from server');
});

app.post('/ai', router); 

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:3000`);
});
