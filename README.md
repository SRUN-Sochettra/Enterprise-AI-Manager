# 🚀 Enterprise AI Manager

## Used with Basic-SpringBoot for backend [Basic-SpringBoot](https://github.com/SRUN-Sochettra/Basic-SpringBoot.git)

### The Next-Gen Management Interface Supercharged with AI

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/AI-Gemini_2.5-4285F4?style=for-the-badge&logo=google-gemini)](https://deepmind.google/technologies/gemini/)

**Enterprise AI Manager** is a premium, high-performance management platform designed to streamline employee and product operations. By integrating state-of-the-art AI models, it transforms raw data into actionable insights, provides natural language interactions, and automates repetitive tasks.
<img width="1366" height="768" alt="NexusCover" src="https://github.com/user-attachments/assets/46a9362e-b679-4202-90b9-39c08740395b" />



---

## ✨ Key Features

### 📊 AI-Powered Dashboard
*   **Gemini Analytics**: Automated business analytics with executive summaries.
*   **Visual Insights**: Real-time charts powered by **Recharts** showing trends and distributions.
*   **Smart Highlights**: AI-detected anomalies and growth opportunities.

### 👥 Employee Hub
*   **Complete CRUD**: Efficient management of employee records.
*   **Sentiment Analysis**: Integrated **DistilBERT** models to analyze employee reviews and feedback.
*   **Role-Based Access**: Secure environment with Admin/User permissions via **NextAuth**.

### 📦 Smart Product Catalog
*   **Vision AI**: Image scanning to auto-fill product details from photo URLs.
*   **Global Reach**: Inline translation into 8+ languages using **Hugging Face** Helsinki models.
*   **Advanced Filtering**: Category management and instant search.

### 🤖 AI Integration
*   **Gemini Assistant**: Chat directly with your data using natural language.
*   **NLP Search**: Find anything across the entire platform with semantic queries.
*   **Real-time Analysis**: Instant feedback and recommendations across all modules.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Core** | [Next.js 16](https://nextjs.org/), [React 19](https://reactjs.org/) |
| **AI/ML** | [Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/), [Hugging Face](https://huggingface.co/), Google Vision API |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide Icons](https://lucide.dev/) |
| **Data Viz** | [Recharts](https://recharts.org/) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) |
| **Backend** | [Spring Boot](https://spring.io/projects/spring-boot) |

---

## 🚦 Getting Started

### Prerequisites
*   Node.js 18+ 
*   npm / yarn / pnpm / bun

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/SRUN-Sochettra/test-next.git
    cd test-next
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    Create a `.env.local` file in the root directory and add your API keys (Gemini, Google Cloud, NextAuth secrets). Use `.env.example` as a template if available.

### Development
Run the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

---

## 🏗️ Architecture

The project follows the **Next.js App Router** architecture:
*   `src/app/`: Core routing and page layouts.
*   `src/components/`: Modular, reusable UI components (Product, Employee, Common).
*   `src/context/`: Global state management (Auth, Theme).
*   `src/lib/`: Utility functions and AI service integrations.
*   `public/`: Static assets and icons.

---

## 📄 License

This project is private and intended for enterprise use.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/SRUN-Sochettra">SRUN Sochettra</a>
</p>
