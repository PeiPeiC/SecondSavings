var pathname = window.location.pathname; // 获取URL的路径部分
var pathArray = pathname.split('/'); // 将路径分割成数组
var groupId = pathArray[pathArray.length - 2]; // 群组ID通常是倒数第二个元素
console.log(groupId)


var isModalOpen = false; // 初始状态为关闭
document.getElementById('show-top-users').addEventListener('click', function () {

    if (!isModalOpen) {
    $.ajax({
        url:'/secondSavings/top_study_times/' + groupId,
        success: function(data) {
            let modalContent = '<ul>';
            data.top_users.forEach(function(user) {
                modalContent += '<li>' + user.username + ' - ' + user.study_time + '</li>';
            });
            modalContent += '</ul>';
            $('#top-users-modal').html(modalContent).show();
            isModalOpen = true; // 更新状态为打开
        }
    });
    } else {
        $('#top-users-modal').hide(); // 如果已经打开，则关闭
        isModalOpen = false; // 更新状态为关闭
    }
});



//實時更新
$(document).ready(function() {
    function updateGroupStudy() {
        $.ajax({
            //url: "{% url 'TimeTracker:group_study' group.id %}",
            url:'/secondSavings/groupStudy/' + groupId,
            success: function(data) {
                $('#group-study-container').html(''); // clear all elements in contianer
                $('#group-study-container').html(data);
                
            }
        });
    }
    setTimeout(updateGroupStudy, 5000);
});