# Railway Reservation API
## Checkout Deployed Link
```
https://reservation-api-962i.onrender.com/
```
## Run Locally

Clone the project

```bash
  git clone git@github.com:arsharmaa/frejun-assessment.git
```

Go to the project directory

```bash
  cd frejun-assessment
```

Install dependencies

```bash
  npm install
```
Set up the database
```bash
  npx sequelize-cli db:migrate
```

Start the server

```bash
  node app.js
```
The API will be accessible at http://localhost:3000.

## Running with Docker
#### Build the Docker Image
```sh
docker build -t railway-reservation-api .
```
#### Run the Docker Container
```sh
docker build -t railway-reservation-api .
```
#### Verify the API
Ensure the API is running and accessible at http://localhost:3000

Access Swagger UI at http://localhost:3000/api-docs

# API Reference

## Book a ticket

```http
  POST /api/v1/tickets/book
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` | **Required**. Name of the passenger |
| `age` | `integer` | **Required**. Age of the passenger |
| `gender` | `string` | **Required**. Gender of the passenger |
| `isLadyWithChild` | `boolean` | **Optional**. Indicates if the passenger is a lady traveling with a child |

#### Example Request
```sh
{
  "name": "John Doe",
  "age": 30,
  "gender": "M",
  "isLadyWithChild": false
}

```
#### Example Response 
```sh
{
  "message": "Ticket booked successfully",
  "ticket": {
    "id": 1,
    "status": "Confirmed",
    "passengerId": 1,
    "berthType": "Lower",
    "seatNumber": 1,
    "createdAt": "2025-01-24T09:11:22.000Z",
    "updatedAt": "2025-01-24T09:11:22.000Z"
  }
}
```

## Cancel Ticket

```http
  POST /api/v1/tickets/cancel/{ticketId}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `ticketId`      | `integer` | **Required**. Id of ticket to cancel |

#### Example Response
```
{
  "message": "Ticket canceled successfully"
}
```

## Get Booked Tickets

```
GET /api/v1/tickets/booked
```
#### Example Response
```
[
  {
    "id": 1,
    "status": "Confirmed",
    "passengerId": 1,
    "berthType": "Lower",
    "seatNumber": 1,
    "createdAt": "2025-01-24T09:11:22.000Z",
    "updatedAt": "2025-01-24T09:11:22.000Z"
  }
]
```
## Get Available Tickets
```
GET /api/v1/tickets/available
```
#### Example Response
```
{
  "confirmedBerthsCount": 63,
  "racCount": 9,
  "waitingCount": 10
}
```
## Get Tickets Count
```
GET /api/v1/tickets/counts
```
#### Example Response
```
{
  "confirmedCount": 63,
  "racCount": 9,
  "waitingCount": 10
}
```

## Concurrency Handling
The application uses transactions and row-level locking to ensure that two users cannot book the same ticket/berth simultaneously.
## Dockerization
The project is containerized using Docker. The Dockerfile is included for easy setup and deployment.
## Implementation Constraints
Languages: JavaScript (Node.js) or Python
Database: Relational Database (PostgreSQL, MySQL, SQLite)
## Conclusion
This README provides all the necessary details to set up, run, and test the Railway Reservation API. For further details, refer to the additional documentation included in the repository.
