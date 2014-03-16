$(document).ready(function () {
    $("#apps li").mouseover(function () {
        $(this).addClass("over");
    }).mouseout(function () {
        $(this).removeClass("over");
    }).click(function () {
        $("#apps li").removeClass("focus");
        $(this).addClass("focus");
        var no = $(this).index();
        $("#modulecontainer .modules").hide();
        $("#modulecontainer .modules:nth-child(" + (no + 1) + ")").show();
    });
    initlayer();
});
$(window).resize(function () {
    initlayer();
});

function initlayer() {
    $("#apps").height(getTotalHeight() + $(document).scrollTop());
}
function getTotalHeight() {

    if ($.browser.msie) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientHeight :
            document.body.clientHeight;
    } else {
        return self.innerHeight;
    }
}

function getTotalWidth() {
    if ($.browser.msie) {
        return document.compatMode == "CSS1Compat" ? document.documentElement.clientWidth :
            document.body.clientWidth;
    } else {
        return self.innerWidth;
    }
}
function showMessage(message) {
    var confirmDiv = $("#confirmDiv");
    if (confirmDiv.size() == 0) {
        confirmDiv = $("<div id='confirmDiv'></div>");
        confirmDiv.appendTo($(document.body));
    }
    var totalWidth = getTotalWidth();
    var totalHeight = getTotalHeight();
    var l = $(document).scrollLeft();
    var t = $(document).scrollTop();
    var left = (totalWidth - 250) / 2 + l;
    var top = (totalHeight - 50) / 2 + t;
    //alert(l+":"+t);

    confirmDiv.css({ color: '#fff', font: '14px', width: 250, height: 16, padding: '10px', position: 'absolute', left: left, top: top, textAlign: 'center', border: '1px solid #000', background: '#333' });

    confirmDiv.html(message);
    confirmDiv.fadeIn(1000, function () {
        window.setTimeout('$("#confirmDiv").fadeOut(500);', 1000);
    });
}
function addModule(moduleId) {

    var parentdocument = window.parent;
    var currentPage = parentdocument.Body.getCurrentPage();
    if (currentPage.existModule(moduleId)) {
        showMessage("该菜单在桌面上已经存在，不能重复添加");
        return false;
    }
    var pageno = parentdocument.Body.getCurrentPageno();

    var data = {};
    data["moduleId"] = moduleId;
    data["pageno"] = pageno;
    $.post(ctx + '/userdesktop/addmodule', data, function (rtn) {
        currentPage.addAjaxModule(rtn);
        showMessage('菜单添加成功');
    });
}