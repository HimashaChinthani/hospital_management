package mysql

import (
	"fmt"
	"time"

	"github.com/himashachinthani/backend/internal/adapter/storage/mysql/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Config struct {
	Host     string
	Port     int
	User     string
	Password string
	Database string
	SSLMode  string
}

func NewConnection(cfg Config) (*gorm.DB, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.User, cfg.Password, cfg.Host, cfg.Port, cfg.Database)
	
	var db *gorm.DB
	var err error

	// Retry loop: 60 attempts, 2 second delay (120s total)
	for i := 1; i <= 60; i++ {
		db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err == nil {
			break
		}
		fmt.Printf("Attempt %d/60: Failed to connect to mysql, retrying in 2 seconds...\n", i)
		time.Sleep(2 * time.Second)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to connect to mysql after retries: %w", err)
	}
	
	return db, nil
}

func Migrate(db *gorm.DB) error {
	return db.AutoMigrate(
		&models.Role{},
		&models.User{},
		&models.Department{},
		&models.Doctor{},
		&models.Patient{},
		&models.Appointment{},
		&models.Medicine{},
		&models.Prescription{},
		&models.PrescriptionItem{},
		&models.Bill{},
		&models.Payment{},
	)
}
