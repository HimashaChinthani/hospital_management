package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToUserDomain(req *dto.UserRequest) *domain.User {
	if req == nil {
		return nil
	}
	return &domain.User{
		ID:        req.ID,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Email:     req.Email,
		Password:  req.Password,
		Phone:     req.Phone,
		RoleID:    req.RoleID,
		CreatedAt: req.CreatedAt,
		UpdatedAt: req.UpdatedAt,
	}
}

func ToUserDTO(d *domain.User) *dto.UserResponse {
	if d == nil {
		return nil
	}
	return &dto.UserResponse{
		ID:        d.ID,
		FirstName: d.FirstName,
		LastName:  d.LastName,
		Email:     d.Email,
		Password:  d.Password,
		Phone:     d.Phone,
		RoleID:    d.RoleID,
		CreatedAt: d.CreatedAt,
		UpdatedAt: d.UpdatedAt,
	}
}

func ToUserDTOList(dList []domain.User) []dto.UserResponse {
	list := make([]dto.UserResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToUserDTO(&d)
	}
	return list
}
