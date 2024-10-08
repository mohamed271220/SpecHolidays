# SpecHolidays

A full-stack hotel booking website built with a TypeScript-based frontend and backend. The frontend is developed using React, Vite, and Tailwind CSS, while the backend is powered by Express.js. This application allows users to book hotels, upload hotel listings, search and filter through hotels, make payments with Stripe, and upload images to the cloud using Cloudinary.

## Features

- **Hotel Booking**: Users can browse and book hotels directly through the platform.
- **Hotel Upload**: Hotel owners can upload their hotels with details and images.
- **Payment Integration**: Secure payments are handled via Stripe.
- **Search Functionality**: Users can search for hotels based on various criteria.
- **Filtering Options**: Advanced filtering options to refine search results.
- **Image Upload**: Images are uploaded to Cloudinary, ensuring efficient storage and retrieval.

## Tech Stack

### Frontend

- **React**: JavaScript library for building user interfaces.
- **Vite**: Next-generation frontend tooling for fast and efficient builds.
- **Tailwind CSS**: A utility-first CSS framework for styling.

### Backend

- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm or yarn
- TypeScript

### Installation

1. **Clone the repository:**

    ```bash
       git clone https://github.com/mohamed271220/SpecHolidays
    ```

2. **Install dependencies for both frontend and backend:**

    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

### Running the Development Servers

#### Frontend

To run the frontend development server:

```bash
cd frontend
npm run dev
```

#### Backend

To run the backend development server:

```bash
cd backend
npm run dev
```

### Build and Deploy

#### Frontend

To build the frontend for production:

```bash
cd frontend
npm run build
```

#### Backend

To build the backend for production:

```bash
cd backend
npm run build
```

### Start the Server

To start the backend server:

```bash
cd backend
npm start
```

### Testing

To run end-to-end tests for the backend:

```bash
cd backend
npm run e2e
```

## Environment Variables

Ensure you configure the following environment variables in your `.env` file:

- **MONGO_DB**: Your MongoDB connection string.
- **JWT_SECRET_KEY**: Secret key for JWT token generation and verification.
- **CLIENT_URL**: URL of the frontend client.
- **CLOUDINARY_CLOUD_NAME**: Cloudinary cloud name for image uploads.
- **CLOUDINARY_API_KEY**: Cloudinary API key for authentication.
- **CLOUDINARY_API_SECRET**: Cloudinary API secret for secure API access.
- **STRIPE_SECRET_KEY**: Secret key for Stripe payment processing.


## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.
