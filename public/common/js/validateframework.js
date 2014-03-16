$(document).ready(function () {
    initValidate()
});

function initValidate() {
    var validateElements = $("input[type='text'],input[type='password'],input[type='radio'],input[type='checkbox'],select,textarea");
    $.each(validateElements, function (i, n) {
        var validateElement = $(n);

        validateElement.focus(function () {
            clearConfirm($(this));
        });

        validateElement.blur(function () {
            validate($(this));
        });
    });
}

function clearConfirm(element) {
    var parent = element.parent();
    var confirm = parent.children(".confirm");
    var _confirm = parent.children(".confirmerror");

    confirm.show();
    _confirm.hide();
}

function validate(element) {
    var parent = element.parent();
    if (typeof("_validate") == "undefined")
        return;

    element.val($.trim(element.val()));

    var rtn = _validate(element);
    if (rtn != true) {
        //验证不合法
        var errorcss = "confirmerror_right";
        var _confirm = parent.children("." + errorcss);
        if (_confirm.size() == 0) {
            _confirm = $("<span class='" + errorcss + "'>" + rtn + "</span>");
            element.after(_confirm);
        }

        var confirm = parent.children("." + errorcss);

        confirm.hide();
        _confirm.show();

        return false;
    }
    return true;
}

function pageValidate() {
    var validateElements = $("input[type='text'],input[type='password'],input[type='radio'],input[type='checkbox'],select,textarea");
    var tof = true;
    $.each(validateElements, function (i, n) {
        var validateElement = $(n);
        if (validate(validateElement) == false)
            tof = false;
    })

    if (tof == false) {
        return tof;
    }

    //将submit按钮disabled
    var submits = $("button[type='submit'],input[type='submit'],input[type='image']");
    submits.attr("disabled", true);

    return tof;
}