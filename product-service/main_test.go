package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"strconv"
	"testing"

	"product_service/db"
	"product_service/model"

	"github.com/labstack/echo/v4"
)

type testProduct struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
}

func TestCreateProduct(t *testing.T) {
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_USER", "testuser")
	os.Setenv("DB_PASSWORD", "testpass")
	os.Setenv("DB_NAME", "testdb")

	// Initialize DB connection
	if err := db.Connect(); err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}

	e := echo.New()
	e.POST("/products", createProduct)

	product := testProduct{
		Name:        "Test Product",
		Description: "A product for testing",
		Price:       9.99,
		Stock:       10,
	}
	body, _ := json.Marshal(product)
	req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	w := httptest.NewRecorder()
	c := e.NewContext(req, w)

	if err := createProduct(c); err != nil {
		t.Fatalf("handler returned error: %v", err)
	}

	if w.Code != http.StatusCreated {
		t.Errorf("expected status %d, got %d", http.StatusCreated, w.Code)
	}

	var resp model.Product
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Errorf("failed to unmarshal response: %v", err)
	}
	if resp.Name != product.Name {
		t.Errorf("expected name %q, got %q", product.Name, resp.Name)
	}
}

func TestGetProduct(t *testing.T) {
	// Setup: create a product first
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_USER", "testuser")
	os.Setenv("DB_PASSWORD", "testpass")
	os.Setenv("DB_NAME", "testdb")
	if err := db.Connect(); err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	e := echo.New()
	e.GET("/products/:id", getProduct)

	// Insert a product directly
	p := model.Product{Name: "ReadTest", Description: "Read test", Price: 1.23, Stock: 5}
	if err := p.Insert(); err != nil {
		t.Fatalf("failed to insert product: %v", err)
	}

	req := httptest.NewRequest(http.MethodGet, "/products/"+strconv.FormatInt(p.ID, 10), nil)
	w := httptest.NewRecorder()
	c := e.NewContext(req, w)
	c.SetParamNames("id")
	c.SetParamValues(strconv.FormatInt(p.ID, 10))

	if err := getProduct(c); err != nil {
		t.Fatalf("handler returned error: %v", err)
	}
	if w.Code != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, w.Code)
	}
	var resp model.Product
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Errorf("failed to unmarshal response: %v", err)
	}
	if resp.ID != p.ID {
		t.Errorf("expected id %d, got %d", p.ID, resp.ID)
	}
}

func TestUpdateProduct(t *testing.T) {
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_USER", "testuser")
	os.Setenv("DB_PASSWORD", "testpass")
	os.Setenv("DB_NAME", "testdb")
	if err := db.Connect(); err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	e := echo.New()
	e.PUT("/products/:id", updateProduct)

	p := model.Product{Name: "UpdateTest", Description: "Update test", Price: 2.34, Stock: 7}
	if err := p.Insert(); err != nil {
		t.Fatalf("failed to insert product: %v", err)
	}

	update := testProduct{Name: "Updated", Description: "Updated desc", Price: 3.45, Stock: 8}
	body, _ := json.Marshal(update)
	req := httptest.NewRequest(http.MethodPut, "/products/"+strconv.FormatInt(p.ID, 10), bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	w := httptest.NewRecorder()
	c := e.NewContext(req, w)
	c.SetParamNames("id")
	c.SetParamValues(strconv.FormatInt(p.ID, 10))

	if err := updateProduct(c); err != nil {
		t.Fatalf("handler returned error: %v", err)
	}
	if w.Code != http.StatusOK {
		t.Errorf("expected status %d, got %d", http.StatusOK, w.Code)
	}
	var resp model.Product
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Errorf("failed to unmarshal response: %v", err)
	}
	if resp.Name != update.Name {
		t.Errorf("expected name %q, got %q", update.Name, resp.Name)
	}
}

func TestDeleteProduct(t *testing.T) {
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_USER", "testuser")
	os.Setenv("DB_PASSWORD", "testpass")
	os.Setenv("DB_NAME", "testdb")
	if err := db.Connect(); err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	e := echo.New()
	e.DELETE("/products/:id", deleteProduct)

	p := model.Product{Name: "DeleteTest", Description: "Delete test", Price: 4.56, Stock: 2}
	if err := p.Insert(); err != nil {
		t.Fatalf("failed to insert product: %v", err)
	}

	req := httptest.NewRequest(http.MethodDelete, "/products/"+strconv.FormatInt(p.ID, 10), nil)
	w := httptest.NewRecorder()
	c := e.NewContext(req, w)
	c.SetParamNames("id")
	c.SetParamValues(strconv.FormatInt(p.ID, 10))

	if err := deleteProduct(c); err != nil {
		t.Fatalf("handler returned error: %v", err)
	}
	if w.Code != http.StatusNoContent {
		t.Errorf("expected status %d, got %d", http.StatusNoContent, w.Code)
	}
}

func TestCreateProductValidation(t *testing.T) {
	os.Setenv("DB_HOST", "localhost")
	os.Setenv("DB_PORT", "5432")
	os.Setenv("DB_USER", "testuser")
	os.Setenv("DB_PASSWORD", "testpass")
	os.Setenv("DB_NAME", "testdb")
	if err := db.Connect(); err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	e := echo.New()
	e.POST("/products", createProduct)

	cases := []struct {
		name           string
		product        testProduct
		expectedStatus int
		expectedError  string
	}{
		{"missing name", testProduct{"", "desc", 1.0, 1}, http.StatusBadRequest, "name is required"},
		{"negative price", testProduct{"Name", "desc", -1.0, 1}, http.StatusBadRequest, "price must be non-negative"},
		{"negative stock", testProduct{"Name", "desc", 1.0, -1}, http.StatusBadRequest, "stock must be non-negative"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			body, _ := json.Marshal(tc.product)
			req := httptest.NewRequest(http.MethodPost, "/products", bytes.NewReader(body))
			req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
			w := httptest.NewRecorder()
			c := e.NewContext(req, w)

			_ = createProduct(c)

			if w.Code != tc.expectedStatus {
				t.Errorf("expected status %d, got %d", tc.expectedStatus, w.Code)
			}
			if tc.expectedError != "" && !bytes.Contains(w.Body.Bytes(), []byte(tc.expectedError)) {
				t.Errorf("expected error %q in response, got %q", tc.expectedError, w.Body.String())
			}
		})
	}
}
