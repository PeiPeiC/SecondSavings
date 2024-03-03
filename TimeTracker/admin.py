from django.contrib import admin

from TimeTracker.models import Group, UserProfile
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import Task, Record, UserProfile
# Register your models here.

#Group page function test
class GroupAdmin(admin.ModelAdmin):
    filter_horizontal = ('members',)  

#new
class TaskInline(admin.StackedInline):
    model = Task
    extra = 0  # 不显示额外的空白Task表单

#new
class RecordInline(admin.StackedInline):
    model = Record
    extra = 0  # 不显示额外的空白Record表单











class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    #new
    verbose_name_plural = 'UserProfile'


class CustomUserAdmin(UserAdmin):
    #TaskInline, RecordInline new
    inlines = (UserProfileInline, TaskInline, RecordInline)

    def get_inline_instances(self, request, obj=None):
        if not obj:
            return list()
        return super().get_inline_instances(request, obj)





class RecordInline(admin.TabularInline):
    model = Record
    extra = 0  # 设置为0意味着不会显示额外的空行

class TaskAdmin(admin.ModelAdmin):
    inlines = [
        RecordInline,
    ]
    list_display = ('title', 'user', 'startTime', 'endTime')  # 在这里添加你想显示的字段
    # 其他自定义设置...



admin.site.register(Group, GroupAdmin)


admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Task, TaskAdmin)