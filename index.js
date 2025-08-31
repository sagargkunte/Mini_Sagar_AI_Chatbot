import express from 'express';
import router from './routes/ai.sagar.js';
import { config } from 'dotenv';
config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send('Hello from server');
});

app.use('/ai', router); 

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
