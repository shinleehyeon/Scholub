
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/api/version": {
        "get": {
          "operationId": "AppController_getVersion",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "App"
          ],
          "security": []
        }
      },
      "/api/assets/exists": {
        "get": {
          "operationId": "AssetController_checkAssetExists",
          "parameters": [
            {
              "name": "key",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "tags": [
            "Assets"
          ]
        }
      },
      "/api/auth/register": {
        "post": {
          "operationId": "AuthController_register",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
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
              }
            }
          },
          "responses": {
            "200": {
              "description": "User registration successful",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "409": {
              "description": "Conflict",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Register a new user",
          "tags": [
            "Auth"
          ],
          "security": []
        }
      },
      "/api/auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "User login successful",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Login with email and password",
          "tags": [
            "Auth"
          ],
          "security": []
        }
      },
      "/api/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LogoutRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "User logout successful",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Logout current user",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/auth/refresh": {
        "post": {
          "operationId": "AuthController_refreshToken",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RefreshTokenRequestDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Token refresh successful",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Refresh access token",
          "tags": [
            "Auth"
          ],
          "security": []
        }
      },
      "/api/users/me": {
        "get": {
          "operationId": "UserController_detail",
          "parameters": [],
          "responses": {
            "200": {
              "description": "User detail successful",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "tags": [
            "User"
          ]
        },
        "patch": {
          "operationId": "UserController_updateProfile",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
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
              }
            }
          },
          "responses": {
            "200": {
              "description": "Profile updated successfully",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "400": {
              "description": "Bad Request",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "401": {
              "description": "Unauthorized",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "404": {
              "description": "Not Found",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "500": {
              "description": "Internal Server Error",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Update user profile (name and/or profile picture)",
          "tags": [
            "User"
          ]
        }
      },
      "/api/papers": {
        "get": {
          "operationId": "PaperController_listPapers",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Items per page",
              "schema": {
                "default": 20,
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "issuedAt",
                  "likeCount",
                  "totalViewCount"
                ]
              }
            },
            {
              "name": "sortOrder",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "categories",
              "required": false,
              "in": "query",
              "description": "Filter by categories",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            {
              "name": "authors",
              "required": false,
              "in": "query",
              "description": "Filter by authors",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            {
              "name": "year",
              "required": false,
              "in": "query",
              "description": "Filter by year",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "searchQuery",
              "required": false,
              "in": "query",
              "description": "Search query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Get papers list with pagination and filters",
          "tags": [
            "Papers"
          ]
        }
      },
      "/api/papers/categories": {
        "get": {
          "operationId": "PaperController_getCategories",
          "parameters": [],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Get all categories with paper counts",
          "tags": [
            "Papers"
          ]
        }
      },
      "/api/papers/categories/{category}": {
        "get": {
          "operationId": "PaperController_listPapersByCategory",
          "parameters": [
            {
              "name": "category",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Items per page",
              "schema": {
                "default": 20,
                "type": "number"
              }
            },
            {
              "name": "sortBy",
              "required": false,
              "in": "query",
              "schema": {
                "default": "createdAt",
                "type": "string",
                "enum": [
                  "createdAt",
                  "issuedAt",
                  "likeCount",
                  "totalViewCount"
                ]
              }
            },
            {
              "name": "sortOrder",
              "required": false,
              "in": "query",
              "schema": {
                "default": "desc",
                "type": "string",
                "enum": [
                  "asc",
                  "desc"
                ]
              }
            },
            {
              "name": "categories",
              "required": false,
              "in": "query",
              "description": "Filter by categories",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            {
              "name": "authors",
              "required": false,
              "in": "query",
              "description": "Filter by authors",
              "schema": {
                "type": "array",
                "items": {
                  "type": "string"
                }
              }
            },
            {
              "name": "year",
              "required": false,
              "in": "query",
              "description": "Filter by year",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "searchQuery",
              "required": false,
              "in": "query",
              "description": "Search query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Get papers by category",
          "tags": [
            "Papers"
          ]
        }
      },
      "/api/papers/{paperId}": {
        "get": {
          "operationId": "PaperController_getPaperDetail",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get paper detail by paper ID",
          "tags": [
            "Papers"
          ]
        }
      },
      "/api/crawler/papers": {
        "post": {
          "operationId": "PaperCrawlerController_createPaper",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
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
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Create a new paper (crawler only)",
          "tags": [
            "Crawler - Papers"
          ]
        }
      },
      "/api/crawler/papers/{paperId}": {
        "delete": {
          "operationId": "PaperCrawlerController_deletePaper",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Delete a paper (crawler only)",
          "tags": [
            "Crawler - Papers"
          ]
        }
      },
      "/api/crawler/papers/{paperId}/relations": {
        "post": {
          "operationId": "PaperRelationController_createRelation",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateRelationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [],
          "summary": "Create paper relation (crawler/AI server only)",
          "tags": [
            "Paper Relations"
          ]
        }
      },
      "/api/papers/{paperId}/related": {
        "get": {
          "operationId": "PaperRelationController_getRelatedPapers",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Get all related papers",
          "tags": [
            "Paper Relations"
          ]
        }
      },
      "/api/papers/{paperId}/similar": {
        "get": {
          "operationId": "PaperRelationController_getSimilarPapers",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Get similar papers",
          "tags": [
            "Paper Relations"
          ]
        }
      },
      "/api/papers/{paperId}/opposing": {
        "get": {
          "operationId": "PaperRelationController_getOpposingPapers",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Get opposing papers",
          "tags": [
            "Paper Relations"
          ]
        }
      },
      "/api/papers/{paperId}/reactions": {
        "post": {
          "operationId": "ReactionController_toggleReaction",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ToggleReactionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Toggle reaction on a paper (LIKE/UNLIKE)",
          "tags": [
            "Reactions"
          ]
        },
        "get": {
          "operationId": "ReactionController_getPaperReactions",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Get paper reaction statistics",
          "tags": [
            "Reactions"
          ]
        }
      },
      "/api/users/me/reactions": {
        "get": {
          "operationId": "ReactionController_getUserReactions",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Items per page",
              "schema": {
                "default": 20,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get my reactions",
          "tags": [
            "Reactions"
          ]
        }
      },
      "/api/papers/{paperId}/discussions": {
        "post": {
          "operationId": "DiscussionController_createDiscussion",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateDiscussionDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Create a new discussion for a paper",
          "tags": [
            "Discussions"
          ]
        },
        "get": {
          "operationId": "DiscussionController_listDiscussions",
          "parameters": [
            {
              "name": "paperId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Items per page",
              "schema": {
                "default": 20,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Get discussions for a paper",
          "tags": [
            "Discussions"
          ]
        }
      },
      "/api/discussions/{discussionId}": {
        "get": {
          "operationId": "DiscussionController_getDiscussion",
          "parameters": [
            {
              "name": "discussionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "summary": "Get discussion detail",
          "tags": [
            "Discussions"
          ]
        }
      },
      "/api/discussions/{discussionId}/messages": {
        "post": {
          "operationId": "DiscussionController_createMessage",
          "parameters": [
            {
              "name": "discussionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateMessageDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Create a message in a discussion",
          "tags": [
            "Discussions"
          ]
        },
        "get": {
          "operationId": "DiscussionController_listMessages",
          "parameters": [
            {
              "name": "discussionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Items per page",
              "schema": {
                "default": 20,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Success",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get messages in a discussion",
          "tags": [
            "Discussions"
          ]
        }
      },
      "/api/discussions/{discussionId}/messages/{messageId}": {
        "patch": {
          "operationId": "DiscussionController_updateMessage",
          "parameters": [
            {
              "name": "messageId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateMessageDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Update a message (owner only)",
          "tags": [
            "Discussions"
          ]
        },
        "delete": {
          "operationId": "DiscussionController_deleteMessage",
          "parameters": [
            {
              "name": "messageId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Delete a message (owner only)",
          "tags": [
            "Discussions"
          ]
        }
      },
      "/api/discussions/{discussionId}/messages/{messageId}/like": {
        "post": {
          "operationId": "DiscussionController_toggleMessageLike",
          "parameters": [
            {
              "name": "messageId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Toggle like on a message",
          "tags": [
            "Discussions"
          ]
        }
      },
      "/api/chat/sessions": {
        "post": {
          "operationId": "ChatController_createSession",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateSessionDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Create a new chat session",
          "tags": [
            "Chat"
          ]
        },
        "get": {
          "operationId": "ChatController_getUserSessions",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get my chat sessions",
          "tags": [
            "Chat"
          ]
        }
      },
      "/api/chat/sessions/{sessionId}": {
        "get": {
          "operationId": "ChatController_getSession",
          "parameters": [
            {
              "name": "sessionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get chat session detail",
          "tags": [
            "Chat"
          ]
        }
      },
      "/api/chat/sessions/{sessionId}/messages": {
        "post": {
          "operationId": "ChatController_sendMessage",
          "parameters": [
            {
              "name": "sessionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SendMessageDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Send a message in a chat session",
          "tags": [
            "Chat"
          ]
        },
        "get": {
          "operationId": "ChatController_getMessages",
          "parameters": [
            {
              "name": "sessionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Items per page",
              "schema": {
                "default": 50,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get messages in a chat session",
          "tags": [
            "Chat"
          ]
        }
      },
      "/api/notifications": {
        "get": {
          "operationId": "NotificationController_listNotifications",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "description": "Page number",
              "schema": {
                "default": 1,
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "description": "Items per page",
              "schema": {
                "default": 20,
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get my notifications",
          "tags": [
            "Notifications"
          ]
        }
      },
      "/api/notifications/unread-count": {
        "get": {
          "operationId": "NotificationController_countUnread",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get count of unread notifications",
          "tags": [
            "Notifications"
          ]
        }
      },
      "/api/notifications/{notificationId}/read": {
        "patch": {
          "operationId": "NotificationController_markAsRead",
          "parameters": [
            {
              "name": "notificationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Mark notification as read",
          "tags": [
            "Notifications"
          ]
        }
      },
      "/api/notifications/read-all": {
        "patch": {
          "operationId": "NotificationController_markAllAsRead",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Mark all notifications as read",
          "tags": [
            "Notifications"
          ]
        }
      },
      "/api/subscriptions": {
        "post": {
          "operationId": "SubscriptionController_subscribe",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/SubscribeDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Subscribe to a category/tag/journal/author",
          "tags": [
            "Subscriptions"
          ]
        },
        "get": {
          "operationId": "SubscriptionController_listSubscriptions",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get my subscriptions",
          "tags": [
            "Subscriptions"
          ]
        }
      },
      "/api/subscriptions/{subscriptionId}": {
        "delete": {
          "operationId": "SubscriptionController_unsubscribe",
          "parameters": [
            {
              "name": "subscriptionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Unsubscribe",
          "tags": [
            "Subscriptions"
          ]
        }
      },
      "/api/subscriptions/{subscriptionId}/toggle": {
        "patch": {
          "operationId": "SubscriptionController_toggleSubscription",
          "parameters": [
            {
              "name": "subscriptionId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Toggle subscription active status",
          "tags": [
            "Subscriptions"
          ]
        }
      },
      "/api/preferences": {
        "get": {
          "operationId": "PreferenceController_getPreference",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get my preferences",
          "tags": [
            "Preferences"
          ]
        },
        "patch": {
          "operationId": "PreferenceController_updatePreference",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePreferenceDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Update my preferences",
          "tags": [
            "Preferences"
          ]
        }
      },
      "/api/ai-data/activities": {
        "get": {
          "operationId": "AnalyticsController_getActivities",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "startDate",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "endDate",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get user activities data (AI server only)",
          "tags": [
            "AI Data"
          ]
        }
      },
      "/api/ai-data/reactions": {
        "get": {
          "operationId": "AnalyticsController_getReactions",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "startDate",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "endDate",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get reactions data (AI server only)",
          "tags": [
            "AI Data"
          ]
        }
      },
      "/api/ai-data/relations": {
        "get": {
          "operationId": "AnalyticsController_getRelations",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "startDate",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "endDate",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get paper relations data (AI server only)",
          "tags": [
            "AI Data"
          ]
        }
      },
      "/api/ai-data/views": {
        "get": {
          "operationId": "AnalyticsController_getViews",
          "parameters": [
            {
              "name": "page",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "limit",
              "required": false,
              "in": "query",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "startDate",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "endDate",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get paper views data (AI server only)",
          "tags": [
            "AI Data"
          ]
        }
      },
      "/api/ai-data/users/{userId}/profile": {
        "get": {
          "operationId": "AnalyticsController_getUserProfile",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get user profile and preferences (AI server only)",
          "tags": [
            "AI Data"
          ]
        }
      },
      "/api/health": {
        "get": {
          "operationId": "HealthController_check",
          "parameters": [],
          "responses": {
            "200": {
              "description": "The Health Check is successful",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            },
            "503": {
              "description": "The Health Check is not successful",
              "content": {
                "application/json": {
                  "schema": {
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
                }
              }
            }
          },
          "tags": [
            "Health"
          ],
          "security": []
        }
      }
    },
    "info": {
      "title": "API",
      "description": "API documentation",
      "version": "0.0.1",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http",
          "description": "Enter your JWT token",
          "name": "Authorization",
          "in": "header"
        }
      },
      "schemas": {
        "LoginResponseDto": {
          "type": "object",
          "properties": {
            "accessToken": {
              "type": "string",
              "description": "The access token of the user",
              "example": "accessToken"
            },
            "refreshToken": {
              "type": "string",
              "description": "The refresh token of the user",
              "example": "refreshToken"
            }
          },
          "required": [
            "accessToken",
            "refreshToken"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "user@example.com"
            },
            "password": {
              "type": "string",
              "example": "password123"
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "LogoutRequestDto": {
          "type": "object",
          "properties": {
            "refreshToken": {
              "type": "string",
              "description": "The refresh token of the user",
              "example": "refreshToken"
            }
          },
          "required": [
            "refreshToken"
          ]
        },
        "RefreshTokenRequestDto": {
          "type": "object",
          "properties": {
            "refreshToken": {
              "type": "string",
              "description": "The refresh token of the user",
              "example": "refreshToken"
            }
          },
          "required": [
            "refreshToken"
          ]
        },
        "UserDetailResponseDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "The ID of the user",
              "example": "123e4567-e89b-12d3-a456-426614174000"
            },
            "email": {
              "type": "string",
              "description": "The email of the user",
              "example": "test@example.com"
            },
            "name": {
              "type": "string",
              "description": "The name of the user",
              "example": "John Doe"
            },
            "status": {
              "type": "string",
              "description": "The status of the user",
              "example": "ACTIVE",
              "enum": [
                "ACTIVE",
                "INACTIVE",
                "SUSPENDED"
              ]
            },
            "profileImageUrl": {
              "type": "string",
              "description": "The profile image URL of the user",
              "example": "https://example.com/avatars/123.jpg"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string",
              "description": "The created at of the user",
              "example": "2021-01-01T00:00:00.000Z"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string",
              "description": "The updated at of the user",
              "example": "2021-01-01T00:00:00.000Z"
            }
          },
          "required": [
            "id",
            "email",
            "name",
            "status",
            "createdAt",
            "updatedAt"
          ]
        },
        "MyReactionDto": {
          "type": "object",
          "properties": {
            "isLiked": {
              "type": "boolean",
              "description": "Has user liked this paper"
            },
            "isUnliked": {
              "type": "boolean",
              "description": "Has user unliked this paper"
            }
          },
          "required": [
            "isLiked",
            "isUnliked"
          ]
        },
        "PaperDetailDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
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
            "url": {
              "type": "string"
            },
            "pdfUrl": {
              "type": "string"
            },
            "issuedAt": {
              "format": "date-time",
              "type": "string"
            },
            "likeCount": {
              "type": "number"
            },
            "unlikeCount": {
              "type": "number"
            },
            "totalViewCount": {
              "type": "number"
            },
            "thumbnailId": {
              "type": "string"
            },
            "pdfId": {
              "type": "string"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            },
            "myReaction": {
              "$ref": "#/components/schemas/MyReactionDto"
            }
          },
          "required": [
            "id",
            "paperId",
            "title",
            "categories",
            "authors",
            "summary",
            "content",
            "doi",
            "likeCount",
            "unlikeCount",
            "totalViewCount",
            "pdfId",
            "createdAt",
            "updatedAt"
          ]
        },
        "PaperListDto": {
          "type": "object",
          "properties": {
            "papers": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/PaperDetailDto"
              }
            },
            "total": {
              "type": "number"
            },
            "page": {
              "type": "number"
            },
            "limit": {
              "type": "number"
            },
            "totalPages": {
              "type": "number"
            }
          },
          "required": [
            "papers",
            "total",
            "page",
            "limit",
            "totalPages"
          ]
        },
        "CategoryDto": {
          "type": "object",
          "properties": {
            "category": {
              "type": "string",
              "description": "Category name"
            },
            "count": {
              "type": "number",
              "description": "Number of papers in this category"
            }
          },
          "required": [
            "category",
            "count"
          ]
        },
        "CreateRelationDto": {
          "type": "object",
          "properties": {
            "relatedPaperId": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "SIMILAR",
                "OPPOSING",
                "EXTENSION",
                "CITATION",
                "RELATED_TOPIC"
              ]
            },
            "similarityScore": {
              "type": "number"
            },
            "description": {
              "type": "string"
            }
          },
          "required": [
            "relatedPaperId",
            "type"
          ]
        },
        "ToggleReactionDto": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "LIKE",
                "UNLIKE"
              ],
              "description": "Reaction type"
            }
          },
          "required": [
            "type"
          ]
        },
        "ReactionStatsDto": {
          "type": "object",
          "properties": {
            "likeCount": {
              "type": "number",
              "description": "Number of likes"
            },
            "unlikeCount": {
              "type": "number",
              "description": "Number of unlikes"
            }
          },
          "required": [
            "likeCount",
            "unlikeCount"
          ]
        },
        "ReactionDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            },
            "paperId": {
              "type": "string"
            },
            "type": {
              "type": "string",
              "enum": [
                "LIKE",
                "UNLIKE"
              ]
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "id",
            "userId",
            "paperId",
            "type",
            "createdAt"
          ]
        },
        "UserReactionsDto": {
          "type": "object",
          "properties": {
            "reactions": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/ReactionDto"
              }
            },
            "total": {
              "type": "number"
            }
          },
          "required": [
            "reactions",
            "total"
          ]
        },
        "DiscussionDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "paperId": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "creatorId": {
              "type": "string"
            },
            "participantCount": {
              "type": "number"
            },
            "messageCount": {
              "type": "number"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "id",
            "paperId",
            "title",
            "content",
            "creatorId",
            "participantCount",
            "messageCount",
            "createdAt",
            "updatedAt"
          ]
        },
        "CreateDiscussionDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string",
              "description": "Discussion title"
            },
            "content": {
              "type": "string",
              "description": "Discussion content"
            }
          },
          "required": [
            "title",
            "content"
          ]
        },
        "PaginatedDiscussionsDto": {
          "type": "object",
          "properties": {
            "discussions": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/DiscussionDto"
              }
            },
            "total": {
              "type": "number"
            },
            "page": {
              "type": "number"
            },
            "limit": {
              "type": "number"
            }
          },
          "required": [
            "discussions",
            "total",
            "page",
            "limit"
          ]
        },
        "CreateMessageDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "Message content"
            }
          },
          "required": [
            "content"
          ]
        },
        "DiscussionMessageDto": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "discussionId": {
              "type": "string"
            },
            "userId": {
              "type": "string"
            },
            "content": {
              "type": "string"
            },
            "likeCount": {
              "type": "number"
            },
            "isEdited": {
              "type": "boolean"
            },
            "isLikedByMe": {
              "type": "boolean"
            },
            "createdAt": {
              "format": "date-time",
              "type": "string"
            },
            "updatedAt": {
              "format": "date-time",
              "type": "string"
            }
          },
          "required": [
            "id",
            "discussionId",
            "userId",
            "content",
            "likeCount",
            "isEdited",
            "createdAt",
            "updatedAt"
          ]
        },
        "PaginatedMessagesDto": {
          "type": "object",
          "properties": {
            "messages": {
              "type": "array",
              "items": {
                "$ref": "#/components/schemas/DiscussionMessageDto"
              }
            },
            "total": {
              "type": "number"
            },
            "page": {
              "type": "number"
            },
            "limit": {
              "type": "number"
            }
          },
          "required": [
            "messages",
            "total",
            "page",
            "limit"
          ]
        },
        "UpdateMessageDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "Updated message content"
            }
          },
          "required": [
            "content"
          ]
        },
        "CreateSessionDto": {
          "type": "object",
          "properties": {
            "paperId": {
              "type": "string",
              "description": "Paper ID (optional)"
            }
          }
        },
        "SendMessageDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string",
              "description": "Message content"
            }
          },
          "required": [
            "content"
          ]
        },
        "SubscribeDto": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "CATEGORY",
                "TAG",
                "JOURNAL",
                "AUTHOR"
              ]
            },
            "target": {
              "type": "string",
              "description": "Target to subscribe to"
            }
          },
          "required": [
            "type",
            "target"
          ]
        },
        "UpdatePreferenceDto": {
          "type": "object",
          "properties": {
            "interestedCategories": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "excludedCategories": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "minYear": {
              "type": "number"
            },
            "enableNotifications": {
              "type": "boolean"
            }
          }
        }
      }
    },
    "security": [
      {
        "bearer": []
      }
    ]
  },
  "customOptions": {
    "persistAuthorization": true,
    "displayRequestDuration": true,
    "docExpansion": "none",
    "filter": true,
    "showRequestHeaders": true
  }
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
