
### **Frontend Setup** (`frontend/README.md`)
# Movie Manager Frontend

## 📋 Prerequisites
- Node.js v18+
- Running backend API

## 🚀 Installation
git clone https://github.com/sama556/movie-frontend.git
cd movie-manager-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env


# Local development
VITE_API_URL=http://localhost:3001/api/media

# Production
# VITE_API_URL=https://backend.app/api/media


Running the App
bash
# Development
npm run dev

# Production build
npm run build
npm run preview

🎨 Features
Infinite scroll media table

Add/edit/delete functionality

Responsive design with TailwindCSS

Form validation with Zod

📁 Project Structure

src/
├── api/            # API service functions
├── components/     # React components
├── hooks/          # Custom hooks
├── types/          # TypeScript interfaces
├── App.tsx         # Root component
└── main.tsx        # Entry point

