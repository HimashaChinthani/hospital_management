package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToRoleDomain(req *dto.RoleRequest) *domain.Role {
	if req == nil {
		return nil
	}
	return &domain.Role{
		ID:   req.ID,
		Name: req.Name,
	}
}

func ToRoleDTO(d *domain.Role) *dto.RoleResponse {
	if d == nil {
		return nil
	}
	return &dto.RoleResponse{
		ID:   d.ID,
		Name: d.Name,
	}
}

func ToRoleDTOList(dList []domain.Role) []dto.RoleResponse {
	list := make([]dto.RoleResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToRoleDTO(&d)
	}
	return list
}
