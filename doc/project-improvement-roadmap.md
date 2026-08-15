# Project Improvement Roadmap

The project has a good basic CRUD foundation, but it is currently an API prototype. The main missing functionality is authentication, frontend interaction, validation, and security.

## Important missing functionality

### 1. User management

Create APIs and UI for:

- User registration
- Login and logout
- Password hashing with `bcrypt` or `argon2`
- Session or JWT-based authentication
- Current-user endpoint such as `GET /api/auth/me`
- Profile management
- Unique email validation

The current `User.password` field exists, but passwords should never be stored as plain text.

### 2. Authentication and authorization

Currently, anyone can access or modify todos if they know an ID.

Add:

- Authentication middleware
- Protected API routes
- User-specific todo queries
- Authorization checks before update/delete
- Admin-only permissions
- Session expiration and logout
- Protection against unauthorized `userId` changes

Users should only see todos belonging to the authenticated user:

```text
Todos where userId = authenticatedUser.id
```

### 3. Complete frontend

The homepage currently only displays `Todo Application`.

Create:

- Todo list page
- Add todo form
- Edit todo form
- Delete confirmation
- Mark todo as completed/uncompleted
- Loading states
- Empty states
- Error messages
- User login and registration pages
- Responsive design
- Search and filtering

Suggested pages:

```text
/login
/register
/todos
/todos/[id]
/profile
/admin/users
```

### 4. Request validation

The current `POST` handler only checks whether `title` and `userId` exist.

Add Zod schemas for:

- Create todo
- Update todo
- Register user
- Login user
- User profile updates

Validate:

- Title length
- Description length
- Email format
- Password strength
- Allowed update fields
- Valid IDs

The current `PATCH` handler forwards the entire request body directly to Prisma, which is unsafe. A client could try to update fields such as `userId`, `id`, or timestamps. Only explicitly allowed fields should be accepted.

### 5. Fix the dynamic API route

The current file is:

```text
app/api/[id]/route.ts
```

Therefore, the actual endpoint is:

```text
/api/:id
```

For consistency with the collection endpoint, move it to:

```text
app/api/todos/[id]/route.ts
```

Then the API becomes:

```text
GET    /api/todos
POST   /api/todos
GET    /api/todos/:id
PATCH  /api/todos/:id
DELETE /api/todos/:id
```

### 6. Better API design

Add:

- Pagination
- Search by title
- Filtering by completed status
- Sorting
- User-specific endpoints
- Consistent error formats
- Correct HTTP status handling for missing records
- Rate limiting
- Request logging

Example:

```text
GET /api/todos?completed=false&page=1&limit=20&search=work
```

### 7. Better project architecture

As the project grows, move database operations out of route files.

Suggested structure:

```text
app/api/                 # HTTP routes only
services/todo.service.ts # Todo business logic
services/auth.service.ts # Authentication logic
lib/validations/         # Zod schemas
lib/auth/                # Sessions and password utilities
lib/errors/              # Shared error handling
types/                   # Shared TypeScript types
```

A route should mainly:

1. Authenticate the request.
2. Validate input.
3. Call a service.
4. Return the response.

This separation makes the application easier to test, maintain, and extend.

### 8. Database improvements

Consider adding:

- Indexes on `Todo.userId` and `Todo.completed` where useful
- An optional due date
- Priority
- Tags or categories
- Soft-delete support
- A todo status enum instead of only a Boolean
- Audit fields such as `createdBy`

Example additional fields:

```prisma
dueDate   DateTime?
priority  Int       @default(0)
archived  Boolean   @default(false)
```

### 9. Testing

Add tests for:

- Creating a todo
- Missing title
- Missing user
- Reading todos
- Updating completion status
- Deleting a todo
- Nonexistent todo IDs
- Unauthorized access
- Invalid request data
- Login and registration

Use unit tests for services and integration tests for API routes.

### 10. Production readiness

Before deployment:

- Do not commit `.env` secrets.
- Hash passwords.
- Add authentication.
- Add validation.
- Add centralized error handling.
- Add structured logging.
- Add database backups.
- Add CI checks.
- Run `npm run lint`.
- Run `npm run build`.
- Add monitoring and error tracking.

## Recommended implementation order

1. Fix the `/api/todos/[id]` route location.
2. Add Zod validation.
3. Create user registration and login.
4. Add password hashing and sessions.
5. Protect all todo routes.
6. Restrict todos to the logged-in user.
7. Build the todo frontend.
8. Add filtering, pagination, and search.
9. Add tests.
10. Add admin functionality and production monitoring.

## Highest-priority issue

The most urgent issue is security. The current API has no authentication, so users are not protected from viewing or modifying other users' todos. Authentication and authorization should be implemented before the application is used with real user data or deployed publicly.

## Suggested feature roadmap

### Phase 1: Secure the existing API

- Move the dynamic route to `app/api/todos/[id]/route.ts`.
- Add request validation with Zod.
- Add proper not-found handling for update and delete operations.
- Restrict PATCH fields to `title`, `description`, and `completed`.
- Add service functions for todo operations.

### Phase 2: Add authentication

- Create registration and login endpoints.
- Hash passwords securely.
- Add sessions or JWTs.
- Add authentication middleware.
- Add authorization checks for every todo operation.

### Phase 3: Build the user interface

- Create login and registration screens.
- Create the todo dashboard.
- Add todo creation, editing, completion, and deletion.
- Add loading, empty, and error states.
- Make the interface responsive.

### Phase 4: Improve usability

- Add search and filters.
- Add pagination.
- Add due dates and priorities.
- Add categories or tags.
- Add sorting and archived todos.

### Phase 5: Prepare for production

- Add automated tests.
- Add CI/CD checks.
- Add monitoring and logging.
- Configure secure production environment variables.
- Set up backups and database maintenance.

