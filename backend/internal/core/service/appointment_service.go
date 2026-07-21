package service

import (
	"context"

	"github.com/himashachinthani/backend/internal/core/domain"
)

type AppointmentRepository interface {
	Create(ctx context.Context, entity *domain.Appointment) error
	GetByID(ctx context.Context, id uint) (*domain.Appointment, error)
	List(ctx context.Context) ([]domain.Appointment, error)
	Update(ctx context.Context, entity *domain.Appointment) error
	Delete(ctx context.Context, id uint) error
}

type AppointmentService struct {
	repo AppointmentRepository
}

func NewAppointmentService(repo AppointmentRepository) *AppointmentService {
	return &AppointmentService{repo: repo}
}

func (s *AppointmentService) Create(ctx context.Context, entity *domain.Appointment) error {
	return s.repo.Create(ctx, entity)
}

func (s *AppointmentService) GetByID(ctx context.Context, id uint) (*domain.Appointment, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *AppointmentService) List(ctx context.Context) ([]domain.Appointment, error) {
	return s.repo.List(ctx)
}

func (s *AppointmentService) Update(ctx context.Context, entity *domain.Appointment) error {
	return s.repo.Update(ctx, entity)
}

func (s *AppointmentService) Delete(ctx context.Context, id uint) error {
	return s.repo.Delete(ctx, id)
}
