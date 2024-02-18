# SecondSavings
a Time Tracking web app 

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PeiPeiC/SecondSavings.git
   ```

2. Navigate to the project directory:

   ```bash
   cd SecondSavings
   ```

3. Install the Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Go to the `SecondSavings` directory and create a `.env` file in the same folder as `settings.py`. Add the following line to the `.env` file:

   ```dotenv
   SECRET_KEY=<your-secret-key>
   ```

   Replace `<your-secret-key>` with a securely generated secret key for your Django application. You can use online tools or Django's `django.core.management.utils.get_random_secret_key()` method to generate a new key. Make sure to keep this key confidential and never share it publicly.


## Run the Application

Run the following command to start the Django development server:

```bash
python manage.py runserver
```