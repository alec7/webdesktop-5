$.ajaxSetup({
    cache: false //关闭AJAX相应的缓存
});

$(document).ready(function () {
    $.history.init(Ajax.historycallback);
    /*
     $("a[@rel='history']").click(function(){
     $.history.load(this.href.replace(/^.*#/, ''));
     return false;
     });)*/
});

/* Ajax工具类,只有Ajax变量对页面有侵入 */
var Ajax = function () {
    var ajax_history_datas = {};
    var ajax_ids = {};
    var ajax_container = null;

    var ajax_jquery_obj = function (ele) {
        var jquery_obj = null;
        if (typeof(ele) == "string" && jQuery.trim(ele).indexOf(".") != 0)
            jquery_obj = $("#" + ele);
        else
            jquery_obj = $(ele);
        return jquery_obj;
    };
    var ajax_shade_show = function (container, title) {
        var jquery_container = ajax_jquery_obj(container);
        var shade = jquery_container.children(".ajax_shade");
        var shade_confirm = jquery_container.children(".ajax_shade_confirm");
        if (shade.size() == 0) {
            shade = $("<iframe class='ajax_shade' frameborder=0 border=0></iframe>");
            shade_confirm = $("<div class='ajax_shade_confirm'></div>");
            shade_confirm.html(title);

            if (jquery_container.css("position") != "absolute")
                jquery_container.css("position", "relative");
            jquery_container.append(shade);
            jquery_container.append(shade_confirm);
        }
        shade.width(jquery_container.width());
        shade.height(jquery_container.height());
        shade_confirm.css({left: (jquery_container.width() - shade_confirm.width()) / 2, top: 50});
        shade.show();
        shade_confirm.show();
    };
    var ajax_shade_hide = function (container) {
        var jquery_container = ajax_jquery_obj(container);
        var shade = jquery_container.children("ajax_shade");
        var shade_confirm = jquery_container.children("ajax_shade_confirm");
        if (shade.size() == 0)
            return;
        shade.hide();
        shade_confirm.html("").hide();
    };
    var ajax_fill = function (container, content) {
        var jquery_container = ajax_jquery_obj(container);
        jquery_container.html(content);


    };
    var ajax_get_form_data = function (form) {

        var jquery_form = ajax_jquery_obj(form);

        var data = {};

        $.each(jquery_form.find("input,select,textarea"), function (i, n) {
            var ele = $(n);
            var name = ele.attr("name");
            var value = ele.val();
            data[name] = value;
        });

        return data;
    };
    var ajax_data_append = function (data, appendData) {
        if (data == null)
            data = {};
        for (var i in appendData)
            data[i] = appendData[i];
    };
    var ajax_url_append = function (url, appendData) {
        var rtn = url;
        if (url == null) return rtn;
        for (var i in appendData)
            rtn += appendData[i];
        return rtn;
    };

    var successfill = function (url, data, container, rtn, callback, id) {


        if (id) {
            /* 需要通过标签支持history功能 */
            var hash = hex_md5(ajax_url_append(url, data));
            ajax_ids[hash] = id;
            ajax_history_datas[hash] = rtn;
            ajax_container = ajax_jquery_obj(container);
            //if ( window.location.href.indexOf(hash)>0 )
            //	ajax_fill(ajax_container,rtn);
            window.location.hash = "#" + hash;
        }//else{
        ajax_fill(ajax_jquery_obj(container), rtn);
        //}
        ajax_shade_hide(container);
        if (callback)
            callback();

    };
    var errorfill = function (container, rtn) {
        ajax_fill(container, rtn);
        Ajax.popup("操作失败");
    };
    return {
        historycallback: function (hash) {
            var content;
            if (hash) {
                content = ajax_history_datas[hash];
            } else {
                content = "";
            }
            if (ajax_container != null)
                ajax_fill(ajax_container, content);

            if (typeof(Ajax_rollback) != "undefined" && Ajax_rollback) {
                /* 去除hash前缀 */
                Ajax_rollback(ajax_ids[hash]);
            }
        },
        /* url:需要访问的web地址;container:返回结果填充区域 ;data传递的参数,可以为空*/
        get: function (options) {


            var url = options.url, container = options.container;
            /*以上两个必须属性*/
            var data = options.data, callback = options.callback
            /* 可选属性 */
            var id = options.id;
            /* 可选属性,包含该属性就支持ajax history,否则不支持 */

            ajax_shade_show(container, "正在从服务器获取数据...");
            $.ajax({
                type: "get",
                url: url,
                data: data,
                success: function (rtn) {
                    successfill(url, data, container, rtn, callback, id);
                },
                error: function (rtn) {
                    errorfill(container, rtn);
                }
            });
        },
        formsubmit: function (options) {


            var form = options.form, container = options.container;
            /*以上两个必须属性*/
            var data = options.data, callback = options.callback
            /* 可选属性 */
            var id = options.id;
            /* 可选属性,包含该属性就支持ajax history,否则不支持 */
            var formdata = ajax_get_form_data(form);
            ajax_data_append(formdata, data);
            var url = ajax_jquery_obj(form).attr("action");
            ajax_shade_show(container, "正在提交数据到服务器...");
            $.ajax({
                type: "post",
                url: url,
                data: formdata,
                success: function (rtn) {
                    successfill(url, data, container, rtn, callback, id);
                    //Ajax.popup("操作成功");
                },
                error: function (rtn) {
                    errorfill(container, rtn);
                }
            });
        },
        popup: function (confirm) {
            var popup = $(".popup");
            if (popup.size() == 0) {
                popup = $("<div class='popup'></div>");
                popup.append("<span class='popup_left'></span><span class='popup_right'></span>");
                popup.append("<div class='popup_center'>" + confirm + "</div>");
                $(document.body).append(popup);
            }
            popup.fadeIn(200, function () {
                $(this).fadeOut(2000);
            });
        }
    }
}();