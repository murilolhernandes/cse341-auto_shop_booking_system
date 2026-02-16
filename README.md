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

#### Please run the following command in your terminal, so we all can work with the same libraries (please remember to always run this command to install new libraries added by other contributors, after you pull):

```
npm i
```

## **Useful commands to run**

### Run Unit Tests

#### This project uses Jest and Supertest for API testing.

#### Run all tests:

```
npm test
```

#### Run tests in watch mode:

```
npm run test:watch
```

#### Run ESLint

```
npm run lint
```

#### Run Prettierr

```
npm run format
```