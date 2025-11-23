# Smart Guys List

A modern web application for managing a list of intelligent people ("brainiacs"). Built with vanilla JavaScript, Bootstrap, and Parcel bundler, integrating with the ReqRes API.

## Features

- **View Users**: Fetch and display a list of users in a responsive table
- **Add User**: Create new brainiacs with first name, last name, and email
- **Edit User**: Update existing user information
- **Delete User**: Remove users from the list with confirmation
- **Modal Forms**: Clean UI with Bootstrap modals for add/edit/delete operations
- **Responsive Design**: Mobile-friendly interface with hamburger menu
- **Icons**: FontAwesome icons for edit and delete actions

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES6+)
- **Styling**: SCSS + Bootstrap 5
- **Icons**: FontAwesome Free
- **Build Tool**: Parcel
- **API**: ReqRes (https://reqres.in)
- **Package Manager**: npm

## Project Structure

```
smart-guys-list/
├── src/
│   ├── main.js           # Main application logic
│   ├── main.scss         # Styles
│   └── index.html        # HTML entry point
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Installation

1. Clone or download the project:
```bash
cd smart-guys-list
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

4. Build for production:
```bash
npm run build
```

## Usage

### Viewing Users
- The app automatically loads users from the ReqRes API on page load
- Users are displayed in a paginated table with avatar, name, and email

### Adding a User
1. Click the **"Add Brainiac"** button
2. Fill in the form with first name, last name, and email
3. Click **"Submit"** to create the user
4. The table refreshes automatically

### Editing a User
1. Click the **edit icon** (pencil) next to a user
2. Update the form fields
3. Click **"Submit"** to save changes
4. The table refreshes with updated data

### Deleting a User
1. Click the **delete icon** (trash) next to a user
2. Confirm deletion in the modal
3. The user is removed from the list

## API Integration

The app uses the **ReqRes API** (`https://reqres.in`) for all CRUD operations:

- **GET** `/api/users?page=1&per_page=6` — Fetch users (paginated)
- **POST** `/api/users` — Create new user
- **PUT** `/api/users/{id}` — Update user
- **DELETE** `/api/users/{id}` — Delete user

All requests include the API key header: `x-api-key: reqres-free-v1`

## Classes

### `Brainiac`
Represents a single user in the system.

**Properties:**
- `id` — Unique identifier
- `avatar` — URL to avatar image
- `first_name` — User's first name
- `last_name` — User's last name
- `email` — User's email address
- `deleted` — Boolean flag for soft deletion

**Methods:**
- `delete()` — Mark user as deleted
- `getRowHTML()` — Generate a table row DOM element

### `ApiClient`
Handles all HTTP communication with the ReqRes API.

**Methods:**
- `request(method, endpoint, body)` — Generic fetch wrapper
- `get(endpoint)` — GET request
- `post(endpoint, body)` — POST request
- `put(endpoint, body)` — PUT request
- `delete(endpoint)` — DELETE request
- `getUsers(page, perpage)` — Fetch paginated users
- `getUser(userId)` — Fetch single user
- `createUser(body)` — Create new user
- `putUser(userId, body)` — Update user
- `deleteUser(userId)` — Delete user

## UI Components

- **Main Table**: Displays all brainiacs with actions
- **Add/Edit Modal**: Form for creating and updating users
- **Delete Confirmation Modal**: Confirms deletion before removing user
- **Hamburger Menu**: Mobile navigation toggle
- **Responsive Grid**: Adapts to mobile, tablet, and desktop screens

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Limitations

- ReqRes API returns mock data (changes are not persisted long-term)
- Pagination UI not fully implemented (API supports it, but UI controls missing)
- No advanced filtering or search functionality
- No user authentication/authorization

## Future Improvements

- [ ] Implement pagination controls (Next/Prev buttons)
- [ ] Add search and filter functionality
- [ ] Add input validation and error messages
- [ ] Implement request timeout handling
- [ ] Add unit tests (Jest/Vitest)
- [ ] TypeScript support
- [ ] Dark mode theme
- [ ] Persistent local storage fallback

## License

This project is open source and available under the MIT License.

## Author

Created as a learning project for managing user lists with modern web technologies.