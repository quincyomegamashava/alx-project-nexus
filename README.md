# ALX Project Nexus 📚

## Overview
This repository documents my journey and learnings from the **ProDev Frontend Engineering program**.  
It also includes the planning and documentation for my final project:  
A **Dynamic E-Commerce Product Catalog (Web, Mobile, or PWA)**

## Overview
This case study focuses on building a scalable and user-friendly **e-commerce product catalog** where users can browse, filter, and sort products seamlessly.  
The project emphasizes:  
- **API integration** for dynamic product data.  
- **Optimizing performance** with pagination & infinite scrolling.  
- **Responsive, accessible UI** for diverse devices.  

---

## 🚀 Major Learnings

### 🔑 Key Technologies
- **Web Development**: React, TailwindCSS, TypeScript  
- **Mobile Development**: React Native, Expo  
- **PWA**: Service Workers, Offline caching  
- **APIs & Integration**: REST APIs  
- **State Management**: Redux  
- **Version Control**: Git & GitHub collaboration  

---

### 📘 Important Frontend Concepts
- **React** for component-driven UIs  
- **TailwindCSS** for modern, responsive styling  
- **TypeScript** for type safety & maintainability  
- **Redux** for predictable state management  
- **API Integration** for real-world dynamic data  
- **Pagination & Infinite Scrolling** for performance optimization  

---

### ⚡ Challenges & Solutions
- **Challenge**: Handling large datasets without performance issues  
  **Solution**: Implemented pagination & infinite scrolling to optimize rendering.  

- **Challenge**: Ensuring accessibility across devices  
  **Solution**: Built a fully responsive layout with TailwindCSS.  

- **Challenge**: Managing complex product filtering logic  
  **Solution**: Used Redux for centralized state management and modular filtering.  

---

### 🏆 Best Practices & Takeaways
- Adopted a **clean Git workflow** with descriptive commits  
- Designed **modular, reusable components** for scalability  
- Documented processes for easier onboarding  
- Used **TypeScript interfaces** for maintainable, error-free code  
- Focused on **UX-driven design** to improve product discoverability  

---

## 👥 Collaboration
- **Frontend Peers**: Code reviews, UI/UX testing, pair-programming  
- **Backend Peers**: API integration, error handling, and performance discussions  

---

## 📂 Repository Content
- `/docs` → System design, wireframes, API documentation  
- `/frontend` → React app with TailwindCSS & TypeScript  
- `/mobile` → React Native + Expo implementation  
- `/notes` → Learnings & reflections from the ProDev program  

---

## 🛠️ Getting Started

### 📌 Prerequisites
Make sure you have the following installed:
- **Node.js** (v16 or later)  
- **npm** or **yarn**  
- **Git**  

### 🔽 Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/project-nexus.git
   cd project-nexus/frontend






# Stop current server
pkill -f "node server.js"

# Start the enhanced server
./start-auth-server.sh


## (BELOW WORKS BUT NOT RECOMMENDED)
# Stop current server
pkill -f "node server.js"

# Start basic JSON server on port 4000
./start-api.sh

# Start enhanced server on port 4001 
cd api && PORT=4001 node server.js



## OR 



## Run both apps

## In two terminals:

## Terminal 1 (API):

npm run start:api


## Terminal 2 (Web):

cd frontend
npm run dev


## Terminal 3 (Mobile):

cd mobile
npm start