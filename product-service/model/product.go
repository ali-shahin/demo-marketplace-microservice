package model

import (
	"errors"
	"product_service/db"
	"strconv"
	"time"
)

type Product struct {
	ID          int64     `json:"id" db:"id"`
	Name        string    `json:"name" db:"name"`
	Description string    `json:"description" db:"description"`
	Price       float64   `json:"price" db:"price"`
	Stock       int       `json:"stock" db:"stock"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

func (p *Product) Insert() error {
	now := time.Now()
	p.CreatedAt = now
	p.UpdatedAt = now
	query := `INSERT INTO products (name, description, price, stock, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`
	return db.DB.QueryRow(query, p.Name, p.Description, p.Price, p.Stock, p.CreatedAt, p.UpdatedAt).Scan(&p.ID)
}

func (p *Product) FindByID(idStr string) error {
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return err
	}
	query := `SELECT id, name, description, price, stock, created_at, updated_at FROM products WHERE id = $1`
	row := db.DB.QueryRow(query, id)
	return row.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.Stock, &p.CreatedAt, &p.UpdatedAt)
}

func (p *Product) Update(idStr string) error {
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return err
	}
	p.UpdatedAt = time.Now()
	query := `UPDATE products SET name=$1, description=$2, price=$3, stock=$4, updated_at=$5 WHERE id=$6`
	_, err = db.DB.Exec(query, p.Name, p.Description, p.Price, p.Stock, p.UpdatedAt, id)
	return err
}

func (p *Product) Delete(idStr string) error {
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		return err
	}
	query := `DELETE FROM products WHERE id = $1`
	_, err = db.DB.Exec(query, id)
	return err
}

func (p *Product) Validate() error {
	if p.Name == "" {
		return errors.New("name is required")
	}
	if p.Price < 0 {
		return errors.New("price must be non-negative")
	}
	if p.Stock < 0 {
		return errors.New("stock must be non-negative")
	}
	return nil
}

func ListAll() ([]Product, error) {
	rows, err := db.DB.Query(`SELECT id, name, description, price, stock, created_at, updated_at FROM products`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []Product
	for rows.Next() {
		var p Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.Price, &p.Stock, &p.CreatedAt, &p.UpdatedAt); err != nil {
			return nil, err
		}
		products = append(products, p)
	}
	return products, nil
}
