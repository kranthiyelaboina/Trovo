Got it! Here's the updated professional `README.md` for your project **Trovo**, incorporating the correct project name and setup details.

---

### 📌 `README.md`

```markdown
# Trovo

**Trovo** is an intelligent credit card reward point optimizer designed to address the widespread issue of unredeemed credit card rewards in India. It acts as a unified platform for users to track, manage, and optimize reward points across multiple banks and cards.

---

## 🔍 Problem Statement

Over ₹29,000 Cr worth of credit card reward points in India go unredeemed due to:
- Lack of centralization
- Low awareness of redemption options
- Fragmented user experiences across banks

---

## 💡 Solution

**Trovo** offers:
- A **unified dashboard** to view and manage reward points
- **Smart recommendations** for the best card usage based on the merchant
- **Optimization algorithms** to maximize redemption value
- **Data privacy and security** using JWT and bcrypt authentication

---

## 🧠 Key Features

- Cross-bank reward point aggregation
- Intelligent redemption suggestions using ML
- Spend analytics and reports
- Secure login and signup using JWT
- Admin dashboard with user insights

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- Axios

### Backend:
- Node.js
- Express.js
- MongoDB
- JWT, Bcrypt

### AI & Data:
- TensorFlow
- Scikit-learn
- Snowflake (for data warehousing)

### Deployment:
- Heroku (supports TypeScript via compilation)
- GitHub

---

## 📸 User Flow

> ![User Flow](https://raw.githubusercontent.com/kranthiyelaboina/Trovo/main/assets/user-flow.png)

---

## 🧱 Architecture

> ![Architecture](https://raw.githubusercontent.com/kranthiyelaboina/Trovo/main/assets/architecture.png)

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v16+)
- MongoDB
- Yarn or npm

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/kranthiyelaboina/Trovo.git
cd Trovo
```

### 2️⃣ Install Dependencies

#### Server:
```bash
cd server
npm install
```

#### Client:
```bash
cd ../client
npm install
```

---

### 3️⃣ Environment Variables

#### Create a `.env` file in `server/` with:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

---

### 4️⃣ Build & Run

#### Backend (with TypeScript):
```bash
cd server
npm run build      # Compiles TypeScript to dist/
npm start          # Runs the compiled code
```

#### Frontend:
```bash
cd ../client
npm start
```

---

### ✅ Access the App
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🌐 Deployment

Trovo can be deployed on **Heroku**:

### Using CLI (recommended):
```bash
heroku login
heroku create trovo-app
git push heroku main
```

Make sure to set buildpacks if using TypeScript:
```bash
heroku buildpacks:set heroku/nodejs
```

Or use the Heroku Dashboard (GUI) to connect GitHub and deploy.

---

## 👥 Team

- Kranthi Yelaboina
- Narra Akshith Sai

---

## 📃 License

This project is licensed under the MIT License.

---

```

---

### 📌 Notes:

1. Upload your images (`user-flow.png`, `architecture.png`) to the GitHub repo at `assets/` directory for the image links to work.
2. Let me know if you'd like this documentation as a downloadable file or hosted on a GitHub Wiki.

Would you like a version of this as a `README.md` file to upload directly to your GitHub repo?
