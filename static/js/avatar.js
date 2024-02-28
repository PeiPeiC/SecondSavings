// profile base 头像

document.addEventListener("DOMContentLoaded", function() {
    // 添加事件监听器到头像图片
    var avatarImg = document.getElementById("avatar");
    if (avatarImg) {
        avatarImg.addEventListener("click", function() {
            // 触发图片编辑功能
            // 在这里添加你自己的逻辑
            console.log("编辑头像");
        });
    }
});
