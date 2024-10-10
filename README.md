# RentX

RentX is a .NET 6 web application designed to manage rental services for power tools. This project uses various modern technologies and tools to ensure a robust and scalable solution.

## Technologies Used

### Backend

- **.NET 6**: The latest version of the .NET framework for building high-performance applications.
- **Entity Framework Core**: An ORM for .NET to work with databases using .NET objects.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Azure Key Vault**: A cloud service for securely storing and accessing secrets.
- **Azure Blob Storage**: A cloud blob storage service for store files/images etc. .
- **Swagger**: For API documentation and testing.
- **AutoMapper**: For object-object mapping.
- **Google OAuth**: For Google authentication.

### Frontend

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom user interfaces.
- **Axios**: A promise-based HTTP client for making API requests.
- **Redux**: A open-source JavaScript library for managing and centralizing application state.
- **NextUI**: A modern react UI component ibrary

### Deployment
- Application was successfully tested and deployed on Azure VM
- **Docker**: A platform for developing, shipping, and running applications in containers.
  
## Setup Instructions

### Prerequisites

- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Node.js](https://nodejs.org/en/download/) (for frontend development)

### Configuration

1. **Clone the repository**:
   ```sh
   git clone https://github.com/yourusername/RentItNow.git
   cd RentItNow

2. **Set up the database**:
   Ensure PostgreSQL is installed and running. Create a database named `rentx`.

3. **Configure Azure Key Vault**:
   - Create an Azure Key Vault and store your secrets (e.g., `JWT-KEY`, `Issuer`, `DefaultConnection`, `GoogleClientId`, `GoogleClientSecret`, `KeyVaultUri`).
   - Update the `appsettings.Production.json` file with placeholders for these secrets.

4. **Local Development Setup**:
   - Update `appsettings.json` with your local PostgreSQL connection string:
      "ConnectionStrings": {
   "DefaultConnection": "Host=localhost;Database={db_name};Username={your username};Password={your password};Port=5432;SslMode=Disable;"
 }

5. **Frontend Setup**

  - Navigate to the frontend directory
  - Install dependencies:
  ```
npm install
  ```
  - Create a .env file:
  ```
  touch .env
  ```
  - Add the following variable in the .env file
  ```
  NEXT_PUBLIC_BACKEND_URL=https://localhost:port/api
  NEXT_PUBLIC_BACKEND_CHAT_URL=https://localhost:port/chat
  NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING= blob_connection_string
  NEXT_PUBLIC_AZURE_STORAGE_CONTAINER_NAME= blob_container_name
  ```
  - Configure Azure Key Blob Storage: After configuration update the blob storage connection string in the above created .env file.
      
6. **Run the application locally**:
- Run the frontend application:
  ```
   npm run dev
  ```
- Run the backend:
  
  ```
  dotnet run
  ```  

### Usage

- **Swagger UI**: Navigate the swagger endpoint to access the API documentation and test endpoints.

