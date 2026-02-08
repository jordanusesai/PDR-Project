# PDR Split - Expense Sharing Application

A modern expense sharing application for group trips and events, inspired by the vibrant party culture and trident symbolism from Barbados.

## Features

- **User Authentication**: Secure registration and login system
- **Group Management**: Create and manage multiple groups for different events
- **Expense Tracking**: Add, edit, and delete expenses with detailed information
- **Currency Conversion**: Support for multiple currencies with automatic GBP conversion
- **Real-time Balances**: Calculate and display who owes whom in real-time
- **Modern UI**: Clean, uncluttered interface with soft blue color scheme

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** with React Router
- **Context API** for state management
- **Axios** for API calls
- **Lucide React** for icons
- **Styled Components** for styling

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pdr-split
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/pdr-split
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## Application Structure

```
pdr-split/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context for state management
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── styles/         # Global styles
│   │   └── assets/         # Static assets
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # Express routes
├── controllers/            # Route controllers
├── middleware/             # Custom middleware
├── server.js              # Express server
├── package.json
└── README.md
```

## Key Features Explained

### Currency Conversion
- All expenses are stored with their original currency and conversion rate
- Conversion rates must be entered with exactly 2 decimal places
- All calculations and totals are displayed in GBP
- Supports up to 5 decimal places for internal calculations

### Group Management
- Users can create multiple groups for different events
- Add/remove members by email address
- Group creators cannot be removed
- Each group maintains its own expense history

### Expense Tracking
- Detailed expense information including type, description, and comments
- Flexible splitting options - choose who participates in each expense
- Edit expenses to add/remove people or adjust amounts
- Automatic balance calculations

### Balance Calculations
- Real-time balance updates for all group members
- Clear visualization of who owes whom
- All amounts displayed in GBP for consistency

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Groups
- `GET /api/groups` - Get user's groups
- `POST /api/groups` - Create new group
- `GET /api/groups/:id` - Get specific group
- `POST /api/groups/:id/members` - Add member
- `DELETE /api/groups/:id/members/:userId` - Remove member

### Expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/group/:groupId` - Get group expenses
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/group/:groupId/balances` - Get group balances

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**PDR Split** - Making expense sharing simple and fun! 🎉
