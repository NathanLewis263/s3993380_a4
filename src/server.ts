import express from 'express';
import type { Request, Response } from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri!);

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

//filter interface
interface Filter {
    "address.market": { $regex: RegExp } | string;
    property_type?: string;
    bedrooms?: number;
}

// API Routes
app.get('/api/listings', async (req: Request, res: Response): Promise<void> => {
    console.log('Received request for listings');
    try {
      const database = client.db('sample_airbnb');
      const collection = database.collection('listingsAndReviews');
      
      const listings = await collection.find({}, { 
        projection: {
          _id: 1, 
          name: 1, 
          summary: 1, 
          price: 1, 
          "review_scores.review_scores_rating": 1
        } 
      }).toArray();
  
      // Convert Decimal128 price to number
      const formattedListings = listings.map(listing => ({
        ...listing,
        price: Number(listing.price)
      }));
  
      res.status(200).json(formattedListings);
    } catch (error: any) {
      console.error('Error fetching listings:', error);
      res.status(500).json({ message: 'Error fetching listings', error: error.message });
    }
  })

//filter listings
app.post('/api/listings/filter', async (req: Request, res: Response): Promise<void> => {
    const { location, propertyType, bedrooms } = req.body;
    if (!location) {
        res.status(400).json({ message: 'Location is required' });
        return;
    }

    try {
        const database = client.db('sample_airbnb');
        const collection = database.collection('listingsAndReviews');
        
        const filter: Filter = {
            "address.market": { $regex: new RegExp(location, 'i') } // location is case insensitive
        };

        if (propertyType) {
            filter.property_type = propertyType;
        }
        if (bedrooms) {
            filter.bedrooms = Number(bedrooms);
        }

        const listings = await collection.find(filter, {
            projection: {
                _id: 1,
                name: 1,
                summary: 1,
                price: 1,
                "review_scores.review_scores_rating": 1
            }
        }).toArray();

        const formattedListings = listings.map(listing => ({
            ...listing,
            price: Number(listing.price)
        }));
        
        res.status(200).json(formattedListings);
    } catch (error: any) {
        console.error('Error fetching filtered listings:', error);
        res.status(500).json({ message: 'Error fetching filtered listings', error: error.message });
    }
});

//get listing by id
app.get('/api/listings/:id', async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const database = client.db('sample_airbnb');
        const collection = database.collection('listingsAndReviews');
        const listing = await collection.findOne({ _id: new ObjectId(id)});
        if (!listing) {
            res.status(404).json({ message: 'Listing not found' });
            return;
        }
        res.status(200).json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listing' });
    }
});

// get distinct property types
app.get('/api/listing/property-types', async (req: Request, res: Response): Promise<void> => {
    try {
        const database = client.db('sample_airbnb');
        const collection = database.collection('listingsAndReviews');
        const propertyTypes = await collection.distinct('property_type');
        res.status(200).json(propertyTypes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching property types' });
    }
});

//get distinct bedrooms
app.get('/api/listing/bedrooms', async (req: Request, res: Response): Promise<void> => {
    try {
        const database = client.db('sample_airbnb');
        const collection = database.collection('listingsAndReviews');
        const bedrooms = await collection.distinct('bedrooms');
        res.status(200).json(bedrooms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bedrooms' });
    }
}); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});