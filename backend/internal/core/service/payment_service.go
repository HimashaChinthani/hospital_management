package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type PaymentRepository interface {
	Create(ctx context.Context, entity *domain.Payment) error
	GetByID(ctx context.Context, id uint) (*domain.Payment, error)
	List(ctx context.Context) ([]domain.Payment, error)
	Update(ctx context.Context, entity *domain.Payment) error
	Delete(ctx context.Context, id uint) error
}

type PaymentService struct {
	repo PaymentRepository
}

func NewPaymentService(repo PaymentRepository) *PaymentService {
	return &PaymentService{repo: repo}
}

func (s *PaymentService) Create(ctx context.Context, entity *domain.Payment) error {
	return s.repo.Create(ctx, entity)
}

func (s *PaymentService) GetByID(ctx context.Context, id uint) (*domain.Payment, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *PaymentService) List(ctx context.Context) ([]domain.Payment, error) {
	return s.repo.List(ctx)
}

func (s *PaymentService) Update(ctx context.Context, entity *domain.Payment) error {
	return s.repo.Update(ctx, entity)
}

func (s *PaymentService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
