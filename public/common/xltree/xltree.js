$(document).ready(function () {
    $.each($(".init"), function (i, n) {
        var initelement = $(n);
        if (initelement.hasClass("tree"))
            new XLTree({id: initelement.attr("id")});
    });
});

var XLTree = function (config) {
    this.id = config.id;
    this.currentNode = null;
    this.init();
}
XLTree.prototype = {
    init: function (config) {
        this.initHtml();
        this.initEvent();
    },
    initHtml: function () {
        $.each($("#" + this.id + " li>div"), function (i, n) {
            var div = $(n);
            div.prepend("<span class='icon'></span>");
            if (i != 0) {
                div.prepend("<span class='openorclose'></span>");
            } else {
                div.children(".icon").css("left", "0");
                div.children("a").css("margin-left", "20px");
            }
        });
        $("#" + this.id + " >li >ul").css("padding-left", "0px");

        var me = this;
        $.each($("#" + this.id + " a"), function (i, n) {
            var a = $(n);
            a.click(function () {
                if ($(this).hasClass("click"))
                    return;
                $(this).addClass("click");
                if (me.currentNode != null)
                    me.currentNode.children("a").removeClass("click");
                me.currentNode = $(this).parent();
            });
        });
    },
    initEvent: function () {
        var me = this;
        var clickHandle = function (span) {
            var node = new XLTreeNode(span.parent(), me);
            if (span.hasClass("close"))
                node.open();
            else
                node.close();
        };
        $("#" + this.id + " >li >ul").show();
        //$("#"+this.id+" >li >div >.openorclose").addClass("open");
        $.each($("#" + this.id + " >li >ul > li:has(ul) > div"), function (i, n) {
            var div = $(n);
            var openorclose = div.children(".openorclose");
            openorclose.addClass("close");
            openorclose.click(function () {
                clickHandle($(this));
            });
        });
    },
    getCurrentNode: function () {
        if (this.currentNode == null)
            return null;
        return new XLTreeNode(currentNode, this);
    },
    getRoot: function () {
        return new XLTreeNode($("#" + this.id + " >li >div "), this);
    },
    getNode: function (id) {
        return new XLTreeNode($("#" + id), this);
    }
};

var XLTreeNode = function (div, tree) {
    this.id = div.attr("id");
    this.tree = tree;
    this.init(div);
}
XLTreeNode.prototype = {
    init: function (div) {
        this.box = div;
    },
    open: function () {
        var openorclose = this.box.children(".openorclose");
        openorclose.removeClass("close");
        openorclose.addClass("open");
        var ul = this.box.next("ul");
        ul.show();
        $.each(ul.children("li:has(ul)"), function (i, n) {
            var div = $(n).children("div");
            var _openorclose = div.children(".openorclose");
            if (!_openorclose.hasClass("close") && !_openorclose.hasClass("open")) {
                _openorclose.addClass("close");
                _openorclose.click(function () {
                    var node = new XLTreeNode(div, this.tree);
                    if ($(this).hasClass("close"))
                        node.open();
                    else
                        node.close();
                });
            }
        });
    },
    close: function () {
        var openorclose = this.box.children(".openorclose");
        openorclose.removeClass("open");
        openorclose.addClass("close");
        openorclose.parent().next("ul").hide();
    },
    addNode: function (id, name, url, className, beforeClassName) {
        var ul = this.box.next("ul");
        if (ul.size() == 0) {
            ul = $("<ul></ul>");
            this.box.parent().append(ul);
        }
        ul.show();
        var openorclose = this.box.children(".openorclose");
        if (!openorclose.hasClass("open")) {
            openorclose.addClass("open");
        }
        var node = $("<li></li>");
        var div = $("<div id='" + id + "' class='" + className + "'><span class='openorclose'></span><span class='icon'></span></div>");
        var a = $("<a href=\"" + url + "\">" + name + "</a>");
        var me = this;
        a.click(function () {
            if ($(this).hasClass("click"))
                return;
            $(this).addClass("click");
            if (me.tree.currentNode != null)
                me.tree.currentNode.children("a").removeClass("click");
            me.tree.currentNode = a.parent();
        });

        //在某类节点前添加新增节点
        if (beforeClassName) {
            var beforeEle = ul.find("li>." + beforeClassName + ":first");
            if (beforeEle.size() == 0)
                ul.append(node.append(div.append(a)));
            else
                beforeEle.parent().before(node.append(div.append(a)));
        }
        else {
            ul.append(node.append(div.append(a)));
        }
        return new XLTreeNode(node, this.tree);
    },
    focus: function () {
        var a = this.box.children("a");
        if (a.hasClass("click"))
            return;
        a.addClass("click");
        if (this.tree.currentNode != null)
            this.tree.currentNode.children("a").removeClass("click");
        this.tree.currentNode = this.box;
        return this;
    },
    update: function (name) {
        this.box.children("a").html(name);
        return this;
    },
    remove: function (id) {
        this.box.parent().empty();
        this.box = null;
        this = null;
    }
}