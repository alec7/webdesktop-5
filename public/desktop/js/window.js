var wincount = 1000;

/*
 config { width:600,height:400,align:"center",valign:"middle",url:"http://www.baidu.com" }
 */
var Win = function (config) {

    this.winid = null;
    this.pageno = null;
    this.left = 0;
    this.top = 0;
    this.width = 0;
    this.height = 0;
    this.state = 'restore';
    this.prestate = 'restore';

    this.opts = {
        name: 'window',
        width: 600,
        height: 400,
        maxWidth: false,
        maxHeight: false,
        minWidth: 200,
        minHeight: 100,
        resizable: true,
        draggable: true,
        minimize: true,
        maximize: true,
        align: "center",
        valign: "middle",
        url: "about:blank"
    };
    this.init(config);
}
Win.prototype = {

    init: function (config) {
        this.initOpts(config);
        this.create();
        this.bindEvent();
    },
    initOpts: function (config) {

        this.winid = config.id;
        this.pageno = config.pageno;

        for (var i in this.opts)
            if (typeof(config[i]) != "undefined")
                this.opts[i] = config[i];
        /*
         for( var i in this.opts )
         alert(i+"="+this.opts[i]);*/
    },
    create: function () {

        var absoluteUrl = this.opts.url;
        if (absoluteUrl.indexOf("http://") < 0)
            absoluteUrl = ctx + "/" + absoluteUrl;
        this.box = $("<div class='win' style='position:absolute;z-index:" + wincount++ + "' onselectstart='return false;'></div>");
        this.box.append("<span class='lt'></span><span class='rt'></span><span class='lb'></span><span class='rb'></span><span class='lc'></span><span class='rc'></span><span class='resizehandle'></span>");

        var titlebar = $("<div class='wintitle'>" + this.opts.name + "</div>");
        titlebar.appendTo(this.box);
        if (this.opts["minimize"] == true) {
            var min = $("<span class='min'></span>");
            min.appendTo(titlebar);
            if (this.opts["maximize"] == false)
                min.css("right", "35px");
            /*位置右移*/
        }
        if (this.opts["maximize"] == true) {
            titlebar.append("<span class='restore'></span>");
            titlebar.append("<span class='max'></span>");
        }
        titlebar.append("<span class='close'></span>");

        var wincontent = $("<div class='wincontent'></div>");
        var iframecover = $("<div class='iframecover'></div>");
        var iframe = $("<iframe border=0 frameborder=0 src='" + absoluteUrl + "'></iframe>");
        iframe.load(function () {
            iframecover.hide();
        });
        wincontent.append(iframe);
        wincontent.append(iframecover);
        //iframecover.html($("#loading").html());
        this.box.append(wincontent);

        this.box.append("<div class='winbottom'></div>");

        var totalWidth = getTotalWidth();
        var totalHeight = getTotalHeight();

        var width = this.opts.width;
        var height = this.opts.height;
        if (this.opts.width > totalWidth)
            width = totalWidth;
        if (this.opts.height > totalHeight)
            height = totalHeight;

        if (this.opts.align == "left")
            this.box.css({left: 0});
        else if (this.opts.align == "right")
            this.box.css({right: 0});
        else
            this.box.css({left: (totalWidth - width) / 2 > 0 ? (totalWidth - width) / 2 : 0});

        if (this.opts.valign == "top")
            this.box.css({top: 0});
        else if (this.opts.valign == "bottom")
            this.box.css({top: (totalHeight - height - 20) > 0 ? (totalHeight - height - 20) : 0});
        else
            this.box.css({top: (totalHeight - height) / 2 > 0 ? (totalHeight - height) / 2 : 0});

        //this.box.width(this.opts.width-46);
        this.box.height(height);
        this.box.width(width);
        this.box.find(".iframecover").width(width);
        this.box.find(".wincontent,.lc,.rc,.iframecover").height(height - 40);
        //this.resizewin();
    },
    bindEvent: function () {

        var win = this;
        this.box.mousedown(function () {
            $(this).css("z-index", wincount++)
        });

        if (this.opts.draggable == true) {
            this.box.draggable({
                handle: ".wintitle",
                scroll: false,
                start: function (e) {
                    $(this).find(".iframecover").show();
                },
                stop: function (e) {
                    $(this).find(".iframecover").hide();

                    var top = win.box.offset().top;
                    var left = win.box.offset().left;
                    var height = getTotalHeight() - 40;
                    var width = getTotalWidth() - 40;
                    if (top > height)
                        win.box.css({top: height});
                    if (top < 0)
                        win.box.css({top: 0});
                    if (left > width)
                        win.box.css({left: width});
                    if (left < (40 - win.box.width()))
                        win.box.css({left: (40 - win.box.width())});

                    win.storage();
                }
            });
        } else {
            this.box.find(".wintitle").css("cursor", "default");
        }
        ;

        if (this.opts.resizable == true) {
            var _opts = {
                handle: ".resizehandle",

                resize: function (e) {
                    win.resizewin();
                },
                start: function (e) {
                    $(".iframecover").show();
                },
                stop: function (e) {
                    $(".iframecover").hide();
                    win.storage();
                    win.resizeiframe();
                }
            };

            this.box.resizable(_opts);
        }

        var iframe = this.box.find("iframe");
        iframe.load(function () {
            win.resizewin();
            win.resizeiframe();
        });

        var title = this.box.find(".wintitle");
        title.dblclick(function () {
            if (win.state == "restore")
                win.max();
            else
                win.restore();
        }).rightClick(function (e) {
            e.stopPropagation();
            var maxHandle = function () {
                win.max();
            };
            var restoreHandle = function () {
                win.restore();
            };
            var minHandle = function () {
                win.min();
            };
            var closeHandle = function () {
                Body.getCurrentPage().closeWin(win)
            };
            var contextmenudata = [];
            if (win.state == "max")
                contextmenudata[contextmenudata.length] = { name: '还原', handle: restoreHandle};
            if (win.state == "restore")
                contextmenudata[contextmenudata.length] = { name: '最大化', handle: maxHandle};
            contextmenudata[contextmenudata.length] = { name: '最小化', handle: minHandle};
            contextmenudata[contextmenudata.length] = { name: '关闭', handle: closeHandle};
            ContextMenu.bindData(e, contextmenudata);
        });

        var minbutton = this.box.find(".min");
        minbutton.mouseover(function (e) {
            $(this).addClass("focus");
        }).mouseout(function (e) {
            $(this).removeClass("focus");
        }).click(function (e) {
            win.min();
        });

        var restorebutton = this.box.find(".restore");
        restorebutton.mouseover(function (e) {
            $(this).addClass("focus");
        }).mouseout(function (e) {
            $(this).removeClass("focus");
        }).click(function (e) {
            win.restore();
        });

        var maxbutton = this.box.find(".max");
        maxbutton.mouseover(function (e) {
            $(this).addClass("focus");
        }).mouseout(function (e) {
            $(this).removeClass("focus");
        }).click(function (e) {
            win.max();
        });
        var closebutton = this.box.find(".close");
        closebutton.mouseover(function (e) {
            $(this).addClass("focus");
        }).mouseout(function (e) {
            $(this).removeClass("focus");
        }).click(function () {
            Body.getCurrentPage().closeWin(win);
        });
    },
    storage: function () {
        this.left = this.box.offset().left;
        this.top = this.box.offset().top;
        this.width = this.box.width();
        this.height = this.box.height();
    },
    resizewin: function () {

        var h = this.box.height();
        var w = this.box.width();

        if (w <= this.opts.minWidth) {
            w = this.opts.minWidth;
            this.box.width(w);
        }
        if (h <= this.opts.minHeight) {
            h = this.opts.minHeight;
            this.box.height(h);
        }
        if (this.opts.maxWidth != false)
            if (w >= this.opts.maxWidth) {
                w = this.opts.maxWidth;
                this.box.width(w);
            }

        if (this.opts.maxHeight != false)
            if (h >= this.opts.maxHeight) {
                h = this.opts.maxHeight;
                this.box.height(h);
            }

        this.box.find(".wincontent,.lc,.rc,.iframecover").height(h - 46);
        this.box.find(".iframecover").width(w - 26);
    },
    resizeiframe: function () {
        this.box.find("iframe").height(this.box.height() - 46).width(this.box.width() - 26);
    },
    restore: function () {
        //还原
        this.box.css({left: this.left, top: this.top, width: this.width, height: this.height, display: 'block'});
        this.resizewin();
        this.resizeiframe();

        this.box.css({"z-index": wincount++});
        this.box.find(".max").show();
        this.box.find(".restore").hide();

        this.box.resizable('enable');
        this.box.draggable('enable');

        this.state = "restore";
        this.prestate = "restore";
    },
    max: function () {
        //最大化

        this.box.css({left: -8, top: -8, display: 'block'});
        this.box.width(getTotalWidth() + 16);
        this.box.height(getTotalHeight() + 16);

        this.resizewin();
        this.resizeiframe();

        this.box.resizable('disable');
        this.box.draggable('disable');
        //this.box.animate({opacity:"1"},"normal");
        this.box.find(".max").hide();
        this.box.find(".restore").show();

        this.state = "max";
        this.prestate = "max";
    },
    min: function () {
        this.box.hide()
        this.state = "min";
    },
    destroy: function () {
        /////////////////// 解决iframe内存溢出 ////////////////////////////
        var ifr = this.box.find("iframe")[0];
        ifr.src = "about:blank";

        //////////////////////////////////
        this.box.empty();
        //this.box.destroy();
        this.box.remove();
        this.box = null;

        /*
         if (typeof ifr.contentWindow.document === 'object') {
         ifr.contentWindow.document.open();
         ifr.contentWindow.document.write('');
         ifr.contentWindow.document.clear();
         ifr.contentWindow.document.close();
         }*/
    }
}