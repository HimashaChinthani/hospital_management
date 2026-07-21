package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type UserRepository interface {
	Create(ctx context.Context, user *domain.User) error
	GetByID(ctx context.Context, id uint) (*domain.User, error)
	GetByEmail(ctx context.Context, email string) (*domain.User, error)
	Update(ctx context.Context, user *domain.User) error
	Delete(ctx context.Context, id uint) error
}

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) Create(ctx context.Context, user *domain.User) error {
	return s.repo.Create(ctx, user)
}

func (s *UserService) GetByID(ctx context.Context, id uint) (*domain.User, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *UserService) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	return s.repo.GetByEmail(ctx, email)
}

func (s *UserService) Update(ctx context.Context, user *domain.User) error {
	return s.repo.Update(ctx, user)
}

func (s *UserService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
