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
docker run -p 3000:3000 railway-reservation-api
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

## Logic Cases Handled:
#### Booking a Confirmed Ticket:

#### Scenario: Booking a ticket when there are available confirmed berths.

#### Logic: Allocate an available confirmed berth to the passenger.

## Booking a RAC Ticket:

#### Scenario: Booking a ticket when all confirmed berths are occupied but RAC berths are available.

#### Logic: Allocate an available RAC berth to the passenger.

## Booking a Waiting List Ticket:

#### Scenario: Booking a ticket when all confirmed berths and RAC berths are occupied.

#### Logic: Add the passenger to the waiting list.

## Booking for a Child Under 5 Years Old:

#### Scenario: Booking a ticket for a child under 5 years old.

#### Logic: Only passenger details are stored, no berth allocation.

## Cancellation of a Confirmed Ticket:

#### Scenario: Cancelling a confirmed ticket.

#### Logic: Free up the confirmed berth, promote the first RAC ticket to a confirmed berth, and promote the first waiting list ticket to RAC.

## Cancellation of a RAC Ticket:

#### Scenario: Cancelling a RAC ticket.

#### Logic: Free up the RAC slot, promote the first waiting list ticket to RAC.

## Promotion from RAC to Confirmed:

#### Scenario: Promoting a RAC ticket to confirmed when a confirmed berth becomes available.

#### Logic: Allocate the freed confirmed berth to the first RAC ticket.

## Promotion from Waiting List to RAC:

#### Scenario: Promoting a waiting list ticket to RAC when a RAC berth becomes available.

#### Logic: Allocate the freed RAC berth to the first waiting list ticket.

## Handling Elderly and Lady with Child:

#### Scenario: Booking a ticket for an elderly passenger or a lady with a child.

#### Logic: Prioritize allocation of a lower berth for elderly passengers and ladies with children.

## Concurrency Handling:

#### Scenario: Ensuring two users cannot book the same ticket/berth at the same time.

#### Logic: Use transactions and row-level locking to handle concurrent booking and cancellations.

## Summary of Scenarios:
#### Confirmed Berth Available: Allocate confirmed berth to the passenger.

#### No Confirmed Berth, RAC Available: Allocate RAC berth to the passenger.

#### No Confirmed or RAC Berth, Waiting List Available: Add passenger to the waiting list.

#### Child Under 5 Years Old: Store passenger details without berth allocation.

#### Cancellation of Confirmed Ticket: Promote RAC to confirmed, waiting list to RAC.

#### Cancellation of RAC Ticket: Promote waiting list to RAC.

#### Promotion of RAC to Confirmed: Allocate freed confirmed berth to RAC.

#### Promotion of Waiting List to RAC: Allocate freed RAC berth to waiting list.

#### Elderly and Lady with Child Priority: Allocate lower berth if available.
