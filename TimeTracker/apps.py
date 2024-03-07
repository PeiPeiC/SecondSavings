from django.apps import AppConfig


class TimetrackerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "TimeTracker"

    def ready(self):
        import TimeTracker.signals
