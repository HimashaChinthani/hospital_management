# Stage 1: Build the Go application
FROM golang:1.25-alpine AS builder

# Set necessary environment variables for Go build
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

# Set the working directory inside the container
WORKDIR /build

# Copy the go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies
RUN go mod download

# Copy the rest of the application source code
COPY . .

# Build the Go application
RUN go build -ldflags="-s -w" -o /build/hospital-server ./cmd/server/main.go

# Stage 2: Create a lightweight image for production
FROM alpine:latest

# Install CA certificates
RUN apk --no-cache add ca-certificates tzdata

# Set the working directory
WORKDIR /app

# Copy the compiled binary from the builder stage
COPY --from=builder /build/hospital-server .

# Expose the port your Gin server runs on
EXPOSE 8080

# Run the executable
CMD ["./hospital-server"]
