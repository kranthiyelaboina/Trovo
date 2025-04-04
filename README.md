# Trovo

Trovo is an **intelligent credit card reward point optimizer** designed to unify and streamline reward points from multiple banks, ensuring users maximize their redemption options. Developed as part of the **HackHInII 2025** event under the "Trovo: Revolutionizing Credit Card Rewards Redemption" project, Trovo addresses the significant issue of unredeemed rewards in India, where over ₹12,500 crores worth of credit card points expire annually. This platform provides a centralized solution to manage, track, and optimize reward points, transforming forgotten points into financial freedom.

---

## Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Workflow](#workflow)  
4. [Tools & Technologies](#tools--technologies)  
5. [Local Setup](#local-setup)  
6. [Deployment](#deployment)  
7. [License](#license)  
8. [Team](#team)

---

## Overview

The credit card rewards ecosystem in India suffers from fragmentation, complex redemption processes, and a lack of awareness, leading to substantial value leakage for consumers and financial institutions. Trovo tackles these challenges by offering a single, user-friendly platform that aggregates reward points from major Indian banks (HDFC, ICICI, SBI, Axis, Kotak, Amex), provides real-time analytics, and leverages AI/ML for personalized redemption strategies. Inspired by the "Trovo" concept, Trovo enables cross-bank point pooling, frictionless UPI integration, and micro-loan options, empowering users to reclaim an average of ₹4,200 annually in lost rewards.

---

## Features

- **Unified Dashboard**: Aggregate reward points from multiple banks with real-time balances, values, and expiration timelines.  
- **Intelligent Recommendations**: AI-driven algorithms analyze spending patterns to suggest the highest-value redemption options.  
- **Cross-Bank Optimization**: Pool points across different banks to unlock high-value redemptions.  
- **Frictionless UPI Integration**: Convert points directly to UPI for daily transactions.  
- **Micro-Loan Framework**: AI-powered instant approvals using rewards history as a credit signal.  
- **Secure Authentication**: JWT-based authentication and password hashing (bcrypt) for user security.

---

## Workflow

The diagram below illustrates the high-level user flow of Trovo, showcasing how users interact with the dashboard, bank cards, and AWS Aurora for data storage and transaction processing:

![Trovo Workflow](https://github.com/kranthiyelaboina/Trovo/blob/ae30367dbd3474ba4f2bc0b7f3d020934f3b6aa6/img/userflow.jpg)

**Workflow Description**: The user accesses the Trovo dashboard to view aggregated reward points and redemption options. The platform connects to bank cards to fetch real-time data, processes transactions, and stores information in AWS Aurora. AI/ML models (e.g., TensorFlow, LLAMA) provide personalized recommendations, while AWS Lambda and CloudFront ensure scalability and performance. The workflow concludes with seamless point redemption or UPI conversion.

---

## Tools & Technologies

| Category            | Tools / Services                                                    |
|---------------------|---------------------------------------------------------------------|
| **Frontend**        | React, TypeScript, Tailwind CSS, Axios                             |
| **Backend**         | Node.js, Express.js, TypeScript, JWT, Bcrypt                       |
| **Database**        | AWS Aurora (or MongoDB, if configured locally)                     |
| **AWS Services**    | AWS Lambda, AWS CloudFront, AWS S3, AWS Redshift, AWS Glue, AWS EC2 |
| **AI/ML**           | TensorFlow, LLAMA (Large Language Model), Scikit-learn             |
| **Other**           | SSH, Git, Heroku (optional)                                        |

This architecture ensures scalability, security, and seamless integration with bank APIs, adhering to PCI-DSS compliance and RBI guidelines.

---

## Local Setup

Follow these steps to run Trovo on your local machine. The React frontend is bundled with the server, so you only need to run the application from the root folder.

### 1. Prerequisites

- **Node.js** (v16+ recommended)  
- **npm** (installed globally)  
- **Database**: AWS Aurora (preferred) or local MongoDB

### 2. Clone the Repository

```bash
git clone https://github.com/kranthiyelaboina/Trovo.git
cd Trovo
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following (example) keys:

```
PORT=5000
DB_URI=your_database_connection_string  # e.g., AWS Aurora DSN or MongoDB URI
JWT_SECRET=your_jwt_secret
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Locally

```bash
npm run dev
```

- Open your browser and navigate to `http://localhost:5000` to access the Trovo platform.  
- **Note**: The `npm run dev` command starts the server and serves the bundled React frontend, so no separate client setup is required.

---

## Deployment

### AWS Deployment

1. Provision an EC2 instance or use AWS Elastic Beanstalk.  
2. Set up environment variables (e.g., in AWS Systems Manager Parameter Store).  
3. Configure a build pipeline using AWS CodePipeline or GitHub Actions.  
4. Run the Node.js server with a process manager (e.g., PM2) on the EC2 instance.  
5. Use AWS Aurora for your production database.

### Heroku Deployment (Optional)

1. Create a Heroku app: `heroku create your-app-name`  
2. Add a `Procfile` in the root with `web: npm start`  
3. Set environment variables:  
   ```bash
   heroku config:set NODE_ENV=production JWT_SECRET=your_secret DB_URI=your_db_uri
   ```  
4. Deploy:  
   ```bash
   git push heroku main
   heroku open
   ```

---

## License

This project is open-sourced under the MIT License. Feel free to use and modify the code in compliance with the license.

---

## Team

- **Kranthi Yelaboina** – Cloud Architect, Front-End Developer (Team Leader)  
- **Narra Akshith Sai** – Backend Developer, ML Specialist

We welcome contributions! If you find any issues or have suggestions, please open an issue or submit a pull request.

Thank you for using Trovo!

**Maximize your rewards, simplify your life.**
