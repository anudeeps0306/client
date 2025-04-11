# URL Shortener Client

This React application is a client-side interface for a URL shortening service. It allows users to create, view, and manage shortened URLs, as well as view analytics.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/anudeeps0306/client
    cd client
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    * Create a `.env.local` file in the root directory.
    * Add the following variable, adjusting the URL if necessary:

        ```
        REACT_APP_API_URL=http://localhost:5000 
        ```

        (This should be the URL of your backend server)

4.  **Run the application:**

    ```bash
    npm start
    ```

    The app will be accessible at `http://localhost:3000` in development mode.

## Routes

The application uses React Router for navigation and defines the following routes:

* `/` :
    * If the user is **not authenticated**, this displays the `Login` component, allowing them to sign in [cite: client/src/App.js, client/src/components/auth/Login.js].
    * If the user **is authenticated**, this redirects them to the `/dashboard` [cite: client/src/App.js].
* `/dashboard` :
    * Displays the `Dashboard` component, showing the user's shortened URLs, search functionality, and a link to create new URLs [cite: client/src/App.js, client/src/components/dashboard/Dashboard.js].
    * Accessible only to authenticated users.
* `/create` :
    * Displays the `UrlForm` component, allowing users to create a new shortened URL [cite: client/src/App.js, client/src/components/url/UrlForm.js].
    * Accessible only to authenticated users.
* `/url/:id` :
    * Displays the `UrlDetail` component, showing analytics for a specific URL (e.g., clicks over time, device/browser breakdown) [cite: client/src/App.js, client/src/components/url/UrlDetail.js].
    * `id` is a parameter representing the unique identifier of the URL.
    * Accessible only to authenticated users.

## Authentication

* The application uses JWT (JSON Web Tokens) for authentication.
* After successful login, the token is stored in `localStorage` and included in the `x-auth-token` header for subsequent requests [cite: client/src/utils/setAuthToken.js, client/src/redux/authSlice.js].

## Redux

* Redux is used for state management.
* The Redux store is configured in `src/redux/store.js` [cite: client/src/redux/store.js].
* Authentication-related state is managed in `src/redux/authSlice.js` [cite: client/src/redux/authSlice.js].
* URL-related state (URLs, analytics) is managed in `src/redux/urlSlice.js` [cite: client/src/redux/urlSlice.js].

## Key Components

* `Login.js`:  Handles user login.
* `Dashboard.js`:  Displays the main dashboard with the list of URLs.
* `UrlForm.js`:  Provides a form to create new URLs.
* `UrlDetail.js`:  Displays detailed analytics for a specific URL.
* `Navbar.js`:  The application's navigation bar.
* `setAuthToken.js`:  A utility to set/clear the JWT in the Axios request headers.

## Notes

* This client-side application relies on a separate backend server to handle API requests, user authentication, and URL redirection.
* Styling is implemented using Tailwind CSS.
