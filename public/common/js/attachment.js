$(document).ready(function () {
    $("a.addInput").click(function () {
        var html = "<div>";
        html += "<input type='file' name='upload'/> <span><a class='delInput' href='javascript:void(0);'>删除</a></span>";
        html += "</div>";
        $("#uploadDiv").append(html);
    });

    $("a.delInput").live("click", function () {
        $(this).parent().parent().remove();
    });
});