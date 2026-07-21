package main

import (
	"log"

	"github.com/himashachinthani/backend/internal/adapter/http"
	"github.com/himashachinthani/backend/internal/bootstrap"
)

func main() {
	app, err := bootstrap.InitializeApp()
	if err != nil {
		log.Fatal("Failed to initialize app:", err)
	}

	// Close DB properly (guard against nil stub DB)
	defer func() {
		if app == nil || app.DB == nil {
			return
		}
		// Protect against panics from uninitialized/stubbed gorm.DB
		defer func() {
			_ = recover()
		}()
		sqlDB, _ := app.DB.DB()
		if sqlDB != nil {
			_ = sqlDB.Close()
		}
	}()

	router := http.NewRouter(app.Services)

	log.Println("Starting server on :8081...")
	if err := router.Run(":8081"); err != nil {
		log.Fatal("Server failed:", err)
	}
}
