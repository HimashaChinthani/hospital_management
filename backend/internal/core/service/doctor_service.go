package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type DoctorRepository interface {
	Create(ctx context.Context, entity *domain.Doctor) error
	GetByID(ctx context.Context, id uint) (*domain.Doctor, error)
	List(ctx context.Context) ([]domain.Doctor, error)
	Update(ctx context.Context, entity *domain.Doctor) error
	Delete(ctx context.Context, id uint) error
}

type DoctorService struct {
	repo DoctorRepository
}

func NewDoctorService(repo DoctorRepository) *DoctorService {
	return &DoctorService{repo: repo}
}

func (s *DoctorService) Create(ctx context.Context, entity *domain.Doctor) error {
	return s.repo.Create(ctx, entity)
}

func (s *DoctorService) GetByID(ctx context.Context, id uint) (*domain.Doctor, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *DoctorService) List(ctx context.Context) ([]domain.Doctor, error) {
	return s.repo.List(ctx)
}

func (s *DoctorService) Update(ctx context.Context, entity *domain.Doctor) error {
	return s.repo.Update(ctx, entity)
}

func (s *DoctorService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
