package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type DepartmentRepository interface {
	Create(ctx context.Context, entity *domain.Department) error
	GetByID(ctx context.Context, id uint) (*domain.Department, error)
	List(ctx context.Context) ([]domain.Department, error)
	Update(ctx context.Context, entity *domain.Department) error
	Delete(ctx context.Context, id uint) error
}

type DepartmentService struct {
	repo DepartmentRepository
}

func NewDepartmentService(repo DepartmentRepository) *DepartmentService {
	return &DepartmentService{repo: repo}
}

func (s *DepartmentService) Create(ctx context.Context, entity *domain.Department) error {
	return s.repo.Create(ctx, entity)
}

func (s *DepartmentService) GetByID(ctx context.Context, id uint) (*domain.Department, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *DepartmentService) List(ctx context.Context) ([]domain.Department, error) {
	return s.repo.List(ctx)
}

func (s *DepartmentService) Update(ctx context.Context, entity *domain.Department) error {
	return s.repo.Update(ctx, entity)
}

func (s *DepartmentService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
