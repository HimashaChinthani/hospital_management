package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type PatientRepository interface {
	Create(ctx context.Context, entity *domain.Patient) error
	GetByID(ctx context.Context, id uint) (*domain.Patient, error)
	List(ctx context.Context) ([]domain.Patient, error)
	Update(ctx context.Context, entity *domain.Patient) error
	Delete(ctx context.Context, id uint) error
}

type PatientService struct {
	repo PatientRepository
}

func NewPatientService(repo PatientRepository) *PatientService {
	return &PatientService{repo: repo}
}

func (s *PatientService) Create(ctx context.Context, entity *domain.Patient) error {
	return s.repo.Create(ctx, entity)
}

func (s *PatientService) GetByID(ctx context.Context, id uint) (*domain.Patient, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PatientService) List(ctx context.Context) ([]domain.Patient, error) {
	return s.repo.List(ctx)
}

func (s *PatientService) Update(ctx context.Context, entity *domain.Patient) error {
	return s.repo.Update(ctx, entity)
}

func (s *PatientService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
