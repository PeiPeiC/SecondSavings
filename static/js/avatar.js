// profile base 头像
document.addEventListener("DOMContentLoaded", function() {
    // 添加事件监听器到头像图标
    var avatarIcon = document.querySelector(".user-icon .bi-person-circle");
    if (avatarIcon) {
        avatarIcon.addEventListener("click", function() {
            // 触发图片编辑功能
            console.log("Edit Avatar");

            // 弹出文件选择框，让用户选择新头像图片文件
            var input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(event) {
                var file = event.target.files[0];
                var reader = new FileReader();
                reader.onload = function(event) {
                    // 更新头像图标的样式
                    avatarIcon.style.backgroundImage = "url('" + event.target.result + "')";
                    // 设置提示文本
                    avatarIcon.title = "Click to Change Avatar";
                    // 可以在这里将新头像提交到服务器保存
                    console.log("New avatar has been submitted:", event.target.result);
                };
                reader.readAsDataURL(file);
            };
            input.click();
        });

        // 添加鼠标悬停提示
        avatarIcon.title = "Click to Edit Avatar";
    }
});
