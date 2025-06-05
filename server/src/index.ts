import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import seedrandom from 'seedrandom';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json());

// Sample item pool
interface Item {
  id: string;
  name: string;
  type: 'Passive' | 'Active';
  category: string;
}

const itemPool: Item[] = [
  { id: '1', name: 'Magic Orb', type: 'Passive', category: 'Arcane' },
  { id: '2', name: 'Fire Wand', type: 'Active', category: 'Elemental' },
  { id: '3', name: 'Healing Stone', type: 'Passive', category: 'Support' },
];

// Daily answer endpoint
app.get('/daily', (req: Request, res: Response) => {
  const seed = new Date().toISOString().split('T')[0];
  seedrandom(seed, { global: true });
  const dailyItem = itemPool[Math.floor(Math.random() * itemPool.length)];
  res.json({ itemId: dailyItem.id });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});