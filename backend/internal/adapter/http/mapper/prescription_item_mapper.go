package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToPrescriptionItemDomain(req *dto.PrescriptionItemRequest) *domain.PrescriptionItem {
	if req == nil {
		return nil
	}
	return &domain.PrescriptionItem{
		ID:             req.ID,
		PrescriptionID: req.PrescriptionID,
		MedicineID:     req.MedicineID,
		Dosage:         req.Dosage,
		Duration:       req.Duration,
	}
}

func ToPrescriptionItemDTO(d *domain.PrescriptionItem) *dto.PrescriptionItemResponse {
	if d == nil {
		return nil
	}
	return &dto.PrescriptionItemResponse{
		ID:             d.ID,
		PrescriptionID: d.PrescriptionID,
		MedicineID:     d.MedicineID,
		Dosage:         d.Dosage,
		Duration:       d.Duration,
	}
}

func ToPrescriptionItemDTOList(dList []domain.PrescriptionItem) []dto.PrescriptionItemResponse {
	list := make([]dto.PrescriptionItemResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToPrescriptionItemDTO(&d)
	}
	return list
}
