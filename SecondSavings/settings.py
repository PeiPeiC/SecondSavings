"""
Django settings for SecondSavings project.

Generated by 'django-admin startproject' using Django 4.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
import os
import secrets
import environ
from pathlib import Path
import dj_database_url
BASE_DIR = Path(__file__).resolve().parent.parent


# The `DYNO` env var is set on Heroku CI, but it's not a real Heroku app, so we have to
# also explicitly exclude CI:
# https://devcenter.heroku.com/articles/heroku-ci#immutable-environment-variables
IS_HEROKU_APP = "DYNO" in os.environ and not "CI" in os.environ

if not IS_HEROKU_APP:
    env_file = BASE_DIR / '.env'
    # Check if the .env file exists, and then read it
    if env_file.is_file():
        environ.Env.read_env(str(env_file))

env = environ.Env()
# 读取.env文件
environ.Env.read_env()

SECRET_KEY = env('DJANGO_SECRET_KEY')
# https://devcenter.heroku.com/articles/config-vars
# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = os.environ.get(
#     "DJANGO_SECRET_KEY",
#     default=secrets.token_urlsafe(nbytes=64),
# )

if IS_HEROKU_APP:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
else:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'http')
    SECURE_SSL_REDIRECT = False

TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
#STATIC_URL = '/static/'
STATIC_DIR = os.path.join(BASE_DIR, 'static')
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # for heroku
#STATIC_ROOT = BASE_DIR / "staticfiles"
STATIC_URL = "static/"

STATICFILES_DIRS = [
    STATIC_DIR,
    # 这里可以添加其他静态文件目录
]

MEDIA_DIR = os.path.join(BASE_DIR, 'media')
MEDIA_ROOT = MEDIA_DIR
MEDIA_URL = '/media/'
# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

#给DEBUG设置一个默认值
# DEBUG = False
# # SECURITY WARNING: don't run with debug turned on in production!
# if not IS_HEROKU_APP:
DEBUG = True

if IS_HEROKU_APP:
    ALLOWED_HOSTS = ['.herokuapp.com']
else:
    ALLOWED_HOSTS = ['fd2f-109-175-255-155.ngrok-free.app', '127.0.0.1', 'localhost','second-savings-45733b1b5b8c.herokuapp.com']

# Application definition
SITE_ID = 1

INSTALLED_APPS = [
    # Use WhiteNoise's runserver implementation instead of the Django default, for dev-prod parity.
    "whitenoise.runserver_nostatic",
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    'django.contrib.sites',

    'imagekit',
    "TimeTracker",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # Django doesn't support serving static assets in a production-ready way, so we use the
    # excellent WhiteNoise package to do so instead. The WhiteNoise middleware must be listed
    # after Django's `SecurityMiddleware` so that security redirects are still performed.
    # See: https://whitenoise.readthedocs.io
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "SecondSavings.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [TEMPLATE_DIR],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "SecondSavings.wsgi.application"

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

if IS_HEROKU_APP:
    # In production on Heroku the database configuration is derived from the `DATABASE_URL`
    # environment variable by the dj-database-url package. `DATABASE_URL` will be set
    # automatically by Heroku when a database addon is attached to your Heroku app. See:
    # https://devcenter.heroku.com/articles/provisioning-heroku-postgres
    # https://github.com/jazzband/dj-database-url
    DATABASES = {
        "default": dj_database_url.config(
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=True,
        ),
    }
else:
    # When running locally in development or in CI, a sqlite database file will be used instead
    # to simplify initial setup. Longer term it's recommended to use Postgres locally too.
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        'OPTIONS': {'min_length': 8, }
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/



if IS_HEROKU_APP:
    STORAGES = {
        "default": {
            "BACKEND": "django.core.files.storage.FileSystemStorage",
            "LOCATION": "media",
        },
        # Enable WhiteNoise's GZip and Brotli compression of static assets:
        # https://whitenoise.readthedocs.io/en/latest/django.html#add-compression-and-caching-support
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }

# Don't store the original (un-hashed filename) version of static files, to reduce slug size:
# https://whitenoise.readthedocs.io/en/latest/django.html#WHITENOISE_KEEP_ONLY_HASHED_FILES
WHITENOISE_KEEP_ONLY_HASHED_FILES = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

PASSWORD_HASHERS = (
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
)

ACCOUNT_AUTHENTICATION_METHOD = "email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_UNIQUE_EMAIL = True

LOGIN_REDIRECT_URL = '/secondSavings/login_main/'
ACCOUNT_LOGOUT_REDIRECT_URL = '/accounts/login'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True
EMAIL_FROM = 'secondsavings2024@gmail.com'

DEFAULT_FROM_EMAIL = 'secondsavings2024@gmail.com'


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        },
    },
}
