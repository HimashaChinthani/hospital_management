package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type BillRepository interface {
	Create(ctx context.Context, entity *domain.Bill) error
	GetByID(ctx context.Context, id uint) (*domain.Bill, error)
	List(ctx context.Context) ([]domain.Bill, error)
	Update(ctx context.Context, entity *domain.Bill) error
	Delete(ctx context.Context, id uint) error
}

type BillService struct {
	repo BillRepository
}

func NewBillService(repo BillRepository) *BillService {
	return &BillService{repo: repo}
}

func (s *BillService) Create(ctx context.Context, entity *domain.Bill) error {
	return s.repo.Create(ctx, entity)
}

func (s *BillService) GetByID(ctx context.Context, id uint) (*domain.Bill, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *BillService) List(ctx context.Context) ([]domain.Bill, error) {
	return s.repo.List(ctx)
}

func (s *BillService) Update(ctx context.Context, entity *domain.Bill) error {
	return s.repo.Update(ctx, entity)
}

func (s *BillService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
