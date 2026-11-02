# School Management System - Backend API Documentation

Welcome to the School Management System REST API documentation. This document covers authentication, all core CRUD modules, search, filtering, pagination, and assignment operations.

---

## 1. General Information

- **Base URL**: `http://localhost:<PORT>/api/v1` (Default PORT: `3000` or configured via `.env`)
- **Content-Type**: `application/json`
- **CORS**: Enabled for all origins (`*`) with support for `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`.

### Authentication
All routes (except `/auth/signup`, `/auth/signin`, and `/info`) require a Bearer token in the request header:
```http
Authorization: Bearer <JWT_TOKEN>
```
*(Alternatively, you can pass the token using `x-access-token: <JWT_TOKEN>`)*

---

## 2. Standard Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "error": []
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description message",
  "data": [],
  "error": [
    "Detailed error explanation"
  ]
}
```

### Paginated Response Structure
All list endpoints (`GET /api/v1/<module>`) return:
```json
{
  "success": true,
  "message": "Successfully fetched records",
  "data": {
    "totalRecords": 45,
    "totalPages": 5,
    "currentPage": 1,
    "limit": 10,
    "rows": [ ... ]
  },
  "error": []
}
```

---

## 3. Query Parameters (Pagination, Search & Filtering)

All listing endpoints support the following query parameters:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | Integer | `1` | Page number to fetch |
| `limit` | Integer | `10` | Number of items per page (default is 10) |
| `search` | String | *None* | Performs a case-insensitive partial search across relevant text fields (e.g., name, email, etc.) |
| `all` | Boolean | `false` | When set to `true`, returns all records in `rows` without pagination (ideal for dropdown selects) |
| `school_id` | Integer | *None* | Filter records scoped to a specific school |
| `class_id` | Integer | *None* | Filter records scoped to a specific class (available for Students) |

---

## 4. API Endpoints

### 4.1 Authentication (`/auth`)

#### `POST /auth/signup`
Register an admin user.

- **Request Body**:
  ```json
  {
    "name": "Admin User",
    "email": "admin@school.com",
    "password": "Password123!",
    "mobile_number": "9876543210",
    "role_name": "admin"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Successfully registered user",
    "data": {
      "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@school.com",
        "mobile_number": "9876543210",
        "role": "admin"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
    },
    "error": []
  }
  ```

#### `POST /auth/signin`
Authenticate admin credentials and retrieve JWT token.

- **Request Body**:
  ```json
  {
    "email": "admin@school.com",
    "password": "Password123!"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully authenticated",
    "data": {
      "user": {
        "id": 1,
        "name": "Admin User",
        "email": "admin@school.com",
        "mobile_number": "9876543210",
        "role": "admin"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..."
    },
    "error": []
  }
  ```

#### `GET /auth/me`
Fetch current authenticated user profile. Requires Authorization header.

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully retrieved profile",
    "data": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@school.com",
      "mobile_number": "9876543210",
      "role": {
        "id": 1,
        "role_name": "admin"
      }
    },
    "error": []
  }
  ```

---

### 4.2 School Module (`/schools`)

#### `POST /schools`
Create a new school.

- **Request Body**:
  ```json
  {
    "name": "Springfield High School",
    "address": "742 Evergreen Terrace",
    "email": "contact@springfield.edu",
    "mobile_number": "9876543210"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Successfully created school",
    "data": {
      "id": 1,
      "name": "Springfield High School",
      "address": "742 Evergreen Terrace",
      "email": "contact@springfield.edu",
      "mobile_number": "9876543210",
      "updatedAt": "2026-11-02T10:00:00.000Z",
      "createdAt": "2026-11-02T10:00:00.000Z"
    },
    "error": []
  }
  ```

#### `GET /schools`
List schools with pagination and search.

- **Query Parameters**:
  - `page`: default `1`
  - `limit`: default `10`
  - `search`: search by name, email, address, or mobile number
  - `all`: pass `true` to get all schools without pagination
- **Sample Request**: `GET /api/v1/schools?page=1&limit=10&search=Springfield`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched schools",
    "data": {
      "totalRecords": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10,
      "rows": [
        {
          "id": 1,
          "name": "Springfield High School",
          "address": "742 Evergreen Terrace",
          "email": "contact@springfield.edu",
          "mobile_number": "9876543210"
        }
      ]
    },
    "error": []
  }
  ```

#### `GET /schools/:id`
Get school details along with classes and subjects summary.

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched school details",
    "data": {
      "id": 1,
      "name": "Springfield High School",
      "address": "742 Evergreen Terrace",
      "email": "contact@springfield.edu",
      "mobile_number": "9876543210",
      "classes": [
        { "id": 1, "name": "Grade 10-A" }
      ],
      "subjects": [
        { "id": 1, "name": "Mathematics" }
      ]
    },
    "error": []
  }
  ```

#### `PUT /schools/:id` or `PATCH /schools/:id`
Update an existing school.

- **Request Body**:
  ```json
  {
    "name": "Springfield International Academy"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully updated school",
    "data": { ... },
    "error": []
  }
  ```

#### `DELETE /schools/:id`
Delete a school. Cascades deletion to associated records.

- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully deleted school",
    "data": 1,
    "error": []
  }
  ```

#### School Scoped Helper Endpoints (Dropdowns):
- `GET /schools/:id/classes` - Returns all classes belonging to the specified school.
- `GET /schools/:id/subjects` - Returns all subjects belonging to the specified school.
- `GET /schools/:id/teachers` - Returns all teachers belonging to the specified school.

---

### 4.3 Classes Module (`/classes`)

#### `POST /classes`
Create a class under a school.

- **Request Body**:
  ```json
  {
    "name": "Grade 10-A",
    "school_id": 1
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Successfully created class",
    "data": {
      "id": 1,
      "name": "Grade 10-A",
      "school_id": 1
    },
    "error": []
  }
  ```

#### `GET /classes`
List classes with pagination, search, and school filtering.

- **Query Parameters**:
  - `page`: default `1`
  - `limit`: default `10`
  - `search`: search by class name
  - `school_id`: filter by school ID
  - `all`: pass `true` to fetch all classes (useful for select dropdowns)
- **Sample Request**: `GET /api/v1/classes?school_id=1&search=10`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched classes",
    "data": {
      "totalRecords": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10,
      "rows": [
        {
          "id": 1,
          "name": "Grade 10-A",
          "school_id": 1,
          "school": { "id": 1, "name": "Springfield High School" },
          "teachers": [],
          "subjects": []
        }
      ]
    },
    "error": []
  }
  ```

#### `GET /classes/:id`
Get class details including school, assigned teachers, and assigned subjects.

#### `PUT /classes/:id`
Update class details.

#### `DELETE /classes/:id`
Delete class.

#### `POST /classes/:id/teachers` (Assign Teacher to Class)
Assign a teacher to this class. Validates that both belong to the same school.

- **Request Body**:
  ```json
  {
    "teacher_id": 2
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully assigned teacher to class",
    "data": {
      "assigned": true,
      "isNew": true,
      "classId": "1",
      "teacherId": 2
    },
    "error": []
  }
  ```

#### `DELETE /classes/:id/teachers/:teacherId` (Unassign Teacher)
Remove an assigned teacher from this class.

#### `POST /classes/:id/subjects` (Assign Subject to Class)
Assign a subject to this class. Validates that both belong to the same school.

- **Request Body**:
  ```json
  {
    "subject_id": 3
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully assigned subject to class",
    "data": {
      "assigned": true,
      "isNew": true,
      "classId": "1",
      "subjectId": 3
    },
    "error": []
  }
  ```

#### `DELETE /classes/:id/subjects/:subjectId` (Unassign Subject)
Remove an assigned subject from this class.

---

### 4.4 Students Module (`/students`)

#### `POST /students`
Create a new student.

- **Request Body**:
  ```json
  {
    "first_name": "Bart",
    "last_name": "Simpson",
    "email": "bart@springfield.edu",
    "address": "742 Evergreen Terrace",
    "mobile_number": "9876543211",
    "school_id": 1,
    "class_id": 1
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Successfully created student",
    "data": {
      "id": 1,
      "first_name": "Bart",
      "last_name": "Simpson",
      "email": "bart@springfield.edu",
      "address": "742 Evergreen Terrace",
      "mobile_number": "9876543211",
      "school_id": 1,
      "class_id": 1
    },
    "error": []
  }
  ```

#### `GET /students`
List students with search, filters, and pagination.

- **Query Parameters**:
  - `page`: default `1`
  - `limit`: default `10`
  - `search`: searches first_name, last_name, email, or mobile_number
  - `school_id`: filter by school
  - `class_id`: filter by class
- **Sample Request**: `GET /api/v1/students?school_id=1&class_id=1&search=Bart`
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully fetched students",
    "data": {
      "totalRecords": 1,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 10,
      "rows": [
        {
          "id": 1,
          "first_name": "Bart",
          "last_name": "Simpson",
          "email": "bart@springfield.edu",
          "school": { "id": 1, "name": "Springfield High School" },
          "class": { "id": 1, "name": "Grade 10-A" }
        }
      ]
    },
    "error": []
  }
  ```

#### `GET /students/:id`
Get student details with school and class.

#### `PUT /students/:id`
Update student record.

#### `DELETE /students/:id`
Delete student record.

---

### 4.5 Teachers Module (`/teachers`)

#### `POST /teachers`
Create a new teacher.

- **Request Body**:
  ```json
  {
    "name": "Edna Krabappel",
    "email": "edna@springfield.edu",
    "address": "Apt 2B, Springfield",
    "mobile_number": "9876543212",
    "school_id": 1
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Successfully created teacher",
    "data": {
      "id": 1,
      "name": "Edna Krabappel",
      "email": "edna@springfield.edu",
      "address": "Apt 2B, Springfield",
      "mobile_number": "9876543212",
      "school_id": 1
    },
    "error": []
  }
  ```

#### `GET /teachers`
List teachers with pagination, search, and school filtering.

- **Query Parameters**:
  - `page`: default `1`
  - `limit`: default `10`
  - `search`: search by teacher name, email, or mobile number
  - `school_id`: filter by school
- **Sample Request**: `GET /api/v1/teachers?school_id=1&search=Edna`

#### `GET /teachers/:id`
Get teacher details including school, assigned classes, and assigned subjects.

#### `PUT /teachers/:id`
Update teacher details.

#### `DELETE /teachers/:id`
Delete teacher record.

#### `POST /teachers/:id/subjects` (Assign Subject to Teacher)
Assign a subject to a teacher. Both must belong to the same school.

- **Request Body**:
  ```json
  {
    "subject_id": 1
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Successfully assigned subject to teacher",
    "data": {
      "assigned": true,
      "isNew": true,
      "teacherId": "1",
      "subjectId": 1
    },
    "error": []
  }
  ```

#### `DELETE /teachers/:id/subjects/:subjectId` (Unassign Subject)
Remove an assigned subject from a teacher.

#### `POST /teachers/:id/classes` (Assign Class to Teacher)
Assign a class to a teacher. Both must belong to the same school.

- **Request Body**:
  ```json
  {
    "class_id": 1
  }
  ```

#### `DELETE /teachers/:id/classes/:classId` (Unassign Class)
Remove an assigned class from a teacher.

---

### 4.6 Subjects Module (`/subjects`)

#### `POST /subjects`
Create a subject under a school.

- **Request Body**:
  ```json
  {
    "name": "Mathematics",
    "school_id": 1
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Successfully created subject",
    "data": {
      "id": 1,
      "name": "Mathematics",
      "school_id": 1
    },
    "error": []
  }
  ```

#### `GET /subjects`
List subjects with search, school filtering, and pagination.

- **Query Parameters**:
  - `page`: default `1`
  - `limit`: default `10`
  - `search`: search by subject name
  - `school_id`: filter by school
  - `all`: pass `true` to fetch all subjects (useful for select dropdowns)
- **Sample Request**: `GET /api/v1/subjects?school_id=1&search=Math`

#### `GET /subjects/:id`
Get subject details including school, assigned teachers, and classes.

#### `PUT /subjects/:id`
Update subject record.

#### `DELETE /subjects/:id`
Delete subject record.

---

## 5. Summary Flow for the Frontend Sidebar Modules

1. **Admin Login**:
   - Call `POST /api/v1/auth/signin`.
   - Store the returned `token` (e.g. in `localStorage` or `sessionStorage`).
   - Redirect to dashboard/homepage.
2. **Sidebar Navigation**:
   - **Schools**: Call `GET /api/v1/schools?page=1&limit=10`.
   - **Classes**: Call `GET /api/v1/classes?page=1&limit=10`.
   - **Students**: Call `GET /api/v1/students?page=1&limit=10`.
   - **Teachers**: Call `GET /api/v1/teachers?page=1&limit=10`.
   - **Subjects**: Call `GET /api/v1/subjects?page=1&limit=10`.
3. **Search & Filters**:
   - Search bar typing triggers `?search=<term>&page=1`.
   - Dropdown selection triggers `?school_id=<selectedSchoolId>&page=1`.
4. **Assignment Modals / Actions**:
   - **Assign Teacher to Class**:
     - User selects school -> call `GET /api/v1/schools/:id/classes` and `GET /api/v1/schools/:id/teachers`.
     - User clicks Assign -> call `POST /api/v1/classes/:classId/teachers` with `{ "teacher_id": ... }`.
   - **Assign Subject to Teacher**:
     - User selects school -> call `GET /api/v1/schools/:id/subjects` and `GET /api/v1/schools/:id/teachers`.
     - User clicks Assign -> call `POST /api/v1/teachers/:teacherId/subjects` with `{ "subject_id": ... }`.
   - **Assign Subject to Class**:
     - User selects school -> call `GET /api/v1/schools/:id/classes` and `GET /api/v1/schools/:id/subjects`.
     - User clicks Assign -> call `POST /api/v1/classes/:classId/subjects` with `{ "subject_id": ... }`.

