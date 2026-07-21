package api

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/himashachinthani/backend/internal/adapter/http/common"
	"github.com/himashachinthani/backend/internal/adapter/http/dto"
	"github.com/himashachinthani/backend/internal/adapter/http/mapper"
	"github.com/himashachinthani/backend/internal/core/service"
)

func RegisterPrescriptionRoutes(r *gin.Engine, svc *service.PrescriptionService) {
	group := r.Group("/prescriptions")
	{
		group.POST("", func(c *gin.Context) {
			var req dto.PrescriptionRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, common.ErrorResponse(err.Error()))
				return
			}
			d := mapper.ToPrescriptionDomain(&req)
			if err := svc.Create(c.Request.Context(), d); err != nil {
				c.JSON(http.StatusInternalServerError, common.ErrorResponse(err.Error()))
				return
			}
			c.JSON(http.StatusCreated, common.Success(mapper.ToPrescriptionDTO(d)))
		})

		group.GET("/:id", func(c *gin.Context) {
			id, err := strconv.ParseUint(c.Param("id"), 10, 32)
			if err != nil {
				c.JSON(http.StatusBadRequest, common.ErrorResponse("invalid id"))
				return
			}
			res, err := svc.GetByID(c.Request.Context(), uint(id))
			if err != nil {
				c.JSON(http.StatusInternalServerError, common.ErrorResponse(err.Error()))
				return
			}
			if res == nil {
				c.JSON(http.StatusNotFound, common.ErrorResponse("not found"))
				return
			}
			c.JSON(http.StatusOK, common.Success(mapper.ToPrescriptionDTO(res)))
		})

		group.GET("", func(c *gin.Context) {
			res, err := svc.List(c.Request.Context())
			if err != nil {
				c.JSON(http.StatusInternalServerError, common.ErrorResponse(err.Error()))
				return
			}
			c.JSON(http.StatusOK, common.Success(mapper.ToPrescriptionDTOList(res)))
		})
		group.PUT("/:id", func(c *gin.Context) {
			var req dto.PrescriptionRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, common.ErrorResponse(err.Error()))
				return
			}
			id, err := strconv.ParseUint(c.Param("id"), 10, 32)
			if err == nil {
				req.ID = uint(id)
			}
			d := mapper.ToPrescriptionDomain(&req)
			if err := svc.Update(c.Request.Context(), d); err != nil {
				c.JSON(http.StatusInternalServerError, common.ErrorResponse(err.Error()))
				return
			}
			c.JSON(http.StatusOK, common.Success(mapper.ToPrescriptionDTO(d)))
		})

		group.DELETE("/:id", func(c *gin.Context) {
			id, err := strconv.ParseUint(c.Param("id"), 10, 32)
			if err != nil {
				c.JSON(http.StatusBadRequest, common.ErrorResponse("invalid id"))
				return
			}
			if err := svc.Delete(c.Request.Context(), uint(id)); err != nil {
				c.JSON(http.StatusInternalServerError, common.ErrorResponse(err.Error()))
				return
			}
			c.JSON(http.StatusOK, common.SuccessWithMessage("deleted", nil))
		})
	}
}
