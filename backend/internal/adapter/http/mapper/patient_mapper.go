package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToPatientDomain(req *dto.PatientRequest) *domain.Patient {
	if req == nil {
		return nil
	}
	return &domain.Patient{
		ID:         req.ID,
		UserID:     req.UserID,
		DOB:        req.DOB,
		Gender:     req.Gender,
		BloodGroup: req.BloodGroup,
		Address:    req.Address,
	}
}

func ToPatientDTO(d *domain.Patient) *dto.PatientResponse {
	if d == nil {
		return nil
	}
	return &dto.PatientResponse{
		ID:         d.ID,
		UserID:     d.UserID,
		DOB:        d.DOB,
		Gender:     d.Gender,
		BloodGroup: d.BloodGroup,
		Address:    d.Address,
	}
}

func ToPatientDTOList(dList []domain.Patient) []dto.PatientResponse {
	list := make([]dto.PatientResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToPatientDTO(&d)
	}
	return list
}
