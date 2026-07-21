package repository

import "gorm.io/gorm"

// Repositories holds repository implementations. Stubbed for build.
type Repositories struct {
	Appointment      *AppointmentRepository
	Bill             *BillRepository
	Department       *DepartmentRepository
	Doctor           *DoctorRepository
	Medicine         *MedicineRepository
	Patient          *PatientRepository
	Payment          *PaymentRepository
	Prescription     *PrescriptionRepository
	PrescriptionItem *PrescriptionItemRepository
	Role             *RoleRepository
	User             *UserRepository
}

func NewRepositories(db *gorm.DB) *Repositories {
	return &Repositories{
		Appointment:      NewAppointmentRepository(db),
		Bill:             NewBillRepository(db),
		Department:       NewDepartmentRepository(db),
		Doctor:           NewDoctorRepository(db),
		Medicine:         NewMedicineRepository(db),
		Patient:          NewPatientRepository(db),
		Payment:          NewPaymentRepository(db),
		Prescription:     NewPrescriptionRepository(db),
		PrescriptionItem: NewPrescriptionItemRepository(db),
		Role:             NewRoleRepository(db),
		User:             NewUserRepository(db),
	}
}
