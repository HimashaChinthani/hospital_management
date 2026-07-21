package common

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func Success(data interface{}) Response {
	return Response{Success: true, Data: data}
}

func SuccessWithMessage(message string, data interface{}) Response {
	return Response{Success: true, Message: message, Data: data}
}

func ErrorResponse(message string) Response {
	return Response{Success: false, Error: message}
}
