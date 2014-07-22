$.ajaxSetup({
    cache: false //关闭AJAX相应的缓存
});

//var json_data = {"pages":[{"modules":[{"code":"test","moduleId":"1","moduleUrl":"http://www.baidu.com","name":"测试模块","remark":"我测试的模块"}],"pageno":"1"}]};
var icon_base_url = null;
var app_modules_url = null;
var module_uninstall_url = null;
var personal_url = null;
var works_url = null;
var emails_url = null;
var logout_url = null;
/*
 var pageDatas = [
 {
 pageno:1,modules:[
 {
 id:'1',icon:'css/base/images/icon/menu_icon_1.png',name:'百度搜索',title:'百度搜索',
 draggable:true,
 resizable:false,
 url:"add.html"
 },
 {
 id:'2',icon:'css/base/images/icon/menu_icon_1.png',name:'百度搜索',title:'百度搜索',
 draggable:true,
 resizable:false,
 url:"add.html"
 }
 ]
 },
 {
 pageno:2,modules:[
 {
 id:'3',icon:'css/base/images/icon/menu_icon_1.png',name:'百度搜索',title:'百度搜索',
 draggable:true,
 resizable:false,
 url:"add.html"
 },
 {
 id:'4',icon:'css/base/images/icon/menu_icon_1.png',name:'百度搜索',title:'百度搜索',
 draggable:true,
 resizable:false,
 url:"add.html"
 }
 ]
 }
 ];
 */
var pageConfigs = [
    { pageno: 1, name: "桌面一" },
    { pageno: 2, name: "桌面二" },
    { pageno: 3, name: "桌面三" }
];

var documentContextmenu = [
    { name: "显示桌面", handle: function () {
        alert("待开发");
    } },
    { name: "锁定", handle: function () {
        alert("待开发");
    } },
    { name: "添加应用", handle: function () {
        alert("待开发");
    } },
    { name: "主题设置", handle: function () {
        alert("待开发");
    } },
    { name: "系统设置", handle: function () {
        alert("待开发");
    } },
    { name: "注销", handle: function () {
        alert("待开发");
    } }
];

function getPageData(pageno) {
    for (var i in pageDatas)
        if (pageDatas[i].pageno == pageno)
            return pageDatas[i];
    return null;
}
function getModuleData() {
    if (arguments.length == 0)
        return null;
    else if (arguments.length == 1) {
        var moduleId = arguments[0];
        for (var i in pageDatas)
            for (var j in pageDatas[i].modules)
                if (pageDatas[i].modules[j].id == moduleId)
                    return pageDatas[i].modules[j];
        return null;
    }
    else if (arguments.length == 2) {
        var pageno = arguments[0];
        var moduleId = arguments[1];
        var pageData = getPageData(pageno);

        if (pageData == null)
            return null;
        for (var i in pageData.modules)
            if (pageData.modules[i].id == moduleId)
                return pageData.modules[i];
        return null;
    }
}
function removeModuleData(pageno, moduleId) {
    var pageData = getPageData(pageno);

    if (pageData == null)
        return null;
    for (var i in pageData.modules)
        if (pageData.modules[i].id == moduleId)
            delete pageData.modules[i];
    return null;
}


function initPagetabbar() {
    var width = getTotalWidth();
    var pagetabbar = $("#pagetabbar");
    pagetabbar.css({left: (width - pagetabbar.width()) / 2});
}
$(window).resize(function () {
    initPagetabbar();
    for (var i in Body.pages)
        Body.pages[i].resetLayout();
});

$(document).ready(function () {

    Body.initDatas();

    //初始化页面和模块菜单
    Body.initPages();

    //初始化页码
    Body.initPagetabBar();

    //初始化右键菜单
    Body.initContextMenu();

    //初始化右上角功能菜单
    Body.initFuncMenu();

    //初始化document对象
    Body.initDocument();

    initPagetabbar();

    //发送请求获取用户的待办任务
    Body.initWorks();
});

var Body = {
    startup: true, /* 启动状态 */
    pages: {},
    initDatas: function () {
        icon_base_url = ctx + "/public/desktop/css/base/images/icon/";
        app_modules_url = "application/apps";
        module_uninstall_url = ctx + "/userdesktop/uninstallmodule";
//      icon_base_url = ctx+"/resource/desktop/css/base/images/icon/";
//      app_modules_url = "platform/desktop/app/query.shtml";
//		module_uninstall_url = ctx+"/platform/desktop/userdesktop/uninstall_module.shtml";
//		personal_url =  "platform/client/orpm/personal.shtml";
//		works_url = ctx+"/platform/desktop/remind/remind.shtml";
//		emails_url = ctx+"/platform/desktop/remind/emails.shtml";
//		logout_url = ctx+"/platform/desktop/app/logout.shtml";
        pageDatas = $.parseJSON(json_data).pages;

    },
    initPages: function () {

        for (var i = 0; i < pageConfigs.length; i++) {
            var pageData = getPageData(pageConfigs[i].pageno);
            if (pageData == null) {
                pageData = {};
                pageData.pageno = pageConfigs[i].pageno;
                pageData.modules = [];
                pageDatas[pageDatas.length] = pageData;
            }
            var page = new Page(pageData);
            Body.addPage(page);
        }
        $(".page").first().show();
    },
    initPagetabBar: function () {
        PagetabBar.initPagetabs();
    },
    initContextMenu: function () {
        ContextMenu.init();
        $("body").append(ContextMenu.box);
    },
    initFuncMenu: function () {
        $("#funcbar #works span").click(function () {
            var obj = $(this).parent();
            $("#funcbar .func").css("color", "#fff");
            $(".details").hide();
            obj.css("color", "yellow");
            obj.children(".details").show();
        });
        $("#funcbar .title div").click(function () {
            var popup = $(this).parent().parent();
            popup.hide();
            popup.parent().css("color", "#fff");
        });
    },
    addPage: function (page) {
        Body.pages[page.pageno] = page;
        $("#pages").append(page.box);
    },
    getPage: function (pageno) {
        return Body.pages[pageno];
    },
    getCurrentPage: function () {
        for (var i in Body.pages) {
            if (Body.pages[i].isShow())
                return Body.pages[i];
        }
    },
    getCurrentPageno: function () {
        for (var i in Body.pages) {
            if (Body.pages[i].isShow())
                return Body.pages[i].pageno;
        }
    },
    initDocument: function () {
        $(document).rightClick(function (e) {
            return;
            //ContextMenu.bindData(e,documentContextmenu);
        });
    },
    selectThemes: function (target) {
        var div = $(".themes");
        if (div.size() == 0) {
            div = $("<div class='themes'><div class='themes_1'></div><div class='themes_2'></div></div>");
            $(document.body).append(div);
            div.children(".themes_1").click(function () {
                $(document.body).removeClass("theme_2");
                $(document.body).addClass("theme_1");
            });
            div.children(".themes_2").click(function () {
                $(document.body).removeClass("theme_1");
                $(document.body).addClass("theme_2");
            });
        }
        div.show();
        div.css({left: $(".theme").offset().left, top: $(".theme").offset().top - 22 - div.height()});
        $(document).click(function () {
            div.hide();
        });

    },
    personal: function () {
        Body.getCurrentPage().openWin({
            id: "personal",
            name: '我的个人信息',
            width: 600,
            height: 440,
            maxWidth: false,
            maxHeight: false,
            minWidth: 200,
            minHeight: 100,
            resizable: false,
            draggable: true,
            minimize: true,
            maximize: false,
            align: "center",
            valign: "middle",
            url: personal_url
        });
    },
    initWorks: function () {
        /*
         $(document.body).everyTime('1000',function(){
         alert(1);
         });*/
        //发送ajax请求获取当前员工待办任务列表
        DesktopInterface.loadWorks();
        setInterval("DesktopInterface.loadWorks()", 60000 * 5);
        //DesktopInterface.loadWorks();

        /*
         var works = [
         {id:"1",name:"发文任务",url:"http://www.baidu.com",businesstype:"发文管理"},
         {id:"2",name:"收文任务",url:"http://www.baidu.com",businesstype:"收文管理"}
         ];
         //alert(works.length);
         for( var i=0;i<works.length;i++ ){
         var work = works[i];
         DesktopInterface.addWork(work.id,work.name,work.url,work.businesstype);
         }*/
    }
}

var Page = function (pageData) {
    this.pageno = null;
    this.wins = {};
    this.modules = {};
    this.ms = [];
    this.init(pageData);
};
Page.prototype = {
    init: function (pageData) {

        this.pageno = pageData.pageno;
        this.create();

        if (pageData.modules && pageData.modules != null) {

            for (var i in pageData.modules) {
                var module = new Module(pageData.modules[i]);
                //alert(module.box.html());
                this.addModule(module);
            }
        }

        /************************** 在桌面创建增加菜单 **************************/
        var insertModuleData = {};
        insertModuleData.id = "-1";
        insertModuleData.icon = "menu_icon_add.png";
        insertModuleData.name = "添加模块";
        insertModuleData.title = "添加模块";
        insertModuleData.url = app_modules_url;
        insertModuleData.width = 800;
        insertModuleData.height = 500;
        this.addModule(new Module(insertModuleData));
        /****************************************************/

        var pageData = getPageData(this.pageno);
        pageData.modules[pageData.modules.length] = insertModuleData;
    },
    create: function (pageConfig) {
        this.modulebox = $("<div class='menus_container'></div>");
        this.box = $("<div class='page'></div>").append(this.modulebox).hide();
    },
    uninstallModule: function (moduleId) {
        var me = this;
        var data = {};
        data["moduleId"] = moduleId;
        data["pageno"] = this.pageno;
        $.post(module_uninstall_url, data, function () {
            var currentModule = Body.getCurrentPage().modules[moduleId];
            currentModule.box.remove();
            removeModuleData(me.pageno, moduleId);
            showMessage("菜单移除成功,需要时可以重新加入");

            //删除对应的module数组
            var ms = Body.getCurrentPage().ms;
            for (var i = 0; i < ms.length; i++) {

                if (ms[i].id == moduleId)
                    Body.getCurrentPage().ms = ms.slice(0, i).concat(ms.slice(i + 1, ms.length));
            }
            Body.getCurrentPage().resetLayout();
        });

    },
    existModule: function (moduleId) {
        if (getModuleData(this.pageno, moduleId) != null)
            return true;
        return false;
    },
    addModule: function (module) {

        this.modules[module.id] = module;
        if (arguments.length == 1) {
            this.ms[this.ms.length] = module;
        } else {
            //后期增加
            var addmodule = this.ms[this.ms.length - 1];
            this.ms[this.ms.length - 1] = module;
            this.ms[this.ms.length] = addmodule;
        }
        var no = 0;
        var top = 5;
        var left = 5;
        for (var i in this.modules)
            no++;

        var height = 110;
        var width = 95;
        var padding = 40;
        var paddingtop = padding;

        var _rows = (getTotalHeight() - 36 - padding) / height;
        var rows = Math.floor(_rows);

        var ys = _rows - rows;
        paddingtop += ys * height;

        left = left + (Math.floor((no - 1) / rows)) * width;
        if (no % rows == 0)
            top += (rows - 1) * height;
        else
            top += (no % rows - 1) * height;
        paddingtop += ys * height;

        module.box.css({left: left, top: top + 20});
        //alert(module.box.html());
        this.modulebox.append(module.box);

        this.resetLayout();
    },
    resetLayout: function () {
        var height = 110;
        var width = 110;
        var paddingtop = 70;
        var paddingbottom = 45;
        var paddingleft = 20;

        var _rows = (getTotalHeight() - paddingtop - paddingbottom) / height;
        var rows = Math.floor(_rows);

        var ys = _rows - rows;
        paddingtop += ys * height / 2;
        if (paddingtop >= 125) {
            paddingtop = 70;
            paddingbottom = 35;
        }

        var no = 0;
        for (var i = 0; i < this.ms.length; i++) {
            no++;
            var top = 0;
            var left = 0;
            var module = this.ms[i];
            left = left + (Math.floor((no - 1) / rows)) * width;

            if (no % rows == 0)
                top += (rows - 1) * height;
            else
                top += (no % rows - 1) * height;
            top += paddingtop;
            left += paddingleft;

            module.box.css({left: left, top: top});
        }
    },
    addStrModule: function (strModuleData) {

        eval(strModuleData);

        var moduleId = moduleData.id;
        //判断该菜单是否已经添加
        if (getModuleData(this.pageno, moduleId) != null) {
            alert("该功能已经添加到桌面了，不能重复添加");
            return;
        }
        var pageData = getPageData(this.pageno);
        pageData.modules[pageData.modules.length] = moduleData;

        this.addModule(new Module(moduleData), "append");
    },
    addAjaxModule: function (strModuleData) {
        var moduleData = strModuleData;
        var pageData = getPageData(this.pageno);
        pageData.modules[pageData.modules.length] = moduleData;

        this.addModule(new Module(moduleData), "append");
    },
    getWin: function (id) {
        return this.wins[id];
    },
    openWin: function (config) {
        //判断该菜单功能是否已经打开
        var win = this.getWin(config.id);
        if (win == null) {
            win = new Win(config);
            //win.prototype.constructor = classB;
            this.box.append(win.box);
            win.storage();
            //alert(config.url);
            this.wins[config.id] = win;
            TaskBar.addTask({winid: config.id, name: config.name, pageno: this.pageno});
        }
        else {
            win.restore();
        }
        return win;
    },
    closeWin: function (win) {
        for (var i in this.wins) {
            if (this.wins[i] == win) {
                this.wins[i].destroy();
                this.wins[i] = null;
                TaskBar.removeTask(win.winid);
                break;
            }
        }

    },
    hide: function () {
        this.box.fadeOut(500);
    },
    hide: function (callback) {
        this.box.fadeOut(500, callback);
    },
    show: function () {
        this.box.fadeIn(200);
    },
    isShow: function () {
        if (this.box.css("display") == "block")
            return true;
        return false;
    }
};

var Module = function (moduleData) {
    this.id = null;
    this.init(moduleData);

};
Module.prototype = {
    init: function (moduleData) {
        this.create(moduleData);
        this.bindEvent();
    },
    create: function (moduleData) {
        this.id = moduleData.id;
        this.box = $("<a class='menu' id='" + this.id + "' style='position:absolute;' href='#'><div class='menu_icon' style='background-image:url(\"" + icon_base_url + moduleData.icon + "\");'></div><div class='menu_title'><span class='titlename'>" + moduleData.name + "<div class='leftbg'></div><div class='rightbg'></div></span></div></a>");
    },
    bindEvent: function () {
        var module = this;

        this.box.rightClick(function (e) {
            e.stopPropagation();
            var openHandle = function () {
                var moduleData = getModuleData(module.id);
                Body.getCurrentPage().openWin(moduleData);
                var win = Body.getCurrentPage().openWin(moduleData);
                if (module.id != "-1") {
                    win.max();
                }
            };
            var newOpenHandle = function () {
                var moduleData = getModuleData(module.id);
                var relativeUrl = moduleData.url;
                if (relativeUrl.indexOf("http://") < 0)
                    relativeUrl = ctx + "/" + relativeUrl;
                window.open(relativeUrl);
            };
            var uninstallHandle = function () {
                Body.getCurrentPage().uninstallModule(module.id);
            }
            var cm = [];
            cm[cm.length] = { name: '打开应用', handle: openHandle };
            if (module.id != "-1") {
                cm[cm.length] = { name: '在新窗口打开应用', handle: newOpenHandle };
                cm[cm.length] = { name: '卸载应用', handle: uninstallHandle };
            }
            ContextMenu.bindData(e, cm);
        });
        this.box.click(function (e) {
            e.stopPropagation();
            var moduleData = getModuleData(module.id);
            Body.getCurrentPage().openWin(moduleData);
            var win = Body.getCurrentPage().openWin(moduleData);
            if (module.id != "-1") {
                win.max();
            }
        })
    }
}

var TaskBar = function () {
    var Task = function (taskConfig) {
        this.init(taskConfig);
    };
    Task.prototype = {
        winid: null,
        pageno: null,
        init: function (taskConfig) {
            this.create(taskConfig);
            this.bindEvent();
        },
        create: function (taskConfig) {
            this.winid = taskConfig.winid;
            this.pageno = taskConfig.pageno;
            this.box = $("<li class='task focus'><a href='#' title='" + taskConfig.name + "'>" + taskConfig.name + "</a></li>");
            $("#tasks").append(this.box);
        },
        destroy: function () {
            this.box.remove();
            //this.box.html("");
            this.box = null;
        },
        bindEvent: function () {
            var task = this;
            this.box.mouseover(function () {
                $(this).addClass("over");
            }).mouseout(function () {
                $(this).removeClass("over");
            }).click(function (e) {
                $(this).addClass("focus");
                if (Body.getPage(task.pageno).isShow() == false)
                    PagetabBar.getPagetab(task.pageno).turnon();

                var win = Body.getPage(task.pageno).getWin(task.winid);
                if (win.prestate == "restore")
                    win.restore();
                else
                    win.max();
            }).rightClick(function (e) {
                e.stopPropagation();

                var win = Body.getPage(task.pageno).getWin(task.winid);

                var maxHandle = function () {
                    win.max();
                    if (Body.getPage(task.pageno).isShow() == false)
                        PagetabBar.getPagetab(task.pageno).turnon();
                };
                var restoreHandle = function () {
                    win.restore();
                    if (Body.getPage(task.pageno).isShow() == false)
                        PagetabBar.getPagetab(task.pageno).turnon();
                };
                var minHandle = function () {
                    win.min();
                    if (Body.getPage(task.pageno).isShow() == false)
                        PagetabBar.getPagetab(task.pageno).turnon();
                };
                var closeHandle = function () {
                    Body.getCurrentPage().closeWin(win)
                };
                var contextmenudata = [];
                if (win.opts["maximize"] == true) {
                    if (win.state == "max")
                        contextmenudata[contextmenudata.length] = { name: '还原', handle: restoreHandle};
                    if (win.state == "restore")
                        contextmenudata[contextmenudata.length] = { name: '最大化', handle: maxHandle};
                }
                if (win.opts["minimize"] == true) {
                    if (win.state != "min") {
                        contextmenudata[contextmenudata.length] = { name: '最小化', handle: minHandle};
                    } else {
                        contextmenudata[contextmenudata.length] = { name: '还原', handle: restoreHandle};
                        //contextmenudata[contextmenudata.length] = { name:'最大化',handle:maxHandle};
                    }
                }
                contextmenudata[contextmenudata.length] = { name: '关闭', handle: closeHandle};
                ContextMenu.bindData(e, contextmenudata);
            });
        }

    };
    return {
        tasks: {},
        addTask: function (taskConfig) {
            var task = new Task(taskConfig);
            TaskBar.tasks[task.winid] = task;
        },
        getTask: function (winid) {
            return TaskBar.tasks[winid];
        },
        removeTask: function (winid) {
            var task = TaskBar.tasks[winid];
            task.destroy();
            TaskBar.tasks[winid] = null;
        }
    }
}()

var ContextMenu = function () {
    var MenuItem = function (ops) {
        this.init(ops)
    };
    MenuItem.prototype = {
        id: null,
        init: function (ops) {
            this.create(ops);
            this.bindEvent();
        },
        create: function (ops) {
            this.id = ops.id;
            this.box = $("<li>" + ops.name + "</li>");
            this.box.click(function () {
                (ops.handle)();
                ContextMenu.remove();
            });
        },
        bindEvent: function () {
            var item = this;
            this.box.mouseover(function (event) {
                //event.stopPropagation();//阻止事件冒泡;
                $(this).css({background: "#ccc"})
            });
            this.box.mouseout(function (event) {
                //event.stopPropagation();//阻止事件冒泡;
                $(this).css("background", "#fff")
            });
            /*
             this.box.click(function(event){
             var menuData = getMenuData(item.id);
             Body.getCurrentPage().openWin(menuData.contextmenu);
             ContextMenu.remove();
             });*/
            this.box.rightClick(function (e) {
                e.stopPropagation();
            });
        }
    }
    var me = null;
    return me = {
        init: function () {
            me.create();
            me.bindEvent();
        },
        create: function () {
            me.box = $('<ul id="ContextMenu"></ul>');
        },
        bindData: function (e, contextmenuDatas) {
            for (var i in contextmenuDatas)
                me.box.append(new MenuItem(contextmenuDatas[i]).box);

            /*
             var xx = e.originalEvent.x || e.originalEvent.layerX || 0;
             var yy = e.originalEvent.y || e.originalEvent.layerY || 0;
             */
            var x = e.clientX;
            var y = e.clientY;

            if (x + me.box.width() > getTotalWidth())
                x = x - me.box.width();
            if (y + me.box.height() > getTotalHeight())
                y = y - me.box.height();

            me.box.children("li:last").css("border-bottom", 0);
            me.box.show().css({left: x, top: y});
        },
        bindEvent: function () {

            me.box.mousedown(function (e) {
                e.stopPropagation();
                return false;
            });

            me.box.rightClick(function (e) {
                e.stopPropagation();
            });

            $(document).mousedown(function (e) {
                e.stopPropagation();
                me.remove();
                return false;
            });

        },
        remove: function () {
            me.box.children().empty();
            me.box.html('').hide();
        }
    }
}();

var PagetabBar = function () {
    var Pagetab = function (pageConfig) {
        this.init(pageConfig);
    };
    Pagetab.prototype = {
        id: null,
        init: function (pageConfig) {
            this.create(pageConfig);
            this.bindEvent();
        },
        create: function (pageConfig) {
            this.id = pageConfig.pageno;
            this.box = $("<li><a href='#' class='pagetab' title='" + pageConfig.name + "'>" + pageConfig.pageno + "</a></li>");
        },
        focus: function () {
            this.box.children("a").attr("class", "current");
        },
        blur: function () {
            this.box.children("a").attr("class", "pagetab");
        },
        turnon: function () {

            //所有动画结束
            for (var i in Body.pages)
                Body.pages[i].box.stop(true, true);

            //隐藏当前页面，显示要切换的页面
            var page = Body.getPage(this.id);
            var currentpage = Body.getCurrentPage();
            currentpage.hide(function () {
                page.show();
            });

            //隐藏当前tab，显示要切花的tab
            for (var j in PagetabBar.pagetabs)
                PagetabBar.pagetabs[j].blur();
            PagetabBar.pagetabs[this.id].focus();
        },
        bindEvent: function () {
            var me = this;
            this.box.click(function () {
                me.turnon();
            });
        }

    };
    return {
        pagetabs: {},
        initPagetabs: function () {
            for (var i in pageConfigs)
                PagetabBar.addPagetab(new Pagetab(pageConfigs[i]));
            $("#pagetabs .pagetab").first().attr("class", "current");
        },
        addPagetab: function (pagetab) {
            PagetabBar.pagetabs[pagetab.id] = pagetab;
            pagetab.box.insertBefore($("#pagetabs li.tasksli"));
        },
        getPagetab: function (id) {
            return PagetabBar.pagetabs[id];
        }
    }
}()

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
    this.padding = 36;
    /*this.padding = 38+36;*/

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
        this.opts.url = absoluteUrl;
        this.box = $("<div class='newwin' style='position:absolute;z-index:" + wincount++ + "' onselectstart='return false;'></div>");
        this.box.append("<span class='resizehandle'></span>");

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

        var funcbar = $("<div class='winfunc' style='display:none;'></div>");
        var home = $("<a class='home'></a>");
        var back = $("<a class='back'></a>");
        var prev = $("<a class='prev'></a>");
        var refresh = $("<a class='refresh'></a>");
        home.click(function () {
            //alert(this.opts.url);
        });
        back.click(function () {
            //var ifr = $(this).parent().parent().find("iframe");
            //if ( ifr.size()>0 ){
            //	ifr[0].contentWindow.history.back();
            //}
        });
        prev.click(function () {
            //history.forward();
        });
        refresh.click(function () {
            //window.location.href=this.opts.url;
        });
        funcbar.append(home).append(back).append(prev).append(refresh);
        funcbar.appendTo(this.box);

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
            this.box.css({top: (totalHeight - height) > 0 ? (totalHeight - height) : 0});
        else
            this.box.css({top: (totalHeight - height) / 2 > 0 ? (totalHeight - height) / 2 : 0});

        //this.box.width(this.opts.width-46);
        this.box.height(height);
        this.box.width(width);
        this.box.find(".iframecover").width(width);
        this.box.find(".wincontent,.iframecover").height(height - this.padding);

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
                    var height = getTotalHeight();
                    var width = getTotalWidth();
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

        this.box.find(".wincontent,.iframecover").height(h - this.padding);
        this.box.find(".iframecover").width(w);
    },
    resizeiframe: function () {
        this.box.find("iframe").height(this.box.height() - this.padding).width(this.box.width());
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

        this.box.css({left: 0, top: 0, display: 'block'});
        this.box.width(getTotalWidth());
        this.box.height(getTotalHeight());

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

/* 桌面提供的对外接口 */
var DesktopInterface = {
    addWork: function (id, title, url, type) {

        if ($("#works #" + id).size() > 0)
            return;

        var list = $("#works .list");
        var size = list.size();

        //计数器加1
        $("#works span").html("待办事宜(" + (list.children("a").size() + 1) + ")");

        if (title == "") {
            title = "&nbsp;";
        }

        list.append("<a href='javascript:DesktopInterface.open(\"" + url + "\")' id='" + id + "'><div>" + title + "</div></a>");

        //图标闪动
        if (!$("#works").hasClass("has"))
            $("#works").addClass("has");

        if (Body.startup == true || size == 0) {
            Body.startup = false;
            $("#funcbar #works span").click();
        }
    },
    removeWork: function (id) {

        if ($("#works #" + id).size() < 1) {
            $("#works span").html("待办事宜(0)");
            return;
        }

        var list = $("#works .list");
        //计数器减1
        $("#works span").html("待办事宜(" + (list.children("a").size() - 1) + ")");

        $("#works #" + id).remove();
        if ($("#works a").size() == 0)
            $("#works").removeClass("has");
    },
    addMessage: function (id) {

    },
    removeMessage: function () {

    },
    open: function (config) {
        var id = config.id ? config.id : "desktop_workdeal";
        var title = config.title ? config.title : "窗口";
        var url = config.url ? config.url : "";
        var width = config.width ? config.width : 800;
        var height = config.height ? config.height : 800;
        var max = config.max ? config.max : true;
        var win = Body.getCurrentPage().openWin({
            id: id,
            name: title,
            width: width,
            height: height,
            maxWidth: false,
            maxHeight: false,
            minWidth: 200,
            minHeight: 100,
            resizable: true,
            draggable: true,
            minimize: true,
            maximize: max,
            align: "center",
            valign: "middle",
            url: url
        });
        return win;
    },
    //TODO:暂时不用,需要的时候再做修改。
    loadWorks: function () {
//		jQuery.ajax({
//			type:"post",
//			url:works_url,
//			dataType:"text",
//			timeout:20000,
//			success:function(rtn) {
//				if ( rtn.length<4 )
//					return;
//
//				var _counts = rtn.split(",");
//				var taskcount = _counts[0];
//				var emailcount = _counts[1];
//				var readcount = _counts[2];
//
//				var taskElement = $("#rightbar .todo .item");
//				var emailElement = $("#rightbar .email .item");
//				var readElement = $("#rightbar .companyportal .item");
//				if ( taskcount>0 )
//				{
//					document.getElementById("alertMusic").play();
//					taskElement.html("<span>待办("+taskcount+")</span><span class='number'>"+taskcount+"</span>");
//				}else{
//					taskElement.html("<span>待办(0)</span>");
//				}
//
//				if ( emailcount>0 )
//				{
//					emailElement.html("<span>邮件("+emailcount+")</span><span class='number'>"+emailcount+"</span>");
//				}else{
//					emailElement.html("<span>邮件(0)</span>");
//				}
//
//				if ( readcount>0 )
//				{
//					readElement.html("<span>阅读箱("+readcount+")</span><span class='number'>"+readcount+"</span>");
//				}else{
//					readElement.html("<span>阅读箱(0)</span>");
//				}
//			}
//		});
//		var url = ctx+"/oa/desktopnote/get_note_size.shtml";
//			jQuery.ajax({
//					type:"get",
//					url:url,
//					timeout:20000,
//					success:function(rtn) {
//						var oldNoteSize = parseInt($("#noteSize").html());
//						$("#noteSize").html(rtn);
//						var newNoteSize = parseInt($("#noteSize").html());
//						var arr = $("#scollContent").html();
//						if(arr!=null){
//							var noNoteLetterFont =  $("#scollContent").find("#noNoteLetterFont").html();
//							if(oldNoteSize!=newNoteSize){
//								if(noNoteLetterFont==null||noNoteLetterFont==''){
//									loadRemind();
//								}
//							}
//						}
//					}
//		});
//		var url = ctx+"/application/session/ajax_online_counter.shtml";
//			jQuery.ajax({
//					type:"get",
//					url:url,
//					timeout:20000,
//					success:function(rtn) {
//						$("#onlineNum").html(rtn);
//					}
//		});
    }
};
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
        var left = (getTotalWidth() - 250) / 2;
        var top = (getTotalHeight() - 50) / 2;
        confirmDiv.css({ color: '#fff', font: '14px', width: 250, height: 16, padding: '10px', position: 'absolute', zIndex: 10000, left: left, top: top, textAlign: 'center', border: '1px solid #000', background: '#333' });
        confirmDiv.appendTo($(document.body));
    }
    confirmDiv.html(message);
    confirmDiv.fadeIn(1000, function () {
        window.setTimeout('$("#confirmDiv").fadeOut(500);', 1000);
    });
}
function logout() {
    if (confirm("在下方点击[确定]按钮退出系统,\n\n点击[取消]按钮继续留在本系统")) {
        Progress.show({title: "正在退出系统..."});
        window.location.href = logout_url;
    }
}
/************************************* 第三方插件 ************************************/
if (jQuery) (function () {

    $.extend($.fn, {

        rightClick2: function (handler) {
            $(this).each(function () {
                $(this).mousedown(function (e) {
                    var evt = e;
                    $(this).mouseup(function () {
                        $(this).unbind('mouseup');
                        if (evt.button == 2) {
                            handler.call($(this), evt);
                            return false;
                        } else {
                            return true;
                        }
                    });
                });
                $(this)[0].oncontextmenu = function () {
                    return false;
                }
            });
            return $(this);
        },

        rightMouseDown: function (handler) {
            $(this).each(function () {
                $(this).mousedown(function (e) {
                    if (e.button == 2) {
                        handler.call($(this), e);
                        return false;
                    } else {
                        return true;
                    }
                });
                $(this)[0].oncontextmenu = function () {
                    return false;
                }
            });
            return $(this);
        },

        rightClick: function (handler) {
            $(this).each(function () {
                $(this).mouseup(function (e) {
                    if (e.button == 2) {
                        handler.call($(this), e);
                        return false;
                    } else {
                        return true;
                    }
                });
                $(this)[0].oncontextmenu = function () {
                    return false;
                }
            });
            return $(this);
        },

        noContext: function () {
            $(this).each(function () {
                $(this)[0].oncontextmenu = function () {
                    return false;
                }
            });
            return $(this);
        }

    });

})(jQuery);	