package http

import (
	"github.com/gin-gonic/gin"
	"github.com/himashachinthani/backend/internal/adapter/http/api"
	"github.com/himashachinthani/backend/internal/core/service"
)

func NewRouter(services *service.Services) *gin.Engine {
	r := gin.Default()

	api.RegisterUserRoutes(r, services.User)
	api.RegisterRoleRoutes(r, services.Role)
	api.RegisterPatientRoutes(r, services.Patient)
	api.RegisterDoctorRoutes(r, services.Doctor)
	api.RegisterAppointmentRoutes(r, services.Appointment)
	api.RegisterBillRoutes(r, services.Bill)
	api.RegisterDepartmentRoutes(r, services.Department)
	api.RegisterMedicineRoutes(r, services.Medicine)
	api.RegisterPaymentRoutes(r, services.Payment)
	api.RegisterPrescriptionRoutes(r, services.Prescription)
	api.RegisterPrescriptionItemRoutes(r, services.PrescriptionItem)

	return r
}
