package main

import (
	"log"
	"net/http"
	"os"

	"product_service/db"
	"product_service/model"

	"github.com/labstack/echo/v4"
)

func main() {
	if err := db.Connect(); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	e := echo.New()
	e.POST("/products", createProduct)
	e.GET("/products/:id", getProduct)
	e.PUT("/products/:id", updateProduct)
	e.DELETE("/products/:id", deleteProduct)
	e.GET("/products", listProducts) // New route for listing all products

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}
	e.Logger.Fatal(e.Start(":" + port))
}

func createProduct(c echo.Context) error {
	var p model.Product
	if err := c.Bind(&p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}
	if err := p.Validate(); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	if err := p.Insert(); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to create product"})
	}
	return c.JSON(http.StatusCreated, p)
}

func getProduct(c echo.Context) error {
	idParam := c.Param("id")
	var p model.Product
	if err := p.FindByID(idParam); err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
	}
	return c.JSON(http.StatusOK, p)
}

func updateProduct(c echo.Context) error {
	idParam := c.Param("id")
	var p model.Product
	if err := p.FindByID(idParam); err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "Product not found"})
	}
	if err := c.Bind(&p); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
	}
	if err := p.Validate(); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	if err := p.Update(idParam); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to update product"})
	}
	return c.JSON(http.StatusOK, p)
}

func deleteProduct(c echo.Context) error {
	idParam := c.Param("id")
	var p model.Product
	if err := p.Delete(idParam); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to delete product"})
	}
	return c.NoContent(http.StatusNoContent)
}

func listProducts(c echo.Context) error {
	products, err := model.ListAll()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to fetch products"})
	}
	return c.JSON(http.StatusOK, products)
}
