# **CSE 341 - Team Project: Auto Shop Booking System**

#### In this project we will creating an API using Swagger.js.

Our API will allow users to manage car service’s appointments by setting an appointment for the auto shop using the client’s information, car’s information, and build an appointment collection joining the client, car, and date of the appointment.

## **Collaborators**

### **.ENV**

#### Please add a dotenv file and add the following lines:

```
PORT=3000
MONGODB_URL="we will add the MondoDB URL link later"
GOOGLE_CLIENT_ID="we will add the Google Client ID later"
GOOGLE_CLIENT_SECRET="we will add the Google Client Secret later"
CALLBACK_URL="we will add the Callback URL link later"
CALLBACK_URL_DEV="http://localhost:3000/google/callback" (Only to be used during development)
```

### **Dependencies**

#### Please run the following commands in your terminal, so we all can work with the same libraries (Please remember to add more commands here if you install something else in your computer, and make a note showing what is new):

```
npm i
```

#### **-- New ones below this comment and inside the triple backticks--**

```
npm i connect-mongo - (Improves the memory by storing the user's loggin state to the database)
```



### Run Unit Tests

### This project uses Jest and Supertest for API testing.

### Run all tests:

npm test

### Run tests in watch mode:

npm run test:watch