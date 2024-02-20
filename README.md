# SecondSavings: Time Tracker Web App

## About

SecondSavings is a comprehensive Time Tracking Web App designed to help users effectively track, analyze, and optimize their time usage. Our platform focuses on enabling individuals to log and categorize their daily activities, encompassing work, study, personal routines (such as eating and exercise), and more. With SecondSavings, users gain deeper insights into how they spend their time, supported by advanced features like report generation and time-to-money calculations, highlighting the principle that "time is money" and enhancing awareness against time wastage.

## Features

- **Activity Logging**: Users can log various daily activities, categorizing them into work, study, personal routines, etc.
- **Categorization**: Activities can be categorized for better analysis and understanding of time distribution.
- **Report Generation**: Generate detailed reports on time usage to help users make informed decisions about time management.
- **Time-to-Money Calculations**: Understand the monetary value of your time to emphasize the cost of time wastage.

## Development Setup

### Using a Virtual Environment

It's crucial to use a virtual environment for Python projects like this to keep dependencies required by different projects in separate places. To set up and activate a virtual environment for this project, follow these steps:

1. **Install `virtualenv` (Optional)**: If your Python environment doesn't include the `venv` module, or if you prefer to use `virtualenv` for creating virtual environments, you can install it globally using pip. This step is optional if you're already using Python 3.3 or above, which includes the `venv` module by default.

    To install `virtualenv`, run:

    ```bash
    pip install virtualenv
    ```

    After installing, you can create a virtual environment using `virtualenv` instead of `venv`.

2. **Create a Virtual Environment**:

    - If using **`venv`** (included with Python 3.3 and above):

        Navigate to your project's directory in the terminal, and run the following command to create a virtual environment named `venv`:

        ```bash
        python3 -m venv venv
        ```

    - If using **`virtualenv`**:

        After installing `virtualenv`, navigate to your project's directory and run:

        ```bash
        virtualenv venv
        ```

    Both commands create a new directory `venv` where the virtual environment files are stored.

3. **Activate the Virtual Environment**: Before you can start using the virtual environment, you need to activate it. Activation commands vary depending on your operating system:

    - **On macOS and Linux**, for both `venv` and `virtualenv`:

    ```bash
    source venv/bin/activate
    ```

    - **On Windows**, the activation command is slightly different between `venv` and `virtualenv`, but for most recent versions of `virtualenv`, you can also use:

    ```cmd
    .\venv\Scripts\activate
    ```

    Once activated, your terminal's prompt will change to show the name of the virtual environment (`venv`), indicating that it is currently active.

## Requirements

Before you begin installing project dependencies, it's essential to ensure your development environment is set up correctly. After activating your virtual environment, you can install the necessary packages listed in `requirements.txt`.

To install these dependencies, run:

```bash
pip install -r requirements.txt
```

This command reads the `requirements.txt` file and installs all listed packages along with their dependencies, ensuring your development environment matches the project's requirements.

### 🚨 Important for Developers

Before pushing any changes to the repository, especially after installing new packages or updating existing ones, it's crucial to update the `requirements.txt` file. This ensures that all collaborators can replicate the same environment and avoid issues related to package versions.

To update `requirements.txt`, use the following command to freeze the current state of your environment:

```bash
pip freeze > requirements.txt
```

This command generates a list of all installed packages in the active virtual environment and their exact versions, redirecting the output to `requirements.txt`. Make sure to commit this updated file to your repository.

📢 **Reminder for Collaborators**: Always run `pip install -r requirements.txt` after pulling changes from the repository to ensure your local environment matches the project's dependencies.


### Local Testing with Google Cloud API

For local testing, especially when integrating with Google Cloud API, use [ngrok](https://ngrok.com/) to expose your local server to a public URL.

```bash
ngrok http 8000
```

This will provide a URL that can be used to test interactions with Google Cloud APIs.

