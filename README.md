# MainBranch 🚀

**The Professional Identity for Developers.**

MainBranch is a comprehensive social platform and portfolio builder designed specifically for software engineers. It aggregates your coding activity from across the web (GitHub, LeetCode, Kaggle, HuggingFace) into a single, dynamic profile, allowing you to showcase your true impact.

## ✨ Key Features

*   **Unified Developer Profile**:
    *   **Activity Heatmap**: Visualize your coding streak across multiple platforms.
    *   **Tech Stack**: Display your skills and preferred technologies.
    *   **Stats Integration**: Auto-sync stats from GitHub, LeetCode, Kaggle, and Hugging Face.
*   **Project Showcase**: Create detailed project cards with atomic updates and tech tags.
*   **Social Feed**: Share updates, "Build in Public", and interact with other developers.
*   **Real-Time Chat**: Secure messaging with image sharing support using Socket.io.
*   **Interactive Design**: A "Tech-Native" UI built with a custom dark mode design system, glassmorphism, and smooth animations.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: [TailwindCSS](https://tailwindcss.com/) + Custom CSS Variables
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **State/Data**: React Context, Hooks

### Backend
*   **Runtime**: Node.js & Express.js
*   **Database**: MongoDB (Mongoose ODM)
*   **Real-Time**: [Socket.io](https://socket.io/)
*   **Auth**: JWT (JSON Web Tokens)
*   **File Uploads**: Multer (Local storage)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Jalpan04/fsd-project.git
    cd fsd-project
    ```

2.  **Setup Server**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:3000
    ```
    Start the server:
    ```bash
    npm run dev
    ```

3.  **Setup Client**
    ```bash
    cd client
    npm install
    ```
    Create a `.env.local` file in the `client` directory:
    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
    NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
    ```
    Start the client:
    ```bash
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 📚 API Documentation

The backend API is documented in `api_documentation.md` (if generated) or accessible via the `/api` endpoints. Key routes include:

*   `/api/auth`: Authentication & Registration
*   `/api/users`: Profile management & Stats
*   `/api/posts`: Feed, Likes & Comments
*   `/api/chat`: Real-time messaging
*   `/api/integrations`: External service verification

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
