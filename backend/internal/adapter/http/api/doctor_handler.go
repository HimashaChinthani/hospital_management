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

func RegisterDoctorRoutes(r *gin.Engine, svc *service.DoctorService) {
	group := r.Group("/doctors")
	{
		group.POST("", func(c *gin.Context) {
			var req dto.DoctorRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, common.ErrorResponse(err.Error()))
				return
			}
			d := mapper.ToDoctorDomain(&req)
			if err := svc.Create(c.Request.Context(), d); err != nil {
				c.JSON(http.StatusInternalServerError, common.ErrorResponse(err.Error()))
				return
			}
			c.JSON(http.StatusCreated, common.Success(mapper.ToDoctorDTO(d)))
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
			c.JSON(http.StatusOK, common.Success(mapper.ToDoctorDTO(res)))
		})

		group.GET("", func(c *gin.Context) {
			res, err := svc.List(c.Request.Context())
			if err != nil {
				c.JSON(http.StatusInternalServerError, common.ErrorResponse(err.Error()))
				return
			}
			c.JSON(http.StatusOK, common.Success(mapper.ToDoctorDTOList(res)))
		})
		group.PUT("/:id", func(c *gin.Context) {
			var req dto.DoctorRequest
			if err := c.ShouldBindJSON(&req); err != nil {
				c.JSON(http.StatusBadRequest, common.ErrorResponse(err.Error()))
				return
			}
			id, err := strconv.ParseUint(c.Param("id"), 10, 32)
			if err != nil {
				c.JSON(http.StatusBadRequest, common.ErrorResponse("invalid id"))
				return
			}
			
			existing, err := svc.GetByID(c.Request.Context(), uint(id))
			if err != nil || existing == nil {
				c.JSON(http.StatusNotFound, common.ErrorResponse("doctor not found"))
				return
			}
			
			existing.UserID = req.UserID
			existing.DepartmentID = req.DepartmentID
			existing.Specialization = req.Specialization
			existing.ExperienceYears = req.ExperienceYears
			
			if err := svc.Update(c.Request.Context(), existing); err != nil {
				c.JSON(http.StatusInternalServerError, common.ErrorResponse(err.Error()))
				return
			}
			c.JSON(http.StatusOK, common.Success(mapper.ToDoctorDTO(existing)))
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
