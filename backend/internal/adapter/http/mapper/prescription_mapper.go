package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToPrescriptionDomain(req *dto.PrescriptionRequest) *domain.Prescription {
	if req == nil {
		return nil
	}
	return &domain.Prescription{
		ID:            req.ID,
		AppointmentID: req.AppointmentID,
		DoctorNotes:   req.DoctorNotes,
		CreatedAt:     req.CreatedAt,
	}
}

func ToPrescriptionDTO(d *domain.Prescription) *dto.PrescriptionResponse {
	if d == nil {
		return nil
	}
	return &dto.PrescriptionResponse{
		ID:            d.ID,
		AppointmentID: d.AppointmentID,
		DoctorNotes:   d.DoctorNotes,
		CreatedAt:     d.CreatedAt,
	}
}

func ToPrescriptionDTOList(dList []domain.Prescription) []dto.PrescriptionResponse {
	list := make([]dto.PrescriptionResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToPrescriptionDTO(&d)
	}
	return list
}
