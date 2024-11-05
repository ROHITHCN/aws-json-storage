# JSON Storage Web Service

This project is a basic web service that allows users to store and retrieve JSON data using AWS S3 and API Gateway. It includes two endpoints:

- **POST /json-data**: Accepts JSON data and stores it in S3.
- **GET /json-data**: Retrieves all stored JSON data from S3.

## Setup and Configuration

1. Set up an S3 bucket for JSON storage.
2. Configure API Gateway with POST and GET methods linked to the respective Lambda functions.
3. Ensure the necessary IAM roles and permissions are set up for accessing S3 from Lambda.

## Thought Process

The project is designed to simplify JSON storage and retrieval with minimal overhead. Key design choices:
- **Unique File Keys**: Ensures that each JSON object is stored with a unique identifier in S3.
- **Error Handling**: Handles errors related to JSON parsing and S3 access.
- **Efficient Retrieval**: Compiles all JSON data in a single response for easy access.

## Testing

To test, use tools like Postman or `curl` to send requests to the API endpoints.

## Links

- [Post](https://crkrwb90j9.execute-api.eu-north-1.amazonaws.com/dev/store)
- [Get](https://crkrwb90j9.execute-api.eu-north-1.amazonaws.com/dev/retrive)
