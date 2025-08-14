---

# 🚖 Ride Booking Microservices Platform

A **ride-matching system** built with **Node.js**, **Express**, and **RabbitMQ**, designed to match users with captains using **microservices** and **long polling** for real-time ride updates.

---

## ✨ Features

* **Microservices Architecture** — Independent services for **User**, **Captain**, **Ride**, and **Gateway**.
* **RabbitMQ Event Messaging** — Asynchronous communication between services using `subscribeToQueue` and `publishToQueue`.
* **Long Polling** — Efficient ride update delivery without constant polling.
* **JWT Authentication** — Separate token flows for **User** and **Captain**.
* **Scalable Workflow** — Decoupled ride creation and acceptance processes.

---

## 🏗 Project Structure

```
micro-services/
│
├── gateway/           # API Gateway handling routing between microservices (port 3000)
├── user/              # Handles user signup, login, and ride requests (port 3001)
│   └── services/      # rabbitmq.js and other service utilities
├── ride/              # Manages ride creation, status updates (port 3002)
│   └── services/      # rabbitmq.js and other service utilities
├── captain/           # Handles captain signup, login, and ride acceptance (port 3003)
│   └── services/      # rabbitmq.js and other service utilities
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Prerequisites

Make sure you have installed:

* [Node.js](https://nodejs.org/) (v18+)
* [RabbitMQ](https://www.rabbitmq.com/) running locally or remotely
* npm or yarn

---

### 2️⃣ Installation

Clone the repository:

```bash
git clone <your-repo-url>
cd micro-services
```

Install dependencies for each service:

```bash
cd gateway && npm install
cd ../user && npm install
cd ../ride && npm install
cd ../captain && npm install
```

---

### 3️⃣ Environment Variables

Create `.env` files for each service with the required variables.

**Example for user service (`user/.env`):**

```env
PORT=3001
JWT_SECRET=your_jwt_secret
RABBITMQ_URL=amqp://localhost
```

Repeat for **ride**, **captain**, and **gateway** services.

---

### 4️⃣ Running Services

Start **RabbitMQ**:

```bash
rabbitmq-server
```

Run each service in separate terminals:

```bash
# API Gateway
cd gateway && npm start

# User Service
cd user && npm start

# Ride Service
cd ride && npm start

# Captain Service
cd captain && npm start
```

---

## 📡 API Workflow

1. **User** logs in (User Service) → gets JWT token.
2. **User** requests a ride → Ride Service publishes `new-ride` message via RabbitMQ.
3. **Captain** long polls for rides → receives ride details when available.
4. **Captain** accepts the ride → publishes `ride-accepted` message.
5. **User** long polls for acceptance → gets confirmation instantly.

---

## 🛠 Tech Stack

* **Node.js** + **Express**
* **RabbitMQ** for asynchronous messaging
* **JWT** for authentication
* **Long Polling** for real-time updates
* **REST API** communication between services

---

## 📄 License

This project is for educational purposes and is not licensed for production use.

---
