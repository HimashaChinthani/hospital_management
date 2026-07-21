package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type RoleRepository interface {
	Create(ctx context.Context, role *domain.Role) error
	GetByID(ctx context.Context, id uint) (*domain.Role, error)
	GetByName(ctx context.Context, name string) (*domain.Role, error)
	List(ctx context.Context) ([]domain.Role, error)
	Update(ctx context.Context, role *domain.Role) error
	Delete(ctx context.Context, id uint) error
}

type RoleService struct {
	repo RoleRepository
}

func NewRoleService(repo RoleRepository) *RoleService {
	return &RoleService{repo: repo}
}

func (s *RoleService) Create(ctx context.Context, role *domain.Role) error {
	return s.repo.Create(ctx, role)
}

func (s *RoleService) GetByID(ctx context.Context, id uint) (*domain.Role, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *RoleService) GetByName(ctx context.Context, name string) (*domain.Role, error) {
	return s.repo.GetByName(ctx, name)
}

func (s *RoleService) List(ctx context.Context) ([]domain.Role, error) {
	return s.repo.List(ctx)
}

func (s *RoleService) Update(ctx context.Context, role *domain.Role) error {
	return s.repo.Update(ctx, role)
}

func (s *RoleService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
