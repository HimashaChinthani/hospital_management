package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type MedicineRepository interface {
	Create(ctx context.Context, entity *domain.Medicine) error
	GetByID(ctx context.Context, id uint) (*domain.Medicine, error)
	List(ctx context.Context) ([]domain.Medicine, error)
	Update(ctx context.Context, entity *domain.Medicine) error
	Delete(ctx context.Context, id uint) error
}

type MedicineService struct {
	repo MedicineRepository
}

func NewMedicineService(repo MedicineRepository) *MedicineService {
	return &MedicineService{repo: repo}
}

func (s *MedicineService) Create(ctx context.Context, entity *domain.Medicine) error {
	return s.repo.Create(ctx, entity)
}

func (s *MedicineService) GetByID(ctx context.Context, id uint) (*domain.Medicine, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *MedicineService) List(ctx context.Context) ([]domain.Medicine, error) {
	return s.repo.List(ctx)
}

func (s *MedicineService) Update(ctx context.Context, entity *domain.Medicine) error {
	return s.repo.Update(ctx, entity)
}

func (s *MedicineService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
