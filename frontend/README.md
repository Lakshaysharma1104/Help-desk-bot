# Help Desk Frontend

AI-powered support desk UI for xyz Technologies, built with React, Redux Toolkit, and TypeScript.

## Features

- Streaming AI assistant connected to `POST /api/v1/helpdesk/stream`
- Stable `conversationId` persisted across messages and browser sessions
- Support-oriented empty states, retry/stop streaming, and keyboard-friendly composer
- Ticket workflow pages structured for future REST integration (tickets are currently managed by the AI backend tools)
- Light/dark theme, responsive shell, and local conversation history

## Getting started

1. Start the Spring Boot backend on port `8080`.
2. Install dependencies:

```bash
npm install
```

3. Run the dev server:

```bash
npm run dev
```

The Vite dev proxy forwards `/api` requests to `http://localhost:8080`.

## Environment notes

- Leave **API base URL** blank in Settings to use the dev proxy.
- Set a custom base URL only when deploying against a remote backend with CORS configured.

## Scripts

- `npm run dev` — start development server
- `npm run build` — typecheck and build for production
- `npm run preview` — preview production build
