package service

type Services struct {
	Appointment      *AppointmentService
	Bill             *BillService
	Department       *DepartmentService
	Doctor           *DoctorService
	Medicine         *MedicineService
	Patient          *PatientService
	Payment          *PaymentService
	Prescription     *PrescriptionService
	PrescriptionItem *PrescriptionItemService
	Role             *RoleService
	User             *UserService
}

// Repositories structure holds all repository interfaces needed by the services.
type Repositories struct {
	Appointment      AppointmentRepository
	Bill             BillRepository
	Department       DepartmentRepository
	Doctor           DoctorRepository
	Medicine         MedicineRepository
	Patient          PatientRepository
	Payment          PaymentRepository
	Prescription     PrescriptionRepository
	PrescriptionItem PrescriptionItemRepository
	Role             RoleRepository
	User             UserRepository
}

func NewServices(repos *Repositories) *Services {
	return &Services{
		Appointment:      NewAppointmentService(repos.Appointment),
		Bill:             NewBillService(repos.Bill),
		Department:       NewDepartmentService(repos.Department),
		Doctor:           NewDoctorService(repos.Doctor),
		Medicine:         NewMedicineService(repos.Medicine),
		Patient:          NewPatientService(repos.Patient),
		Payment:          NewPaymentService(repos.Payment),
		Prescription:     NewPrescriptionService(repos.Prescription),
		PrescriptionItem: NewPrescriptionItemService(repos.PrescriptionItem),
		Role:             NewRoleService(repos.Role),
		User:             NewUserService(repos.User),
	}
}
