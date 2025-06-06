import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import seedrandom from 'seedrandom';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library'

dotenv.config()

const app = express()
const PORT = process.env.PORT

if (typeof process.env.GOOGLE_SPREADSHEET_ID == 'undefined'){
  throw new Error('Environment variable GOOGLE_SPREADSHEET_ID missing')
}
if (typeof process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL == 'undefined'){
  throw new Error('Environment variable GOOGLE_SERVICE_ACCOUNT_EMAIL missing')
}
if (typeof process.env.GOOGLE_PRIVATE_KEY == 'undefined'){
  throw new Error('Environment variable GOOGLE_PRIVATE_KEY missing')
}

const jwt = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY,
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID, jwt)

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

// Cache for spreadsheet items
let cachedItems: Item[] | null = null;

//Fetch items from spreadsheet
async function getSpreadsheetItems(): Promise<Item[]> {
  
}

//todo redo this and move database to mongodb

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});