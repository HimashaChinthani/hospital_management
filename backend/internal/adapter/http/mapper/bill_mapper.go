package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToBillDomain(req *dto.BillRequest) *domain.Bill {
	if req == nil {
		return nil
	}
	return &domain.Bill{
		ID:            req.ID,
		AppointmentID: req.AppointmentID,
		Amount:        req.Amount,
		PaymentStatus: req.PaymentStatus,
		CreatedAt:     req.CreatedAt,
		BillsCol:      req.BillsCol,
	}
}

func ToBillDTO(d *domain.Bill) *dto.BillResponse {
	if d == nil {
		return nil
	}
	return &dto.BillResponse{
		ID:            d.ID,
		AppointmentID: d.AppointmentID,
		Amount:        d.Amount,
		PaymentStatus: d.PaymentStatus,
		CreatedAt:     d.CreatedAt,
		BillsCol:      d.BillsCol,
	}
}

func ToBillDTOList(dList []domain.Bill) []dto.BillResponse {
	list := make([]dto.BillResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToBillDTO(&d)
	}
	return list
}
