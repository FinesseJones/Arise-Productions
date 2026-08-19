# AI Development Rules

This document outlines the technology stack and the rules for developing the AI features of this application. Following these guidelines ensures consistency, maintainability, and high-quality code.

## Technology Stack

The application is built on a modern, robust technology stack. Key technologies include:

-   **Frontend Framework:** React with TypeScript for building a type-safe, component-based user interface.
-   **Build Tool:** Vite for fast development and optimized builds.
-   **Backend Framework:** Encore for building and deploying backend services in Go.
-   **UI Components:** shadcn/ui, a collection of beautifully designed, accessible, and reusable components.
-   **Styling:** Tailwind CSS for a utility-first approach to styling, enabling rapid and consistent UI development.
-   **Icons:** Lucide React for a comprehensive and consistent set of icons.
-   **Routing:** React Router for handling client-side navigation and routing.
-   **API Communication:** A generated Encore client for type-safe communication between the frontend and backend.

## Library Usage Rules

To maintain consistency and simplify development, please adhere to the following rules for library usage:

1.  **UI Components:**
    -   **Primary Choice:** Always use components from the `shadcn/ui` library whenever a suitable component is available.
    -   **Custom Components:** Only create new components if the required functionality or style cannot be achieved by composing or customizing `shadcn/ui` components. New components should be placed in `frontend/src/components/`.

2.  **Styling:**
    -   **Primary Choice:** Use Tailwind CSS utility classes for all styling.
    -   **Avoid:** Do not use inline styles (`style={{...}}`), traditional CSS stylesheets, or other CSS-in-JS libraries unless absolutely necessary for a specific, isolated reason (e.g., dynamic styles that cannot be handled by Tailwind).

3.  **Icons:**
    -   **Primary Choice:** Use icons from the `lucide-react` library. This ensures visual consistency across the application.

4.  **Routing:**
    -   **Primary Choice:** Use `react-router-dom` for all routing needs.
    -   **Route Definitions:** All primary routes should be defined in `frontend/src/App.tsx`.

5.  **State Management:**
    -   **Local State:** Use React's built-in hooks (`useState`, `useEffect`, `useContext`, `useReducer`) for managing component-level and simple application-wide state.
    -   **Server State:** For managing data fetched from the backend, use the auto-generated Encore client. This handles caching, re-fetching, and mutations.

6.  **Backend Interaction:**
    -   **Primary Choice:** All API calls to the Encore backend must go through the generated client located at `frontend/src/client.ts`. This provides type safety and a consistent API layer.

7.  **Code Formatting:**
    -   **Code Style:** Adhere to the existing code style and formatting conventions found in the project. Run any configured formatters or linters before committing code.