package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToDoctorDomain(req *dto.DoctorRequest) *domain.Doctor {
	if req == nil {
		return nil
	}
	return &domain.Doctor{
		ID:              req.ID,
		UserID:          req.UserID,
		DepartmentID:    req.DepartmentID,
		Specialization:  req.Specialization,
		ExperienceYears: req.ExperienceYears,
	}
}

func ToDoctorDTO(d *domain.Doctor) *dto.DoctorResponse {
	if d == nil {
		return nil
	}
	return &dto.DoctorResponse{
		ID:              d.ID,
		UserID:          d.UserID,
		DepartmentID:    d.DepartmentID,
		Specialization:  d.Specialization,
		ExperienceYears: d.ExperienceYears,
	}
}

func ToDoctorDTOList(dList []domain.Doctor) []dto.DoctorResponse {
	list := make([]dto.DoctorResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToDoctorDTO(&d)
	}
	return list
}
