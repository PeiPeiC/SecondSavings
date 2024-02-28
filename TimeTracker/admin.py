from django.contrib import admin

from TimeTracker.models import Group, UserProfile
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
# Register your models here.

#Group page function test
class GroupAdmin(admin.ModelAdmin):
    filter_horizontal = ('members',)  


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super().get_inline_instances(request, obj)

admin.site.register(Group, GroupAdmin)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)