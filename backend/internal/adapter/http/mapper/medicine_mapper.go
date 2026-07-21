package mapper

import (
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/core/domain"
)

func ToMedicineDomain(req *dto.MedicineRequest) *domain.Medicine {
	if req == nil {
		return nil
	}
	return &domain.Medicine{
		ID:            req.ID,
		MedicineName:  req.MedicineName,
		Description:   req.Description,
		UnitPrice:     req.UnitPrice,
		StockQuantity: req.StockQuantity,
	}
}

func ToMedicineDTO(d *domain.Medicine) *dto.MedicineResponse {
	if d == nil {
		return nil
	}
	return &dto.MedicineResponse{
		ID:            d.ID,
		MedicineName:  d.MedicineName,
		Description:   d.Description,
		UnitPrice:     d.UnitPrice,
		StockQuantity: d.StockQuantity,
	}
}

func ToMedicineDTOList(dList []domain.Medicine) []dto.MedicineResponse {
	list := make([]dto.MedicineResponse, len(dList))
	for i, d := range dList {
		list[i] = *ToMedicineDTO(&d)
	}
	return list
}
