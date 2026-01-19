# System Architecture and Implementation Document

## 1. Overview

AskMe is a web-based legal advisory application powered by Generative AI (RAG - Retrieval Augmented Generation). It is designed to answer questions related to "The Bharatiya Nyaya Sanhita (BNS)" by retrieving relevant legal context and generating accurate responses using Google's Gemini models.

The system consists of a specific Backend service that handles the AI logic and vector search, and a Frontend application that provides a chat interface and manages user history.

## 2. Technology Stack

### Frontend

- **Framework:** React (Vite)
- **Language:** TypeScript
- **State Management:** Redux Toolkit (`react-redux`)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Services:**
    - **Firebase Auth:** User authentication
    - **Firebase Firestore:** Chat history persistence
    - **Axios:** HTTP client

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **AI/LLM orchestration:** LangChain
- **LLM Provider:** Google Gemini (`gemini-2.0-flash`)
- **Embeddings:** Google Generative AI Embeddings (`text-embedding-004`)
- **Vector Database:** FAISS (Facebook AI Similarity Search) - Local file based.

## 3. System Architecture

The application follows a standard Client-Server architecture with external cloud services integration.

1.  **Client (Frontend):** Handles user interaction, chat display, and authentication.
2.  **Server (Backend):** Processes natural language queries, performs vector retrieval, and interacts with the LLM.
3.  **External Services:**
    - **Google Gemini API:** For embeddings and text generation.
    - **Firebase:** For user identity and data storage.

## 4. Backend Implementation

The backend is built as a RESTful API service.

- **Entry Point:** `backend/index.js` initializes the Express server and middleware (CORS, JSON parsing).
- **Routes:** `backend/routes/context.js` defines the `/api/v1/context` endpoint.
- **Controller:** `backend/controllers/context.js` contains the core RAG logic.

### RAG Pipeline (Retrieval Augmented Generation)

The core logic inside `getContext` controller (`backend/controllers/context.js`) follows these steps:

1.  **Prompt Processing:** The user's prompt is effectively "cleaned" or rephrased into a standalone question using a `PromptTemplate` and the LLM.
2.  **Embedding:** The standalone question is converted into a vector embedding using `GoogleGenerativeAIEmbeddings`.
3.  **Retrieval:** The system searches the local `BNSVectorStore` (FAISS index) for the most similar documents (legal sections) to the query.
4.  **Generations:** A final prompt is constructed containing:
    - The retrieved Context (legal sections).
    - The User's original Prompt.
    - Instructions to reference specific BNS sections.
    - This is sent to the `gemini-2.0-flash` model.
5.  **Response:** The generated answer is sent back to the client.

**Key Dependencies:**

- `@langchain/google-genai`
- `@langchain/community/vectorstores/faiss`

## 5. Frontend Implementation

The frontend is a single-page application (SPA) providing a ChatGPT-like interface.

### Key Components

- **`Home.tsx`:** The main container. Handles layout, sidebar toggling, and displays the chat interface.
- **`ChatBar.tsx`:** Input area for users. Handles text input and communicates with the `useChat` hook.
- **`ChatsContainer.tsx` & `Chat.tsx`:** Renders the list of messages (User vs Model interactions).
- **`Sidebar.tsx`:** Navigation for past chat history.

### State Management (Redux)

Located in `frontend/src/features/`.

- **`chatSlice.ts`:** Manages the current active chat session, loading states, and the current prompt.
- **`userSlice.ts`:** Stores current user information from Firebase Auth.
- **`mainSlice.ts`:** Stores the list of all historical chats loaded from Firestore.

### Logic Hook (`useChat`)

Located in `frontend/src/libs/hooks.ts`.

- **`getResponse` Function:**
    1.  Dispatches actions to update UI state (loading, adding user message).
    2.  Calls `axios.post('.../api/v1/context', { prompt })`.
    3.  Receives the response.
    4.  Updates Redux state with the model's response (with a typing effect simulation).
    5.  Persists the updated conversation to Firebase Firestore.

## 6. Database & Authentication

- **Authentication:** Firebase Auth is used for sign-up/login. The `onAuthStateChanged` listener in `Home.tsx` syncs the auth state with Redux.
- **Database:** Firebase Firestore stores chat histories in the `chat_histories` collection. This allows users to access their past conversations across sessions.

## 7. Folder Structure Highlights

```
/
├── backend/
│   ├── BNSVectorStore/    # Pre-computed FAISS index files
│   ├── controllers/       # Business logic (RAG pipeline)
│   └── routes/            # API definitions
├── frontend/
│   ├── src/
│       ├── components/    # Reusable UI components
│       ├── configs/       # Firebase config
│       ├── features/      # Redux slices
│       ├── libs/          # Custom hooks and utilities
│       └── pages/         # Route pages (Home, Login, etc.)
```
