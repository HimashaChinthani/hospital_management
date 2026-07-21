package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToAppointmentDomain(req *dto.AppointmentRequest) *domain.Appointment {
	if req == nil {
		return nil
	}
	return &domain.Appointment{
		ID:              req.ID,
		PatientID:       req.PatientID,
		DoctorID:        req.DoctorID,
		AppointmentDate: req.AppointmentDate,
		AppointmentTime: req.AppointmentTime,
		Status:          req.Status,
	}
}

func ToAppointmentDTO(d *domain.Appointment) *dto.AppointmentResponse {
	if d == nil {
		return nil
	}
	return &dto.AppointmentResponse{
		ID:              d.ID,
		PatientID:       d.PatientID,
		DoctorID:        d.DoctorID,
		AppointmentDate: d.AppointmentDate,
		AppointmentTime: d.AppointmentTime,
		Status:          d.Status,
	}
}

func ToAppointmentDTOList(dList []domain.Appointment) []dto.AppointmentResponse {
	list := make([]dto.AppointmentResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToAppointmentDTO(&d)
	}
	return list
}
