<p align="center">
  <img src="FinancioFronted/attached_assets/stock_images/Financio%20logo.png" alt="Financio Logo" width="200"/>
</p>

<h1 align="center">Financio - The Founder's First Dashboard</h1>

<p align="center">
  <strong>Financial dashboard for bootstrapped founders and small businesses</strong>
</p>

<p align="center">
  <a href="#demo">Demo</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#appwrite-integration">Appwrite Integration</a> •
  <a href="#getting-started">Getting Started</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Appwrite-F02E65?style=for-the-badge&logo=appwrite&logoColor=white" alt="Appwrite"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
</p>

---

## About Financio

Financio is a financial dashboard application built for bootstrapped founders and small businesses. It provides transaction tracking, expense categorization, and AI-powered financial analysis using the Appwrite Cloud platform.

### Problem Statement

Small business owners often manage finances using spreadsheets, which lack:
- Real-time visibility into cash flow
- Automated expense categorization
- Receipt organization
- Financial insights and recommendations

### Solution

Financio provides:
- Visual dashboard for tracking income and expenses
- AI-powered financial analysis using Google Gemini
- Receipt management with file uploads
- Customizable expense categories
- PDF report export functionality

---

## Demo

- **Live Site:** [https://Financio.appwrite.network](https://Financio.appwrite.network)
- **GitHub Repository:** [0xReLogic/Financio-The-Founders-First-Dashboard-](https://github.com/0xReLogic/Financio-The-Founders-First-Dashboard-)

---

## Features

### Authentication
- Email and password registration with email verification
- Password recovery with secure reset links
- Session management
- Protected routes

### Dashboard
- Income, expense, and balance statistics
- Cashflow line chart
- Expense breakdown pie chart
- Recent transactions list

### Transaction Management
- Create, read, update, and delete transactions
- Search by description
- Filter by type and category
- Date range selection
- Receipt attachments (images and PDFs)

### Category Management
- Create custom categories
- Assign colors and icons
- Separate categories for income and expenses

### AI Financial Advisor
- Analysis of last 30 days transactions
- Financial summary (income, expenses, net balance)
- Expense breakdown by category
- AI-generated recommendations using Google Gemini
- Analysis history
- Credit-based system (10 free credits per user)

### PDF Export
- Export AI analysis to PDF format
- Includes financial metrics and recommendations

### Receipt Management
- Upload receipt photos (JPG, PNG, WebP)
- Upload PDF receipts
- Preview and download capabilities
- 5MB file size limit

### UI Features
- Dark mode support
- Responsive design for mobile and desktop
- Loading states and skeleton screens
- Toast notifications

---

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Wouter (routing)
- TailwindCSS
- Shadcn UI
- Recharts
- React Query (TanStack Query)
- Zustand
- React Hook Form
- Zod
- React Markdown
- jsPDF
- Lucide React

### Backend
- Appwrite Cloud
- Python 3.12
- Google Gemini AI (gemini-2.0-flash-exp)

---

## Appwrite Integration

Financio uses 7 Appwrite products:

### 1. Auth
- Email and password authentication
- Email verification
- Password recovery
- Session management
- User profile management

Implementation:
```typescript
const user = await account.create(ID.unique(), email, password, name);
await account.createEmailPasswordSession(email, password);
await account.createVerification(verificationUrl);
```

### 2. Databases
- 4 Collections: transactions, categories, ai_analyses, rate_limits
- Document-level permissions
- Indexed queries by userId, date, and category

Collections Schema:
```typescript
// Transactions
{
  type: 'income' | 'expense',
  amount: number,
  category: string,
  date: datetime,
  description: string,
  receiptId: string,
  userId: string
}

// Categories
{
  name: string,
  type: 'income' | 'expense',
  color: string,
  icon: string,
  userId: string
}

// AI Analyses
{
  userId: string,
  analysisDate: datetime,
  summary: string,
  advice: string,
  periodDays: number
}

// Rate Limits
{
  userId: string,
  totalCredits: number,
  usedCredits: number,
  isPaid: boolean,
  lastUsedAt: datetime
}
```

### 3. Storage
- Bucket: receipts
- Supported formats: JPG, PNG, PDF
- Max file size: 5MB
- Encryption and antivirus enabled
- Automatic cleanup on transaction deletion

Implementation:
```typescript
const file = await storage.createFile(BUCKET_ID, ID.unique(), receiptFile);
const url = `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${PROJECT_ID}`;
```

### 4. Functions

Two serverless functions implemented:

**Gemini AI Financial Advisor**
- Runtime: Python 3.12
- AI model: gemini-2.0-flash-exp
- Analyzes transaction patterns and provides financial recommendations
- Credit-based system (10 free credits per user)

**Weekly Email Report**
- Runtime: Python 3.12
- Scheduled via cron job
- SendGrid integration for email delivery
- Sends weekly financial summaries to users

### 5. Messaging
- SendGrid provider integration
- Automated weekly email reports
- Email verification system
- Password recovery emails

### 6. Realtime
- WebSocket subscriptions for live data updates
- Real-time dashboard statistics
- Instant transaction list refresh
- Live chart updates

### 7. Sites
Frontend deployment to Appwrite Cloud with auto SSL and CDN.

---

## Getting Started

### Prerequisites
- Node.js 18+
- Appwrite CLI
- Appwrite Cloud account

### Installation

1. Clone the repository
```bash
git clone https://github.com/0xReLogic/Financio-The-Founders-First-Dashboard-.git
cd Financio-The-Founders-First-Dashboard-
```

2. Install Appwrite CLI
```bash
npm install -g appwrite
```

3. Login to Appwrite
```bash
appwrite login
```

4. Initialize Appwrite project
```bash
appwrite init project
```
Select your existing Appwrite project or create a new one.

5. Deploy backend resources
```bash
# Deploy database collections
appwrite deploy collection

# Deploy storage buckets
appwrite deploy bucket

# Deploy serverless functions
appwrite deploy function
```

6. Install frontend dependencies
```bash
cd FinancioFronted
npm install
```

7. Update environment variables

The `.env.local` file in `FinancioFronted/` should be automatically configured during `appwrite init`. Verify it contains your project details.

8. Run development server
```bash
npm run dev
```

Access the application at `http://localhost:5173`

### Deployment

Deploy frontend to Appwrite Cloud:
```bash
cd FinancioFronted
appwrite deploy
```

Your application will be available at `https://[project-id].appwrite.network`

---

## Project Structure

```
Financio-The-Founders-First-Dashboard-/
├── FinancioFronted/
│   ├── client/
│   │   ├── src/
│   │   │   ├── components/      # UI components
│   │   │   ├── pages/           # Route pages
│   │   │   ├── lib/             # Core utilities
│   │   │   └── hooks/           # React hooks
│   │   └── index.html
│   └── package.json
├── functions/
│   ├── Gemini AI Financial Advisor/
│   │   ├── src/main.py
│   │   └── requirements.txt
│   └── Weekly-Email-Report/
│       ├── src/main.py
│       └── requirements.txt
└── README.md
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

**Developer:** 0xReLogic

**GitHub:** [@0xReLogic](https://github.com/0xReLogic)

**Project Link:** [https://github.com/0xReLogic/Financio-The-Founders-First-Dashboard-](https://github.com/0xReLogic/Financio-The-Founders-First-Dashboard-)

---

<p align="center">
  Built for Appwrite Hacktoberfest 2025
</p>
