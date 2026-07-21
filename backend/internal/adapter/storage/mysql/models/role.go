package models

import (
	"github.com/himashachinthani/backend/internal/core/domain"
)

type Role struct {
	Base
	Name string `gorm:"column:role_name"`
}

func (Role) TableName() string { return "roles" }

func (r *Role) ToDomain() *domain.Role {
	if r == nil {
		return nil
	}
	return &domain.Role{
		ID:   r.ID,
		Name: r.Name,
	}
}
func RoleFromDomain(d *domain.Role) *Role {
	if d == nil {
		return nil
	}
	return &Role{

		Name: d.Name,
	}
}
