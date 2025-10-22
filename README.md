# pingMe

A modern web application for monitoring and pinging services with real-time notifications.

## 🚀 Features

- Real-time service monitoring
- Ping notifications
- Web-based dashboard
- Docker containerization
- RESTful API backend

## 📁 Project Structure

```
pingMe/
├── backend/          # Backend API service
├── frontend/         # Frontend web application
├── Makefile         # Build and deployment automation
└── README.md        # This file
```

## 🛠️ Quick Start

### Prerequisites

- Docker and Docker Compose
- Make (optional, for using Makefile commands)

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pingMe
   ```

2. **Start the services**
   ```bash
   make up
   # or
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Development

For development setup, see the individual README files in the `backend/` and `frontend/` directories.

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.