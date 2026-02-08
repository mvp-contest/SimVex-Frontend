# SimVex Backend API Documentation

**Base URL:** `http://simvex-backend.dokploy.byeolki.me`

## Authentication

### Register
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "nickname": "UserName",
    "personalId": "unique_id"
  }
  ```
- **Response:** Returns user object with `access_token`

### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "access_token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "UserName",
      "personalId": "unique_id"
    }
  }
  ```

## Profile

### Get Profile
- **GET** `/profile/{userId}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Profile object
- **Note:** May return 500 if profile doesn't exist yet

### Update Profile
- **PATCH** `/profile/{userId}`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "nickname": "NewName",
    "aboutUs": "About me text",
    "avatar": "avatar_url"
  }
  ```

## Teams

### List User Teams
- **GET** `/teams/user/{userId}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Array of team objects

### Get Team
- **GET** `/teams/{teamId}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Team object with members

### Create Team
- **POST** `/teams`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "name": "Team Name"
  }
  ```

### Update Team
- **PATCH** `/teams/{teamId}`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "name": "New Team Name"
  }
  ```

### Delete Team
- **DELETE** `/teams/{teamId}`
- **Headers:** `Authorization: Bearer {token}`

### Update Member Role
- **PATCH** `/teams/{teamId}/members/{userId}`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "role": 1
  }
  ```
- **Roles:** 0 = Owner, 1 = Admin, 2 = Member

### Remove Member
- **DELETE** `/teams/{teamId}/members/{userId}`
- **Headers:** `Authorization: Bearer {token}`

## Projects

### List User Projects
- **GET** `/projects/user/{userId}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Array of project objects

### List Team Projects
- **GET** `/projects/team/{teamId}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Array of project objects

### Get Project
- **GET** `/projects/{projectId}`
- **Headers:** `Authorization: Bearer {token}`
- **Response:** Project object with members

### Create Project
- **POST** `/projects`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "teamId": "team_uuid",
    "name": "Project Name"
  }
  ```

### Update Project
- **PATCH** `/projects/{projectId}`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "name": "New Project Name"
  }
  ```

### Delete Project
- **DELETE** `/projects/{projectId}`
- **Headers:** `Authorization: Bearer {token}`

### Update Project Member Role
- **PATCH** `/projects/{projectId}/members/{userId}`
- **Headers:** `Authorization: Bearer {token}`
- **Body:**
  ```json
  {
    "role": 1
  }
  ```

### Remove Project Member
- **DELETE** `/projects/{projectId}/members/{userId}`
- **Headers:** `Authorization: Bearer {token}`

---

## Known Issues

1. **Profile API** - Returns 500 error if profile doesn't exist
   - **Solution:** Frontend handles this gracefully by using user data as fallback

2. **CORS** - Backend has `access-control-allow-origin: *` enabled

3. **Authentication** - JWT token stored in localStorage as `token`

---

## Frontend Integration Notes

- All API calls use Bearer token authentication
- Token is automatically included via the `request()` wrapper in `src/lib/api.ts`
- User data is stored in localStorage as JSON string
- AuthContext manages global authentication state
