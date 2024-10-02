# Syntax Sage

## Overview

The **Synatx Sage** is a web-based application designed to assist users in generating code snippets and solutions for various programming tasks, particularly for competitive programming. By harnessing the power of **Large Language Models (LLMs)**, this project offers a seamless user experience in obtaining code outputs based on user-defined prompts. The application is built using **React.js** for the frontend interface and **Flask** for the backend processing, ensuring a robust and responsive platform.

### Key Technologies

- **Frontend**: React.js
- **Backend**: Flask
- **LLMs Used**: Starcoder model and Yi-Coder-9B (available on Hugging Face)
- **Deployment**: Optional Docker support

---

## Features

- **Intuitive Code Generation**: Users can input prompts to generate relevant code snippets in various programming languages.
- **User-Friendly Interface**: The frontend is designed for easy navigation and interaction, making it accessible for both beginners and experienced programmers.
- **Cost-Effective**: The application uses free models from Hugging Face, eliminating the need for expensive model subscriptions.
- **No Database Required**: The project operates without local database storage, simplifying deployment and reducing overhead.

---

## Prerequisites

### Hardware Requirements

- **Laptop Specifications**:
  - GPU: RTX 4060
  - Processor: Intel i7 13th Generation
  - RAM: 16 GB

### Software Requirements

- **Python**: Version 3.8 or higher
- **Node.js**: Version 14.17.0 or higher
- **Hugging Face Account**: A valid account to access models, along with an associated API token.
- **Docker**: (Optional) For containerization of the application.

---

## Installation and Setup

### Step 1: Clone the Repository

Begin by cloning the project repository to your local machine:

```bash
git clone https://github.com/your-repo/llm-code-generator.git
cd llm-code-generator
```

### Step 2: Backend Setup (Flask)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file to store your Hugging Face token:
   ```bash
   echo "HF_TOKEN=your_huggingface_token" > .env
   ```

4. Start the Flask server:
   ```bash
   python app.py
   ```

### Step 3: Frontend Setup (React.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

### Step 4: Access the Application

Once both the backend and frontend are running, open your browser and navigate to `http://localhost:3000` to access the application.

---

## Usage Instructions

1. **Input a Prompt**: In the provided input field, describe the code you want to generate (e.g., "Write a Python function to reverse a string").
2. **Generate Code**: Click the "Generate Code" button to submit your prompt.
3. **View Output**: The application will process your request and display the generated code snippet in the output area.

---

## Project Structure

Here's a brief overview of the project's file structure:

```bash
llm-code-generator/
├── backend/
│   ├── app.py                 # Main Flask application handling requests
│   ├── requirements.txt       # List of Python dependencies
│   └── .env                   # Configuration file for environment variables
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── components/        # Reusable React components
│   │   └── styles/            # CSS styles for the application
│   ├── public/                # Public assets (e.g., index.html)
│   ├── package.json           # Frontend dependencies and scripts
├── README.md                  # Project documentation
└── Dockerfile                 # Optional Dockerfile for containerization
```

---

## Running the Application with Docker

To run the application using Docker for easier deployment, follow these steps:

1. **Build the Docker Image**:
   ```bash
   docker build -t llm-code-generator .
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -p 5000:5000 -p 3000:3000 llm-code-generator
   ```

3. **Access the Application**: Open your browser and navigate to `http://localhost:3000`.

---

## Future Enhancements

The project aims to evolve with potential features, including:

- **Model Fine-Tuning**: Allow users to fine-tune models on specific datasets for improved results.
- **Expanded Language Support**: Increase support for additional programming languages and frameworks.
- **User Authentication**: Implement user authentication to enhance security and user tracking.

---

## Contributions

Contributions are highly encouraged! If you have suggestions, bug reports, or feature requests, please feel free to submit a pull request or open an issue in the repository.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---
