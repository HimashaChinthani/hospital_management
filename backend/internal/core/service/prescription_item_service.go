package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type PrescriptionItemRepository interface {
	Create(ctx context.Context, entity *domain.PrescriptionItem) error
	GetByID(ctx context.Context, id uint) (*domain.PrescriptionItem, error)
	List(ctx context.Context) ([]domain.PrescriptionItem, error)
	Update(ctx context.Context, entity *domain.PrescriptionItem) error
	Delete(ctx context.Context, id uint) error
}

type PrescriptionItemService struct {
	repo PrescriptionItemRepository
}

func NewPrescriptionItemService(repo PrescriptionItemRepository) *PrescriptionItemService {
	return &PrescriptionItemService{repo: repo}
}

func (s *PrescriptionItemService) Create(ctx context.Context, entity *domain.PrescriptionItem) error {
	return s.repo.Create(ctx, entity)
}

func (s *PrescriptionItemService) GetByID(ctx context.Context, id uint) (*domain.PrescriptionItem, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PrescriptionItemService) List(ctx context.Context) ([]domain.PrescriptionItem, error) {
	return s.repo.List(ctx)
}

func (s *PrescriptionItemService) Update(ctx context.Context, entity *domain.PrescriptionItem) error {
	return s.repo.Update(ctx, entity)
}

func (s *PrescriptionItemService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
