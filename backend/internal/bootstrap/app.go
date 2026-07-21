package bootstrap

import (
	"fmt"

	"github.com/himashachinthani/backend/internal/adapter/storage/mysql"
	"github.com/himashachinthani/backend/internal/adapter/storage/mysql/repository"
	"github.com/himashachinthani/backend/internal/config"
	"github.com/himashachinthani/backend/internal/core/service"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

type AppContext struct {
	Config       config.AppConfig
	Logger       *zap.Logger
	DB           *gorm.DB
	Repositories *repository.Repositories
	Services     *service.Services
}

func InitializeApp() (*AppContext, error) {
	// 1. Load config
	cfg, err := config.Load()
	if err != nil {
		return nil, fmt.Errorf("load config: %w", err)
	}

	// 2. Init logger (same style as Initialize)
	logger, err := NewLogger(cfg.Environment)
	if err != nil {
		return nil, fmt.Errorf("logger: %w", err)
	}
	zap.ReplaceGlobals(logger)

	// 3. DB connection
	db, err := mysql.NewConnection(mysql.Config{
		Host:     cfg.Database.Host,
		Port:     cfg.Database.Port,
		User:     cfg.Database.User,
		Password: cfg.Database.Password,
		Database: cfg.Database.Name,
		SSLMode:  cfg.Database.SSLMode,
	})
	if err != nil {
		return nil, fmt.Errorf("db connection: %w", err)
	}

	// 4. Migrations (models only)
	if err := mysql.Migrate(db); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}

	logger.Info("Database connected and migrated (models only)")

	// 5. Initialize repositories
	repos := repository.NewRepositories(db)

	// 6. Initialize services
	services := service.NewServices(&service.Repositories{
		Appointment:      repos.Appointment,
		Bill:             repos.Bill,
		Department:       repos.Department,
		Doctor:           repos.Doctor,
		Medicine:         repos.Medicine,
		Patient:          repos.Patient,
		Payment:          repos.Payment,
		Prescription:     repos.Prescription,
		PrescriptionItem: repos.PrescriptionItem,
		Role:             repos.Role,
		User:             repos.User,
	})

	return &AppContext{
		Config:       cfg,
		Logger:       logger,
		DB:           db,
		Repositories: repos,
		Services:     services,
	}, nil
}

func NewLogger(env string) (*zap.Logger, error) {
	if env == "local" || env == "development" || env == "dev" {
		cfg := zap.NewDevelopmentConfig()
		return cfg.Build()
	}
	// default to production config
	cfg := zap.NewProductionConfig()
	// Example: set a sensible log level from config if needed
	return cfg.Build()
}
