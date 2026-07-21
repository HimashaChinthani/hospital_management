package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type PrescriptionRepository interface {
	Create(ctx context.Context, entity *domain.Prescription) error
	GetByID(ctx context.Context, id uint) (*domain.Prescription, error)
	List(ctx context.Context) ([]domain.Prescription, error)
	Update(ctx context.Context, entity *domain.Prescription) error
	Delete(ctx context.Context, id uint) error
}

type PrescriptionService struct {
	repo PrescriptionRepository
}

func NewPrescriptionService(repo PrescriptionRepository) *PrescriptionService {
	return &PrescriptionService{repo: repo}
}

func (s *PrescriptionService) Create(ctx context.Context, entity *domain.Prescription) error {
	return s.repo.Create(ctx, entity)
}

func (s *PrescriptionService) GetByID(ctx context.Context, id uint) (*domain.Prescription, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PrescriptionService) List(ctx context.Context) ([]domain.Prescription, error) {
	return s.repo.List(ctx)
}

func (s *PrescriptionService) Update(ctx context.Context, entity *domain.Prescription) error {
	return s.repo.Update(ctx, entity)
}

func (s *PrescriptionService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
