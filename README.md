# SecondSavings: Time Tracker Web App

## About

SecondSavings is a comprehensive Time Tracking Web App designed to empower users in efficiently managing, analyzing, and optimizing their time utilization. Our platform facilitates the meticulous logging and categorizing daily activities, spanning work commitments, personal routines, study sessions, and more. With SecondSavings, users gain invaluable insights into their time allocation, supported by advanced functionalities such as report generation and time-to-money calculations, reinforcing the adage that "time is money" and fostering heightened awareness against time squandering. Additionally, our innovative study group feature fosters a sense of community, enabling users to collaborate and motivate each other toward achieving their goals.

## Youtube Video Demo
[![SecondSaving Youtube video](https://img.youtube.com/vi/9v88hEWe7WA/0.jpg)](https://www.youtube.com/watch?v=9v88hEWe7WA)

## Features

- **Activity Logging**: Seamlessly categorize daily activities into work, life, and study segments.
- **Categorization**: Utilize customizable categories for a comprehensive understanding of time distribution.
- **Report Generation**: Generate detailed reports on time usage to facilitate informed decision-making in time management.
- **Time-to-Money Calculations**: Ascertain the monetary value of time, underscoring the significance of efficient time utilization.
- **Google Task Integration**: Connect tasks to Google Task lists within the app's categories, streamlining task management for users who log in with their Google account.
- **Group Study**: Foster collaboration and motivation by creating or joining study groups, facilitating shared progress tracking within the community.

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



# Fixing ImportError in Django App Development

When developing a Django application, you might encounter the following error:
```
ImportError: cannot import name 'AppConf' from 'appconf' (D:\Work\SecondSavings\venv\Lib\site-packages\appconf\__init__.py)
```
This error typically occurs due to a conflict or an outdated package in your virtual environment. To resolve this issue, follow the steps below to delete your old virtual environment and set up a new one.

## Prerequisites

- Ensure you have Python and pip installed on your system.
- You should have virtualenv installed. If not, install it using pip:
  ```
  pip install virtualenv
  ```

## Steps to Fix ImportError

1. **Navigate to Your Project Directory**

   Open a terminal or command prompt and navigate to your Django project directory:
   ```
   cd path/to/your/django/project
   ```

2. **Delete the Old Virtual Environment**

   Before deleting your old virtual environment, ensure you deactivate it if it's currently active. To deactivate, simply run:
   ```
   deactivate
   ```
   Then, delete the virtual environment folder. On Windows, you can use:
   ```
   rmdir /s /q venv
   ```
   On macOS/Linux, use:
   ```
   rm -rf venv
   ```

3. **Create a New Virtual Environment**

   With the old environment removed, create a new virtual environment by running:
   ```
   virtualenv venv
   ```
   Replace `venv` with your preferred name for the virtual environment.

4. **Activate the New Virtual Environment**

   - On Windows:
     ```
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

5. **Reinstall Dependencies**

   Reinstall your project's dependencies including Django and any other packages you need. It's best to have a `requirements.txt` file; if you do, install using:
   ```
   pip install -r requirements.txt
   ```

6. **Verify the Fix**

   After setting up the new environment and reinstalling your dependencies, try running your Django application again. The ImportError should be resolved.


## Configuring Environment Variables

For enhanced security and to maintain the integrity of sensitive information, it is crucial to use an environment variables file, commonly named `.env`. This file will store confidential data such as secret keys and passwords, which should not be hard-coded into your Django project's settings or repositories, especially if they are public.

### Creating and Using the .env File

1. **Create a .env File**: In your project's root directory, create a file named `.env`. This file will not be tracked by version control if you include `.env` in your `.gitignore` file.

2. **Add Sensitive Data**: Open your `.env` file with a text editor and input your sensitive keys and credentials. Use the format `KEY=VALUE` without spaces around the equals sign. Based on the provided information, your `.env` file should include:

   ```
   DJANGO_SECRET_KEY=your_django_secret_key_here
   EMAIL_HOST_PASSWORD=your_email_host_password_here
   EMAIL_HOST_USER=your_email_host_user_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   REDIRECT_URI=http://127.0.0.1:8000/oauth2callback
   ```

   Replace the placeholder values (`your_*_here`) with your actual credentials.

3. **Integrating .env Variables into Your Django Project**: To use these environment variables within your Django project, you'll need a package like `django-environ` to parse the `.env` file. Install it using pip:

   ```
   pip install django-environ
   ```

   Then, in your `settings.py` file, import and initialize `environ`:

   ```python
   import environ

   env = environ.Env()
   # Reading .env file
   environ.Env.read_env()

   # Using the variables from .env
   SECRET_KEY = env('DJANGO_SECRET_KEY')
   EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
   EMAIL_HOST_USER = env('EMAIL_HOST_USER')
   GOOGLE_CLIENT_ID = env('GOOGLE_CLIENT_ID')
   GOOGLE_CLIENT_SECRET = env('GOOGLE_CLIENT_SECRET')
   REDIRECT_URI = env('REDIRECT_URI')
   ```

### Security Reminder

Never share your `.env` file or disclose its contents publicly. Ensure it is included in your `.gitignore` file to prevent accidental upload to version control systems.



