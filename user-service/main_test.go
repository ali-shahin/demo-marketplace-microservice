package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/labstack/echo/v4"
)

type registerResp struct {
	Message string `json:"message"`
	Error   string `json:"error"`
}

type loginResp struct {
	Token string `json:"token"`
	Error string `json:"error"`
}

func TestRegisterHandler_Validation(t *testing.T) {
	e := echo.New()
	req := httptest.NewRequest(http.MethodPost, "/register", strings.NewReader(`{"email":"","password":""}`))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	w := httptest.NewRecorder()
	c := e.NewContext(req, w)

	if err := registerHandler(c); err != nil {
		t.Fatalf("handler error: %v", err)
	}
	if w.Code != http.StatusBadRequest {
		t.Errorf("expected 400, got %d", w.Code)
	}
	var resp registerResp
	_ = json.Unmarshal(w.Body.Bytes(), &resp)
	if resp.Error == "" {
		t.Error("expected error message in response")
	}
}

// Add more tests for successful registration, login, and invalid login as needed.
