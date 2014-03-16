$.ajaxSetup({
    cache: false //关闭AJAX相应的缓存
});
function ajaxSubmit(formId, obj) {

    var frm = $("#" + formId);
    var inputs = frm.find("input");
    var data = {};
    var url = frm.attr("action");
    $.each(inputs, function (i, n) {
        var input = $(n);
        var name = input.attr("name");
        var value = input.val();
        data[name] = value;
    });
    var obj2 = $("#" + obj);
    $.ajax({
        type: "post",
        url: url,
        data: data,
        success: function (msg) {
            obj2.empty().html(msg);
        },
        error: function (msg) {
            obj2.empty().html(msg);
        }
    });
}
function ajaxOpenUrl(url, obj) {
    obj.empty().html("loading......");
    $.ajax({
        type: "post",
        url: url,
        success: function (msg) {
            obj.empty().html(msg);
        },
        error: function (msg) {
            obj.empty().html(msg)
        }
    });
}

function confirmAjaxOpenUrl(str, url, obj) {
    if (confirm(str)) {
        ajaxOpenUrl(url, obj);
    }
}

