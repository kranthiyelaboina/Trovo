
---

```markdown
# Trovo

Trovo is an **intelligent credit card reward point optimizer** designed to unify and streamline reward points from multiple banks, ensuring users maximize their redemption options. It addresses the common pain points of fragmented reward systems, complex redemption processes, and unused points.

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

Millions of credit card reward points go unredeemed every year due to a lack of awareness, complicated redemption processes, and fragmented systems. **Trovo** tackles this by offering a single, user-friendly platform to view, track, and optimize reward points from various cards and banks. By harnessing AI/ML, Trovo provides personalized insights, frictionless UPI conversion, and cross-bank reward pooling.

---

## Features

- **Unified Dashboard**: Aggregate reward points from multiple banks.  
- **Real-Time Analytics**: Monitor reward points, expiration dates, and usage patterns.  
- **Intelligent Recommendations**: Leverage ML models to suggest optimal redemption strategies.  
- **Secure Authentication**: JWT-based auth, password hashing (bcrypt).  
- **Scalable Architecture**: Node.js, Express.js, React, and AWS services.

---

## Workflow

Below is a high-level user flow demonstrating how Trovo interacts with banks and AWS Aurora for data storage, as well as the redemption and transaction processes:

![Trovo Workflow](https://raw.githubusercontent.com/kranthiyelaboina/Trovo/main/assets/userflow.jpg)

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

This architecture allows Trovo to scale seamlessly, leverage serverless functions (Lambda) for on-demand tasks, and use advanced analytics (Redshift, Glue) to deliver personalized recommendations.

---

## Local Setup

Follow these steps to run Trovo on your local machine.

### 1. Prerequisites

- **Node.js** (v16+ recommended)  
- **npm** or **yarn**  
- **TypeScript** (installed globally or via devDependencies)  
- **Database**:  
  - Either provision AWS Aurora  
  - Or use a local MongoDB (if your local config is set to MongoDB)

### 2. Clone the Repository

```bash
git clone https://github.com/kranthiyelaboina/Trovo.git
cd Trovo
```

### 3. Environment Variables

Create a `.env` file in the **server** directory with the following (example) keys:

```dotenv
PORT=5000
DB_URI=your_database_connection_string  # e.g., MongoDB or AWS Aurora DSN
JWT_SECRET=your_jwt_secret
```

### 4. Install Dependencies

#### Server

```bash
cd server
npm install
```

#### Client

```bash
cd ../client
npm install
```

### 5. Build & Run Locally

#### Server

```bash
cd server
npm run build   # Transpile TypeScript to JavaScript
npm start       # Starts the compiled JS from dist/
```

> **Tip**: Ensure your `package.json` includes scripts for `build` and `start` (e.g., `"build": "tsc"`, `"start": "node dist/index.js"`).

#### Client

```bash
cd ../client
npm start       # Runs React dev server on localhost:3000
```

### 6. Access the App

- **Frontend**: [http://localhost:3000](http://localhost:3000)  
- **Backend**: [http://localhost:5000/api](http://localhost:5000/api) (or similar, depending on your code)

---

## Deployment

Although Trovo can be deployed on various platforms, two popular options are **AWS** and **Heroku**.

### AWS Deployment

1. **Provision an EC2 instance** or use AWS Elastic Beanstalk.  
2. **Set up** your environment variables (e.g., in AWS Systems Manager Parameter Store).  
3. **Configure** a build pipeline (CI/CD) using AWS CodePipeline or GitHub Actions.  
4. **Run** your Node.js server with a process manager (e.g., PM2) on the EC2 instance.  
5. **Use** AWS Aurora (or RDS) for your production database.  

### Heroku Deployment (Optional)

1. **Create** a Heroku app: `heroku create your-app-name`  
2. **Add** a `Procfile` in the root with `web: npm start` (or whichever start command).  
3. **Set** environment variables:  
   ```bash
   heroku config:set NODE_ENV=production JWT_SECRET=your_secret DB_URI=your_db_uri
   ```  
4. **Deploy**:  
   ```bash
   git push heroku main
   heroku open
   ```

---

## License

This project is open-sourced under the [MIT License](LICENSE). Feel free to use and modify the code in compliance with the license.

---

## Team

- **Kranthi Yelaboina** – Cloud Architect, Front-End Developer  
- **Narra Akshith Sai** – Collaborative Hackathon Team  

We welcome contributions! If you find any issues or have suggestions, please open an [issue](https://github.com/kranthiyelaboina/Trovo/issues) or submit a pull request.

---

**Thank you for using Trovo!**  
_Maximize your rewards, simplify your life._
```

### Additional Tips

1. **Image Hosting**: If you want to host additional screenshots or diagrams, create an `assets` folder in your repo.  
2. **Maintaining Professionalism**: Keep your documentation up-to-date with any new features, and use consistent formatting for headings, code blocks, and bullet points.  
3. **Contributing Guidelines**: For open-source collaboration, consider adding a `CONTRIBUTING.md` file outlining how to contribute.
