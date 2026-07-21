package main

import (
	"log"
	"time"

	"github.com/himashachinthani/backend/internal/adapter/storage/mysql"
	"github.com/himashachinthani/backend/internal/config"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	db, err := mysql.NewConnection(mysql.Config{
		Host:     cfg.Database.Host,
		Port:     cfg.Database.Port,
		User:     cfg.Database.User,
		Password: cfg.Database.Password,
		Database: cfg.Database.Name,
		SSLMode:  cfg.Database.SSLMode,
	})
	if err != nil {
		log.Fatal(err)
	}

	models := []interface{}{
		&domain.User{},
		&domain.Role{},
		&domain.Doctor{},
		&domain.Patient{},
		&domain.Appointment{},
		&domain.Medicine{},
		&domain.Bill{},
		&domain.Payment{},
		&domain.Department{},
		&domain.Prescription{},
		&domain.PrescriptionItem{},
	}

	log.Println("Dropping old broken tables to reset schema...")
	for _, m := range models {
		if err := db.Migrator().DropTable(m); err != nil {
			log.Printf("Warning dropping table: %v", err)
		}
	}

	log.Println("Migrating fresh tables with AUTO_INCREMENT...")
	if err := db.AutoMigrate(models...); err != nil {
		log.Fatal(err)
	}

	log.Println("Seeding roles...")
	roles := []domain.Role{
		{ID: 1, Name: "Admin"},
		{ID: 2, Name: "Patient"},
		{ID: 3, Name: "Doctor"},
		{ID: 4, Name: "Receptionist"},
		{ID: 5, Name: "Pharmacist"},
	}
	for _, r := range roles {
		db.Create(&r)
	}

	log.Println("Seeding dummy data...")

	// Seed Admin User
	admin := domain.User{
		FirstName: "System",
		LastName:  "Admin",
		Email:     "admin@medicore.com",
		Password:  "admin",
		RoleID:    1,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	db.Create(&admin)

	// Seed Doctor User & Doctor
	docUser := domain.User{
		FirstName: "Sarah",
		LastName:  "Smith",
		Email:     "drsmith@medicore.com",
		Password:  "password",
		RoleID:    3,
	}
	db.Create(&docUser)
	doctor := domain.Doctor{
		UserID:          docUser.ID,
		DepartmentID:    1,
		Specialization:  "Cardiology",
		ExperienceYears: 10,
	}
	db.Create(&doctor)

	// Seed Patient User & Patient
	patientUser := domain.User{
		FirstName: "John",
		LastName:  "Doe",
		Email:     "john@example.com",
		Password:  "password",
		Phone:     "+1 234 567 890",
		RoleID:    2,
	}
	db.Create(&patientUser)
	patient := domain.Patient{
		UserID:     patientUser.ID,
		DOB:        time.Now(),
		Gender:     "Male",
		BloodGroup: "O+",
		Address:    "123 Street",
	}
	db.Create(&patient)

	// Seed Medicine
	medicine := domain.Medicine{
		MedicineName: "Paracetamol",
		Description:  "Painkiller",
		UnitPrice:    5.99,
	}
	db.Create(&medicine)

	// Seed Department
	dept := domain.Department{
		DepartmentName: "Cardiology",
	}
	db.Create(&dept)

	log.Println("Migration and Seeding complete! 🎉")
}
