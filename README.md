# MainBranch

**The Professional Identity for Developers**

MainBranch is a comprehensive social platform and portfolio builder designed specifically for software engineers. It aggregates coding activity from across the web (GitHub, LeetCode, Kaggle, HuggingFace) into a single, dynamic profile, allowing developers to showcase their true impact.

## Key Features

### Unified Developer Profile
- **Activity Heatmap**: Visualize coding streaks and activity across multiple platforms.
- **Tech Stack**: Display professional skills and preferred technologies.
- **Stats Integration**: Automatic synchronization of statistics from GitHub, LeetCode, Kaggle, and Hugging Face.
- **Pinned Showcase**: Highlight up to 3 top projects or achievements directly on the profile.

### Social Feed
- **Content Sharing**: Share updates, "Build in Public", and technical insights.
- **User Mentions**: Tag other developers in posts using @username syntax. Mentions are clickable and navigate to the user's profile.
- **Notifications**: Real-time notifications for mentions, likes, comments, and follows.

### Real-Time Communication
- **Secure Chat**: Direct messaging system powered by Socket.io.
- **Rich Media**: Support for image sharing with optimized viewing experience.
- **Interactive Links**: URLs shared in chat are automatically detected and converted into secure, clickable links.
- **Typing Indicators**: Real-time feedback when other users are typing.

### Project Showcase
- **Detailed Cards**: Create project cards with atomic updates and technology tags.
- **Portfolio Management**: Add, edit, and remove projects to curate a professional portfolio.

### Interactive Design
- **Tech-Native UI**: Built with a custom dark mode design system.
- **Responsive Layout**: Optimized for various screen sizes.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: TailwindCSS + Custom CSS Variables
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context, Hooks

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Real-Time Engine**: Socket.io
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local storage with Multer

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Jalpan04/fsd-project.git
    cd fsd-project
    ```

2.  **Setup Server**
    Navigate to the server directory and install dependencies:
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory with the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLIENT_URL=http://localhost:3000
    ```
    Start the development server:
    ```bash
    npm run dev
    ```

3.  **Setup Client**
    Navigate to the client directory and install dependencies:
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
    Start the client application:
    ```bash
    npm run dev
    ```

4.  **Access the Application**
    Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## API Documentation

The backend API is accessible via the `/api` endpoints. Key routes include:

- `/api/auth`: Authentication & Registration
- `/api/users`: Profile management & Stats
- `/api/posts`: Feed, Likes & Comments
- `/api/chat`: Real-time messaging
- `/api/notifications`: Alert management

## Contributing

Contributions are welcome. Please follow these steps:

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
