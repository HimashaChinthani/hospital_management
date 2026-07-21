package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToDepartmentDomain(req *dto.DepartmentRequest) *domain.Department {
	if req == nil {
		return nil
	}
	return &domain.Department{
		ID:             req.ID,
		DepartmentName: req.DepartmentName,
	}
}

func ToDepartmentDTO(d *domain.Department) *dto.DepartmentResponse {
	if d == nil {
		return nil
	}
	return &dto.DepartmentResponse{
		ID:             d.ID,
		DepartmentName: d.DepartmentName,
	}
}

func ToDepartmentDTOList(dList []domain.Department) []dto.DepartmentResponse {
	list := make([]dto.DepartmentResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToDepartmentDTO(&d)
	}
	return list
}
