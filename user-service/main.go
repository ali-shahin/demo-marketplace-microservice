package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"

	"user_service/db"
)

func main() {
	if err := db.InitDB(); err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}
	e := echo.New()
	e.POST("/register", registerHandler)
	e.POST("/login", loginHandler)
	e.Logger.Fatal(e.Start(":8080"))
}

// Registration request payload
type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func registerHandler(c echo.Context) error {
	var req RegisterRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}
	if req.Email == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "email and password required"})
	}
	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to hash password"})
	}
	// Insert user into DB
	_, err = db.Pool.Exec(context.Background(),
		"INSERT INTO users (email, password_hash, created_at, updated_at) VALUES ($1, $2, NOW(), NOW())",
		req.Email, string(hash),
	)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to create user"})
	}
	return c.JSON(http.StatusCreated, map[string]string{"message": "user registered"})
}

// Login request payload
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Login response payload
type LoginResponse struct {
	Token string `json:"token"`
}

func loginHandler(c echo.Context) error {
	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "invalid request"})
	}
	if req.Email == "" || req.Password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "email and password required"})
	}
	// Fetch user from DB
	var id int64
	var passwordHash string
	err := db.Pool.QueryRow(context.Background(),
		"SELECT id, password_hash FROM users WHERE email = $1",
		req.Email,
	).Scan(&id, &passwordHash)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid credentials"})
	}
	// Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password)); err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "invalid credentials"})
	}
	// Generate JWT
	token, err := generateJWT(id, req.Email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to generate token"})
	}
	return c.JSON(http.StatusOK, LoginResponse{Token: token})
}

func generateJWT(userID int64, email string) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"email":   email,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("JWT_SECRET")
	return t.SignedString([]byte(secret))
}
