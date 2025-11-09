# API 엔드포인트 상세 정보

총 50개의 엔드포인트

## AI Data (5개)

### GET /api/ai-data/activities

**요약**: Get user activities data (AI server only)

#### Parameters

- **page** (query)
  - Type: number

- **limit** (query)
  - Type: number

- **startDate** (query)
  - Type: string

- **endDate** (query)
  - Type: string

#### Responses

**200**: 

---

### GET /api/ai-data/reactions

**요약**: Get reactions data (AI server only)

#### Parameters

- **page** (query)
  - Type: number

- **limit** (query)
  - Type: number

- **startDate** (query)
  - Type: string

- **endDate** (query)
  - Type: string

#### Responses

**200**: 

---

### GET /api/ai-data/relations

**요약**: Get paper relations data (AI server only)

#### Parameters

- **page** (query)
  - Type: number

- **limit** (query)
  - Type: number

- **startDate** (query)
  - Type: string

- **endDate** (query)
  - Type: string

#### Responses

**200**: 

---

### GET /api/ai-data/views

**요약**: Get paper views data (AI server only)

#### Parameters

- **page** (query)
  - Type: number

- **limit** (query)
  - Type: number

- **startDate** (query)
  - Type: string

- **endDate** (query)
  - Type: string

#### Responses

**200**: 

---

### GET /api/ai-data/users/{userId}/profile

**요약**: Get user profile and preferences (AI server only)

#### Parameters

- **userId** (path) [required]
  - Type: string

#### Responses

**200**: 

---

## App (1개)

### GET /api/version

#### Responses

**200**: 

---

## Assets (1개)

### GET /api/assets/exists

#### Parameters

- **key** (query) [required]
  - Type: string

#### Responses

**200**: 

---

## Auth (4개)

### POST /api/auth/register

**요약**: Register a new user

#### Request Body

**Required**: Yes

**Content-Type**: multipart/form-data

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "email": {
      "type": "string",
      "format": "email",
      "example": "user@example.com"
    },
    "password": {
      "type": "string",
      "minLength": 6,
      "example": "password123"
    },
    "name": {
      "type": "string",
      "example": "John Doe"
    },
    "profilePicture": {
      "type": "string",
      "format": "binary",
      "description": "Profile picture image file (optional)"
    }
  },
  "required": [
    "email",
    "password",
    "name"
  ]
}
```

#### Responses

**200**: User registration successful

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/LoginResponseDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**400**: Bad Request

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 400
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Bad Request"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**409**: Conflict

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 409
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Conflict"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**500**: Internal Server Error

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 500
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Internal Server Error"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### POST /api/auth/login

**요약**: Login with email and password

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/LoginDto"
}
```

#### Responses

**200**: User login successful

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/LoginResponseDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**401**: Unauthorized

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 401
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Unauthorized"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**500**: Internal Server Error

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 500
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Internal Server Error"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### POST /api/auth/logout

**요약**: Logout current user

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/LogoutRequestDto"
}
```

#### Responses

**200**: User logout successful

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "type": "boolean"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**401**: Unauthorized

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 401
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Unauthorized"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**500**: Internal Server Error

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 500
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Internal Server Error"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### POST /api/auth/refresh

**요약**: Refresh access token

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/RefreshTokenRequestDto"
}
```

#### Responses

**200**: Token refresh successful

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/LoginResponseDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**400**: Bad Request

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 400
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Bad Request"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**401**: Unauthorized

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 401
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Unauthorized"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**500**: Internal Server Error

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 500
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Internal Server Error"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

## Chat (5개)

### POST /api/chat/sessions

**요약**: Create a new chat session

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/CreateSessionDto"
}
```

#### Responses

**201**: 

---

### GET /api/chat/sessions

**요약**: Get my chat sessions

#### Responses

**200**: 

---

### GET /api/chat/sessions/{sessionId}

**요약**: Get chat session detail

#### Parameters

- **sessionId** (path) [required]
  - Type: string

#### Responses

**200**: 

---

### POST /api/chat/sessions/{sessionId}/messages

**요약**: Send a message in a chat session

#### Parameters

- **sessionId** (path) [required]
  - Type: string

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/SendMessageDto"
}
```

#### Responses

**201**: 

---

### GET /api/chat/sessions/{sessionId}/messages

**요약**: Get messages in a chat session

#### Parameters

- **sessionId** (path) [required]
  - Type: string

- **page** (query)
  - Page number
  - Type: number

- **limit** (query)
  - Items per page
  - Type: number

#### Responses

**200**: 

---

## Crawler - Papers (2개)

### POST /api/crawler/papers

**요약**: Create a new paper (crawler only)

#### Request Body

**Required**: Yes

**Content-Type**: multipart/form-data

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "paperId": {
      "type": "string"
    },
    "title": {
      "type": "string"
    },
    "categories": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "authors": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "summary": {
      "type": "string"
    },
    "content": {
      "type": "object"
    },
    "doi": {
      "type": "string"
    },
    "pdfId": {
      "type": "string",
      "description": "Optional: existing PDF asset ID"
    },
    "pdf": {
      "type": "string",
      "format": "binary",
      "description": "PDF file (optional if pdfId is provided)"
    },
    "thumbnailId": {
      "type": "string",
      "description": "Optional: existing thumbnail asset ID"
    },
    "thumbnail": {
      "type": "string",
      "format": "binary",
      "description": "Thumbnail image file (optional if thumbnailId is provided)"
    },
    "url": {
      "type": "string"
    },
    "pdfUrl": {
      "type": "string"
    },
    "issuedAt": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "paperId",
    "title",
    "categories",
    "authors",
    "summary",
    "content",
    "doi"
  ]
}
```

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/PaperDetailDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### DELETE /api/crawler/papers/{paperId}

**요약**: Delete a paper (crawler only)

#### Parameters

- **paperId** (path) [required]
  - Type: string

#### Responses

**200**: 

---

## Discussions (8개)

### POST /api/papers/{paperId}/discussions

**요약**: Create a new discussion for a paper

#### Parameters

- **paperId** (path) [required]
  - Type: string

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/CreateDiscussionDto"
}
```

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/DiscussionDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### GET /api/papers/{paperId}/discussions

**요약**: Get discussions for a paper

#### Parameters

- **paperId** (path) [required]
  - Type: string

- **page** (query)
  - Page number
  - Type: number

- **limit** (query)
  - Items per page
  - Type: number

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/PaginatedDiscussionsDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### GET /api/discussions/{discussionId}

**요약**: Get discussion detail

#### Parameters

- **discussionId** (path) [required]
  - Type: string

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/DiscussionDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### POST /api/discussions/{discussionId}/messages

**요약**: Create a message in a discussion

#### Parameters

- **discussionId** (path) [required]
  - Type: string

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/CreateMessageDto"
}
```

#### Responses

**201**: 

---

### GET /api/discussions/{discussionId}/messages

**요약**: Get messages in a discussion

#### Parameters

- **discussionId** (path) [required]
  - Type: string

- **page** (query)
  - Page number
  - Type: number

- **limit** (query)
  - Items per page
  - Type: number

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/PaginatedMessagesDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### PATCH /api/discussions/{discussionId}/messages/{messageId}

**요약**: Update a message (owner only)

#### Parameters

- **messageId** (path) [required]
  - Type: string

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/UpdateMessageDto"
}
```

#### Responses

**200**: 

---

### DELETE /api/discussions/{discussionId}/messages/{messageId}

**요약**: Delete a message (owner only)

#### Parameters

- **messageId** (path) [required]
  - Type: string

#### Responses

**200**: 

---

### POST /api/discussions/{discussionId}/messages/{messageId}/like

**요약**: Toggle like on a message

#### Parameters

- **messageId** (path) [required]
  - Type: string

#### Responses

**201**: 

---

## Health (1개)

### GET /api/health

#### Responses

**200**: The Health Check is successful

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "example": "ok"
    },
    "info": {
      "type": "object",
      "example": {
        "database": {
          "status": "up"
        }
      },
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      },
      "nullable": true
    },
    "error": {
      "type": "object",
      "example": {},
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      },
      "nullable": true
    },
    "details": {
      "type": "object",
      "example": {
        "database": {
          "status": "up"
        }
      },
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      }
    }
  }
}
```

**503**: The Health Check is not successful

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "string",
      "example": "error"
    },
    "info": {
      "type": "object",
      "example": {
        "database": {
          "status": "up"
        }
      },
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      },
      "nullable": true
    },
    "error": {
      "type": "object",
      "example": {
        "redis": {
          "status": "down",
          "message": "Could not connect"
        }
      },
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      },
      "nullable": true
    },
    "details": {
      "type": "object",
      "example": {
        "database": {
          "status": "up"
        },
        "redis": {
          "status": "down",
          "message": "Could not connect"
        }
      },
      "additionalProperties": {
        "type": "object",
        "required": [
          "status"
        ],
        "properties": {
          "status": {
            "type": "string"
          }
        },
        "additionalProperties": true
      }
    }
  }
}
```

---

## Notifications (4개)

### GET /api/notifications

**요약**: Get my notifications

#### Parameters

- **page** (query)
  - Page number
  - Type: number

- **limit** (query)
  - Items per page
  - Type: number

#### Responses

**200**: 

---

### GET /api/notifications/unread-count

**요약**: Get count of unread notifications

#### Responses

**200**: 

---

### PATCH /api/notifications/{notificationId}/read

**요약**: Mark notification as read

#### Parameters

- **notificationId** (path) [required]
  - Type: string

#### Responses

**200**: 

---

### PATCH /api/notifications/read-all

**요약**: Mark all notifications as read

#### Responses

**200**: 

---

## Paper Relations (4개)

### POST /api/crawler/papers/{paperId}/relations

**요약**: Create paper relation (crawler/AI server only)

#### Parameters

- **paperId** (path) [required]
  - Type: string

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/CreateRelationDto"
}
```

#### Responses

**201**: 

---

### GET /api/papers/{paperId}/related

**요약**: Get all related papers

#### Parameters

- **paperId** (path) [required]
  - Type: string

- **limit** (query)
  - Type: number

#### Responses

**200**: 

---

### GET /api/papers/{paperId}/similar

**요약**: Get similar papers

#### Parameters

- **paperId** (path) [required]
  - Type: string

- **limit** (query)
  - Type: number

#### Responses

**200**: 

---

### GET /api/papers/{paperId}/opposing

**요약**: Get opposing papers

#### Parameters

- **paperId** (path) [required]
  - Type: string

- **limit** (query)
  - Type: number

#### Responses

**200**: 

---

## Papers (4개)

### GET /api/papers

**요약**: Get papers list with pagination and filters

#### Parameters

- **page** (query)
  - Page number
  - Type: number

- **limit** (query)
  - Items per page
  - Type: number

- **sortBy** (query)
  - Type: string

- **sortOrder** (query)
  - Type: string

- **categories** (query)
  - Filter by categories
  - Type: array

- **authors** (query)
  - Filter by authors
  - Type: array

- **year** (query)
  - Filter by year
  - Type: number

- **searchQuery** (query)
  - Search query
  - Type: string

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/PaperListDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### GET /api/papers/categories

**요약**: Get all categories with paper counts

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "type": "array",
      "items": {
        "$ref": "#/components/schemas/CategoryDto"
      }
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### GET /api/papers/categories/{category}

**요약**: Get papers by category

#### Parameters

- **category** (path) [required]
  - Type: string

- **page** (query)
  - Page number
  - Type: number

- **limit** (query)
  - Items per page
  - Type: number

- **sortBy** (query)
  - Type: string

- **sortOrder** (query)
  - Type: string

- **categories** (query)
  - Filter by categories
  - Type: array

- **authors** (query)
  - Filter by authors
  - Type: array

- **year** (query)
  - Filter by year
  - Type: number

- **searchQuery** (query)
  - Search query
  - Type: string

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/PaperListDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### GET /api/papers/{paperId}

**요약**: Get paper detail by paper ID

#### Parameters

- **paperId** (path) [required]
  - Type: string

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/PaperDetailDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

## Preferences (2개)

### GET /api/preferences

**요약**: Get my preferences

#### Responses

**200**: 

---

### PATCH /api/preferences

**요약**: Update my preferences

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/UpdatePreferenceDto"
}
```

#### Responses

**200**: 

---

## Reactions (3개)

### POST /api/papers/{paperId}/reactions

**요약**: Toggle reaction on a paper (LIKE/UNLIKE)

#### Parameters

- **paperId** (path) [required]
  - Type: string

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/ToggleReactionDto"
}
```

#### Responses

**201**: 

---

### GET /api/papers/{paperId}/reactions

**요약**: Get paper reaction statistics

#### Parameters

- **paperId** (path) [required]
  - Type: string

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/ReactionStatsDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### GET /api/users/me/reactions

**요약**: Get my reactions

#### Parameters

- **page** (query)
  - Page number
  - Type: number

- **limit** (query)
  - Items per page
  - Type: number

#### Responses

**200**: Success

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/UserReactionsDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

## Subscriptions (4개)

### POST /api/subscriptions

**요약**: Subscribe to a category/tag/journal/author

#### Request Body

**Required**: Yes

**Content-Type**: application/json

**Schema**:
```json
{
  "$ref": "#/components/schemas/SubscribeDto"
}
```

#### Responses

**201**: 

---

### GET /api/subscriptions

**요약**: Get my subscriptions

#### Responses

**200**: 

---

### DELETE /api/subscriptions/{subscriptionId}

**요약**: Unsubscribe

#### Parameters

- **subscriptionId** (path) [required]
  - Type: string

#### Responses

**200**: 

---

### PATCH /api/subscriptions/{subscriptionId}/toggle

**요약**: Toggle subscription active status

#### Parameters

- **subscriptionId** (path) [required]
  - Type: string

#### Responses

**200**: 

---

## User (2개)

### GET /api/users/me

#### Responses

**200**: User detail successful

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/UserDetailResponseDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**400**: Bad Request

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 400
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Bad Request"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**401**: Unauthorized

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 401
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Unauthorized"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**500**: Internal Server Error

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 500
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Internal Server Error"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

### PATCH /api/users/me

**요약**: Update user profile (name and/or profile picture)

#### Request Body

**Required**: Yes

**Content-Type**: multipart/form-data

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "example": "John Doe",
      "description": "User name (optional)"
    },
    "profilePicture": {
      "type": "string",
      "format": "binary",
      "description": "Profile picture image file (optional)"
    }
  }
}
```

#### Responses

**200**: Profile updated successfully

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 200
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Success"
    },
    "data": {
      "$ref": "#/components/schemas/UserDetailResponseDto"
    },
    "errors": {
      "type": "object",
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**400**: Bad Request

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 400
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Bad Request"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**401**: Unauthorized

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 401
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Unauthorized"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**404**: Not Found

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 404
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Not Found"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

**500**: Internal Server Error

**Content-Type**: application/json

**Schema**:
```json
{
  "type": "object",
  "properties": {
    "status": {
      "type": "number",
      "example": 500
    },
    "method": {
      "type": "string",
      "enum": [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS",
        "HEAD"
      ]
    },
    "instance": {
      "type": "string",
      "example": "/api/auth/login"
    },
    "details": {
      "type": "string",
      "example": "Internal Server Error"
    },
    "data": {
      "type": "null"
    },
    "errors": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "field": {
            "type": "string"
          },
          "message": {
            "type": "string"
          }
        }
      },
      "nullable": true
    },
    "timestamp": {
      "type": "string",
      "example": "2025-10-12T02:54:44.123Z"
    }
  },
  "required": [
    "status",
    "method",
    "instance",
    "details",
    "data",
    "timestamp"
  ]
}
```

---

