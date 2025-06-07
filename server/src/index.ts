import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import seedrandom from 'seedrandom';
import { MongoClient } from 'mongodb';
import { connect } from 'http2';

dotenv.config()

const app = express()
const PORT = process.env.PORT

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI missing');
}

const client = new MongoClient(process.env.MONGODB_URI)
let itemsCollection: any

async function connectMongoDB(){
  try {
    await client.connect()
    const db = client.db('Wordlelands')
    itemsCollection = db.collection('items')
    await itemsCollection.createIndex({ ID: 1})

    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection failed: ', error)
    process.exit(1)
  }
}

connectMongoDB()

// Middleware
app.use(cors());
app.use(express.json());

//item pool
interface Item {
  id: string;
  name: string;
  rarity: string;
  type: string;
  manufacturer: string;
  game: string;
  elements: string;
  redText: string;
}

app.get('/daily', async (req: Request, res: Response) =>{
  try {
    const seed = new Date().toISOString().split('T')[0]
    seedrandom(seed, {global:true})
    const randomSkip = Math.floor(Math.random() * await itemsCollection.countDocuments());
    const dailyItem = await itemsCollection.find().skip(randomSkip).limit(1).toArray()

    if (!dailyItem[0]){
      return res.status(404).json({ error: 'No items in database'})
    }

    res.json({itemId: dailyItem[0].ID})
  } catch (error) {
    console.error('Error in /daily endpoint: ', error)
    res.status(500).json({error: 'Failed to get daily item'})
  }
})

process.on('SIGTERM', async () => {
  await client.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});