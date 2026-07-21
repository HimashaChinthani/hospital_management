package config

import (
	"os"
	"strconv"
)

// Minimal configuration structs and loader to allow the app to initialize.
// This reads environment variables or uses sensible defaults.

type DatabaseConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	Name     string
	SSLMode  string
}

type AppConfig struct {
	Database    DatabaseConfig
	Environment string
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if value, ok := os.LookupEnv(key); ok {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return fallback
}

func Load() (AppConfig, error) {
	return AppConfig{
		Database: DatabaseConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnvInt("DB_PORT", 3306),
			User:     getEnv("DB_USER", "root"),
			Password: getEnv("DB_PASSWORD", "root"),
			Name:     getEnv("DB_NAME", "hospital_management"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Environment: getEnv("APP_ENV", "local"),
	}, nil
}
