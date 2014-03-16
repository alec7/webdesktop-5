function isLastPerRow(i) {
    if ((i + 1) % 5 == 0) {
        return true;
    } else {
        return false;
    }
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
var $$ = function (ele) {
    var jquery_obj = null;
    if (typeof(ele) == "string" && jQuery.trim(ele).indexOf(".") != 0) {
        jquery_obj = $("#" + ele);
    } else {
        jquery_obj = $(ele);
    }
    return jquery_obj;
};

function findPage(pageno, me, formId) {
    var frm = $("form:first");
    var pagenoHidden = frm.find("input[name='pageno']");
    if (pagenoHidden.size() < 1) {
        pagenoHidden = $("<input type='hidden' name='pageno' />");
        frm.append(pagenoHidden);
    }
    pagenoHidden.val(pageno);
    frm.get(0).submit();
}

var Progress = function () {
};
Progress = {
    /**
     * config.container 相对容器
     * config.title 滚动条标题
     */
    show: function (config) {

        var totalWidth = null;
        var totalHeight = null;
        var width = 260;
        var height = 60;
        var l = 0;
        var t = 0;

        var container = config ? $$(config.container) : null;
        var title = config ? config.title : null;
        if (container == null || container.size() == 0) {
            totalWidth = getTotalWidth();
            totalHeight = getTotalHeight();
            l = $(document).scrollLeft();
            t = $(document).scrollTop();
        } else {
            totalWidth = container.width();
            totalHeight = container.height();
            l = container.offset().left + container.scrollLeft();
            t = container.offset().top + container.scrollTop();
        }
        var left = (totalWidth - width - 70) / 2 + l;
        var top = (totalHeight - height) / 2 + t;

        var progress = $("#spgoa_progress_single");
        var iframe = $("#spgoa_progress_single_iframe");
        if (progress.size() == 0) {
            var iframe = $("<iframe class='ajax_progress_iframe' id='spgoa_progress_single_iframe' frameborder=0 style='width:" + (width + 8) + "px;height:" + (height + 8) + "px;line-height:" + height + "px;left:" + (left - 4) + "px;top:" + (top - 4) + "px;border:1px solid #8bb0ff;'></iframe>")
            progress = $("<div class='ajax_progress' id='spgoa_progress_single' style='width:" + width + "px;height:" + height + "px;line-height:30px;left:" + left + "px;top:" + top + "px;'></div>");
        }
        if (title != null && title != "")
            progress.html(title);
        else
            progress.html("数据加载中...");

        $(document.body).append(progress);
        $(document.body).append(iframe);

    },
    hide: function () {
        try {
            var progress = $(document).find("#spgoa_progress_single");
            if (progress.size() > 0) {
                progress.remove();
                $(document).find("#spgoa_progress_single_iframe").remove();
            }
        } catch (e) {
        }
    },
    topHide: function () {
        try {
            var progress = $(window.parent.document).find("#spgoa_progress_single");
            if (progress.size() > 0) {
                progress.remove();
                $(window.parent.document).find("#spgoa_progress_single_iframe").remove();
            }
        } catch (e) {
        }
    }
}
/**
 * config = {title:""}
 */
var Popup = {
    open: function (config) {
        var title = config && config.title ? config.title : "窗口";

        var fade = $("<iframe id='spgoa_popup_iframe' border=0 frameborder=0 src='about:blank'></iframe>");

        var win = $("<div id='spgoa_popup_win'></div>");
        var title = $("<div class='popuptitle'>" + title + "</div>");
        var content = $("<div class='popupcontent'></div>");
        var footer = $("<div class='popupfooter'></div>");
        footer.append("<input type='button' value='关闭' onclick='Popup.close()'/>");

        //win.append(title).append(content).append(footer);
        win.append(title).append(content).append(footer);


        $(document.body).append(fade);
        $(document.body).append(win);

        var resetWin = function () {
            var totalWidth = getTotalWidth();
            var totalHeight = getTotalHeight();
            var w = totalWidth * 0.8;
            var h = totalHeight * 0.8;
            var l = (totalWidth - w) / 2;
            var t = (totalHeight - h) / 2;
            fade.css({width: w, height: h, left: l, top: t});
            win.css({width: w, height: h, left: l, top: t});
            content.height(h - title.height() - footer.height() - 2);

        };
        resetWin();

        $(window).resize(function () {
            resetWin();
        });
    },
    show: function (url, type) {
        var content = $("#spgoa_popup_win .popupcontent");
        content.addClass("progress");
        if (type && type == "iframe") {
            content.append("<iframe border=0 frameborder=0 width='100%' height='100%' src='" + url + "'></iframe>");
            return;
        }
        $.ajax({
            type: "get",
            url: url,
            success: function (msg) {
                content.html(msg);
                content.removeClass("progress");
            },
            error: function (msg) {
                content.html(msg);
                //Progress.hide();
            }
        });
    },
    close: function () {
        $("#spgoa_popup_iframe").remove();
        $("#spgoa_popup_win").remove();
    }
};
$(document).ready(function () {

    /* table 鼠标移动高亮效果 */
    $(".tablegrid tbody tr:odd").addClass('odd');
    $(".tablegrid tbody tr:even").addClass('even');
    $(".tablegrid tbody tr").mouseover(function () {
        $(this).addClass("over");
    }).mouseout(function () {
        $(this).removeClass("over");
    });

    Progress.topHide();//removeParentProgress();
    var eles = $(".showprogress,.backbutton");

    /**
     * <element class="showprogress" container="container" progress="进度条标题" />
     */
    $.each(eles, function (i, n) {
        var ele = $(n);

        var showprogress = function (e) {
            var title = e.attr("progress");
            var container = e.attr("container");
            title = title == null || title == "" ? "数据加载中..." : title;
            var config = {title: title};
            if (container != null && container != "")
                config["container"] = container;
            Progress.show(config);
            if (type == "button" || type == "submit")
                e.attr("disabled", true);
        };

        if (ele.hasClass("backbutton")) {
            ele.click(function () {
                history.back();
            });
        }
        var type = ele.attr("type");
        if (type == "submit") {

            var frm = ele.parents("form:first");

            ele.click(function () {
                var validate_temp_id = $(this).attr("validate_temp_id");
                if (validate_temp_id == null) {
                    validate_temp_id = Math.random();
                    $(this).attr("validate_temp_id", validate_temp_id);
                    if (frm.find(".validate_temp_id").size() == 0) {
                        frm.append("<input type='hidden' class='validate_temp_id' value='" + validate_temp_id + "'/>");
                    }
                }
                frm.find(".validate_temp_id").val(validate_temp_id);
            });

            frm.validate({
                submitHandler: function (form) {
                    var val = frm.find(".validate_temp_id").val();
                    var e = frm.find("[validate_temp_id='" + val + "']");

                    //需要定制验证的可以自实现beforeSubmit方法
                    if (typeof(beforeSubmit) != "undefined" && beforeSubmit() == false)
                        return false;
                    var $names = $("#workflowView_process_participantNames");
                    var nextStep = "";
                    $(".highLightFlag1").each(function (i, n) {
                        var isChioce = $(n).attr('checked');
                        var stepHtml = $(n).next().html();
                        if (stepHtml != '' && isChioce == 'checked') {
                            nextStep = stepHtml;
                        }
                    });

                    var flag = false;
                    var alertStr = "";
                    if (nextStep != '' && nextStep != 'undefined') {
                        alertStr = "您选择的下一步为:" + nextStep + "";
                    }
                    if ($names.val() != '' && $names.val() != undefined) {
                        alertStr += ",下一步接收人为:" + $names.val() + "";
                    }
                    if (alertStr != '') {
                        if (confirm(alertStr + ".是否提交?")) {
                            showprogress(e);
                            form.submit();
                        }
                    } else {
                        showprogress(e);
                        form.submit();
                    }
                },
                invalidHandler: function (form, validator) {  //不通过回调
                    //需要定制验证的可以自实现beforeSubmit方法
                    if (typeof(beforeSubmit) != "undefined" && beforeSubmit() == false)
                        return false;
                },
                errorPlacement: function (error, element) {
                    if (element.is(":radio") || element.is(":checkbox")) {
                        if (element.parent().is("span")) {
                            $("<div class='radioError'></div>").append(error).appendTo(element.parent().parent());
                        } else {
                            $("<div class='radioError'></div>").append(error).appendTo(element.parent());
                        }
                    } else {
                        error.appendTo(element.parent());
                    }
                }
            });

        }
        else {
            ele.click(function () {
                showprogress($(this));
            });
        }

    });
});

/*
 config { width:600,height:400,align:"center",valign:"middle",url:"http://www.baidu.com" }
 */
var Win = function (config) {

    //this.id = null;
    this.box = null;

    this.opts = {
        title: '标题',
        width: 600,
        height: 400,
        align: "center",
        valign: "middle",
        scrolling: "auto",
        url: "about:blank"
    };
    this.init(config);
};
Win.prototype = {

    init: function (config) {
        this.initOpts(config);
        this.create();
        this.bindEvent();
    },
    initOpts: function (config) {

        //this.id = config.id;
        if (!config)
            return;
        for (var i in this.opts)
            if (typeof(config[i]) != "undefined")
                this.opts[i] = config[i];
    },
    reset: function () {
        var totalWidth = getTotalWidth();
        var totalHeight = getTotalHeight();

        var width = this.opts.width;
        var height = this.opts.height;

        //alert(totalWidth+":"+totalHeight);
        //alert(width+":"+height);
        var l = $(document).scrollLeft();
        var t = $(document).scrollTop();

        if (this.opts.width > totalWidth)
            width = totalWidth;
        if (this.opts.height > totalHeight)
            height = totalHeight;

        if (this.opts.align == "left")
            this.box.css({left: l});
        else if (this.opts.align == "right")
            this.box.css({right: 0});
        else
            this.box.css({left: (totalWidth - width) / 2 > 0 ? (totalWidth - width) / 2 + l : 0});

        if (this.opts.valign == "top")
            this.box.css({top: t});
        else if (this.opts.valign == "bottom")
            this.box.css({top: (totalHeight - height) > 0 ? (totalHeight - height) : 0});
        else
            this.box.css({top: (totalHeight - height) / 2 > 0 ? (totalHeight - height) / 2 + t : 0});
    },
    create: function () {
        this.box = $("<div class='newwin' style='position:absolute;z-index:10000' onselectstart='return false;'></div>");

        var titlebar = $("<div class='wintitle'>" + this.opts.title + "</div>");
        titlebar.append("<span class='close'></span>");
        titlebar.appendTo(this.box);

        var wincontent = $("<div class='wincontent'></div>");
        var iframecover = $("<div class='iframecover'></div>");
        var iframe = $("<iframe border=0 scrolling='" + this.opts.scrolling + "' frameborder=0 src='" + this.opts.url + "'></iframe>");
        iframe.load(function () {
            iframecover.hide();
        });
        wincontent.append(iframe);
        wincontent.append(iframecover);
        this.box.append(wincontent);

        var totalWidth = getTotalWidth();
        var totalHeight = getTotalHeight();

        var width = this.opts.width;
        var height = this.opts.height;
        if (this.opts.width > totalWidth)
            width = totalWidth;
        if (this.opts.height > totalHeight)
            height = totalHeight;

        this.box.height(height);
        this.box.width(width);

        iframecover.width(width);
        iframecover.height(height - 28);

        wincontent.width(width);
        wincontent.height(height - 28);

        iframe.width(width);
        iframe.height(height - 28);


        this.reset();
        this.box.appendTo($(document.body));
    },
    bindEvent: function () {
        var me = this;
        var closebutton = this.box.find(".close");
        closebutton.mouseover(function (e) {
            $(this).addClass("focus");
        }).mouseout(function (e) {
            $(this).removeClass("focus");
        }).click(function () {
            me.destroy();
        });
        $(window).resize(function () {
            if (me.box != null)
                me.reset();
        });
    },
    destroy: function () {
        /////////////////// 解决iframe内存溢出 ////////////////////////////
        var ifr = this.box.find("iframe")[0];
        ifr.src = "about:blank";

        this.box.empty();
        this.box.remove();
        this.box = null;

    }
}