# SlideMaster

SlideMaster is an advanced, AI-powered presentation creation tool that runs entirely in the browser. It leverages multiple AI providers to automatically generate high-quality presentations from simple topics or existing video content. It also provides a full-featured manual editor for fine-grained control.

This project was built from a comprehensive set of design documents located in the `/docs` directory.

## Features

- **Multi-AI Integration:** Supports Gemini, Azure OpenAI, OpenAI, Claude, and more for text and image generation.
- **Video to Manual:** Automatically analyzes video content to generate step-by-step presentation manuals.
- **Advanced Slide Editor:** A full-featured editor with a layer-based system (text, images, shapes), drag-and-drop manipulation, and more.
- **Comprehensive Export:** Export presentations to PDF and other formats.
- **Client-Side Security:** All data, including sensitive API keys, is stored securely in the browser's local storage.

## Tech Stack

- **Framework:** React 19 + TypeScript 5.7
- **Build Tool:** Vite 6.2
- **Testing:** Jest + React Testing Library
- **Key Libraries:** `react-moveable`, `jsPDF`, `@google/genai`

## Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- npm (>=9.0.0)

### Installation

1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the local development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

### Running Tests

To run the test suite, use the following command:

```bash
npm test
```
