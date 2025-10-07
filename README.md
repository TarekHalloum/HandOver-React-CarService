# HandOver – React Web (Car Service)

## Overview
**HandOver – React Web (Car Service)** is an earlier responsive web version of the HandOver platform, focused on the **car service module**.  
It enables users to upload a photo of their car, where an **AI engine** detects the vehicle, identifies its **brand logo**, and classifies **damaged parts**.  
Based on the detected brand, the system filters and displays repairers specialized in that manufacturer.

---

## Core Features
- Upload or capture car images for AI-based detection  
- Detect and classify the car, logo, and damaged parts  
- Filter repairers by detected car brand  
- Responsive user interface built with **React**  
- Integrated AI service via **Flask (Python)** and **MongoDB** backend  

---

## System Architecture
- **Frontend:** React (JavaScript, CSS)  
- **Backend:** Node.js / Express with MongoDB  
- **AI Engine:** Flask (Python) – image recognition and damage detection  
- **Database:** MongoDB  

---

## Run Locally

### 1- Start the AI Service (Flask)

```bash
cd backend/backend-python
python app.py
```

### 2- Start the Backend (Node/Express)

```bash
cd backend
node server.js
```

### 3- Start the Frontend (React)

```bash
cd ..
npm start
```

The application will be available at:
 **[http://localhost:3000](http://localhost:3000)**

---

## 📦 Large Files

Model weights, video demos, and archives are **excluded** from this repository.

---

## 📜 License

MIT License © 2025 **Tarek Halloum**

---

## 🔗 Related Repositories

* **[HandOver – React Native (Full Platform)]()**
* **[HandOver – Android (Car Service)]()**
