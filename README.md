# Sample Airbnb Booking Application (By Nathan - s3993380)

A full-stack booking application built with React, Express.js, and MongoDB, utilizing the sample_airbnb data model. It uses the listingsAndReviews collection to display available listings and uses the bookings collection which uses the referencing model to store and display bookings made by users. The client information is embedded in the booking collection.

## Project Structure

The project is divided into two main parts:

### Backend
- Built with Express.js
- Runs on port 3001
- Handles API requests and database operations
- Uses MongoDB for data storage
- Implements RESTful API endpoints

### Frontend
- Built with React and Next.js
- Runs on port 3000
- Uses Chakra UI for styling
- Consists of three main pages:
  - Home page (listings)
  - Booking page
  - Confirmation page

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
Runs on port 3001
```bash
npm run dev:server
```

3. Start the frontend server:
Runs on port 3000
```bash
cd ..
npm run dev
```

## API Endpoints

- `GET /api/listings` - Get all listings
- `POST /api/listings/filter` - Filter listings based on location. Number of bedrooms and property type are optional filter options
- `GET /api/listings/:id` - Get specific listing 
- `GET /api/listing/property-types` - Get property types
- `GET /api/listing/bedrooms` - Get bedroom options
- `POST /api/booking` - Create booking
- `GET /api/bookings/:id` - Get booking details

## Data Model

The application uses two main collections:
- `listingsAndReviews`: Stores details about a listing
- `Bookings`: Stores booking information with references to listings and embeds client information
