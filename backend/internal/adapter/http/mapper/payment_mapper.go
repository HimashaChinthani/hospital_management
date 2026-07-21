package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToPaymentDomain(req *dto.PaymentRequest) *domain.Payment {
	if req == nil {
		return nil
	}
	return &domain.Payment{
		ID:            req.ID,
		BillID:        req.BillID,
		PaymentMethod: req.PaymentMethod,
		PaymentDate:   req.PaymentDate,
		Amount:        req.Amount,
	}
}

func ToPaymentDTO(d *domain.Payment) *dto.PaymentResponse {
	if d == nil {
		return nil
	}
	return &dto.PaymentResponse{
		ID:            d.ID,
		BillID:        d.BillID,
		PaymentMethod: d.PaymentMethod,
		PaymentDate:   d.PaymentDate,
		Amount:        d.Amount,
	}
}

func ToPaymentDTOList(dList []domain.Payment) []dto.PaymentResponse {
	list := make([]dto.PaymentResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToPaymentDTO(&d)
	}
	return list
}
