# Next.js Interview Project

This is a [Next.js](https://nextjs.org) project designed for interview candidates to demonstrate their troubleshooting and Docker skills.

## Project Overview

This application allows users to:
1. Upload images to the server
2. Retrieve and display a preview of the uploaded images

The project intentionally contains an issue that candidates need to identify and fix.

Feel free to modify any files in the project to resolve the issue. But the core functionality should behave as expected.

The final solution should ensure that image upload and preview work correctly both in development and when running the application in a Docker container.

## Getting Started

### Local Development

First, clone the repository and install dependencies:

```bash
git clone <repository-url>
cd interview-project
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### The Challenge

When running the application in development mode (`npm run dev`), everything works correctly. However, when running the application using Docker:

```bash
docker-compose up
```

You'll notice that image uploads works but the preview fails. Your task is to:

1. Identify why image upload and preview work in development but fail in Docker
2. Provide a fix to ensure both functionalities work in Docker
3. Document your solution

## Technical Details

### Project Structure

- `app/page.tsx`: Main application page image upload forms
- `app/api/upload-image/route.ts`: API endpoint for uploading images
- `Dockerfile`: Configuration for building the Docker image
- `docker-compose.yml`: Configuration for running the application with Docker Compose

### Expected Behavior

- Image upload and preview should work in both development and Docker environments
- Uploaded files should persist even if the Docker container is restarted

## Solution Criteria

Your solution will be evaluated based on:

1. Correctly identifying the root cause of the issue
2. Implementing an effective fix
3. Clearly explaining your troubleshooting process and solution

## Restrictions

You must not seek direct help from others or use pre-existing solutions.
You are allowed to use any external resources, documentation, internet searches, etc.
You are allowed to use AI tools or any AI-generated content as part of your research, but you must ensure that the final solution is your own work.

## Submission

Fork this repository, implement your solution, and provide a link to your forked repository.

Please document your solution in a separate file named `SOLUTION.md`, including:

1. The issue you identified
2. The changes you made to fix it
3. Any additional improvements you would recommend
4. Commands used to test your solution

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

Good luck!