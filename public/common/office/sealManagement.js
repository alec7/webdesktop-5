//安全电子印章系统函数
var ntkosignctl = null; //初始化印章管理控件对象
var filename = ""; //磁盘印章文件名
var Signname = "";//印章文件名称

//初始化控件对象
function init() {
    ntkosignctl = document.all("ntkosignctl");
}

//创建新的印章
function CreateNewSign() {
    Signname = $("#seal_name").val();
    $("#filename").val(Signname + ".esp");
    if ((Signname == '') || (undefined == typeof (Signname))) {
        alert('请输入印章名称');
        return false;
    }

    var Signuser = $("#SignUser").val();
    if ((Signuser == '') || (undefined == typeof (Signuser))) {
        alert('请输入印章使用人');
        return false;
    }

    var Password1 = document.forms(0).Password1.value;
    var Password2 = document.forms(0).Password2.value;
    if ((Password1 == '') || (Password2 == '') || (Password1 != Password2) || (undefined == typeof (Password1))) {
        alert('印章口令不能为空或者不一致');
        return false;
    }
    if (Password1.length < 6) {
        alert('印章口令不能小于6位');
        return false;
    }

    var Filename = document.forms(0).Filename.value;
    if ((Filename == '') || (undefined == typeof (Filename))) {
        alert('请选择印章源文件');
        return false;
    }

    var str = Filename.substr(Filename.lastIndexOf(".") + 1, Filename.length);
    if (str != "jpg" && str != "jpeg") {
        alert("请上传jpg或jpeg格式的图片");
        return false;
    }
    ntkosignctl.CreateNew(Signname, Signuser, Password1, Filename);
    if (0 != ntkosignctl.StatusCode) {
        alert("创建印章错误.");
        return false;
    }
    alert("创建成功 请点击保存到服务器或者本地按钮.");
    return true;
}

//编辑印章文件
function editesp(url) {
    ntkosignctl.OpenFromURL(url);
    document.forms(0).filename.value = url.substring(url.lastIndexOf("/") + 1, url.length);
    $("#seal_name").val(ntkosignctl.SignName);
    document.forms(0).SignUser.value = ntkosignctl.SignUser;
    document.forms(0).Password1.value = ntkosignctl.PassWord;
    document.forms(0).Password2.value = ntkosignctl.PassWord;
    //ntkosignctl.height = ntkosignctl.SignHeight;
}

function savetourl() {
    //在后台，可以根据上传文件的inputname是否为"SIGNFILE"来判断
    //是否是印章控件上传的文件
    var Password1 = document.forms(0).Password1.value;
    var Password2 = document.forms(0).Password2.value;
    filename = document.forms(0).filename.value;
    if ((Password1 == '') || (Password2 == '') || (Password1 != Password2) || (undefined == typeof (Password1))) {
        alert('印章口令不能为空或者不一致');
        return false;
    } else {
        $("#seal_password").val(Password1);
    }
    ntkosignctl.SignName = $("#seal_name").val();
    ntkosignctl.SignUser = $("#SignUser").val();
    ntkosignctl.PassWord = document.forms(0).Password1.value;
    //SaveToURL方法保存印章文件
    var retStr = ntkosignctl.SaveToURL(document.forms(0).action, "upload", "savetype=4", filename, 0);
    /*
     var newwin = window.open("", "espmsg", "left=200,top=200,width=400,height=200,status=1,toolbar=1,menubar=1,location=1,scrollbars=false,resizable=false", false);
     var newdoc = newwin.document;
     newdoc.open();
     newdoc.write("<center><hr>" + retStr + "<hr><input type=button VALUE='关闭窗口' onclick='window.close();if(window.opener){window.opener.location.reload()};'></center>");
     newdoc.close();
     */
    //判断是否保存成功，如果成功，刷新窗口
    if (ntkosignctl.StatusCode == 0) {
        alert("保存成功。");
        window.location.reload();
    }
    else {
        alert(retStr);
    }
}

function SaveToLocal() {
    ntkosignctl.SaveToLocal('', true);
    if (0 == ntkosignctl.StatusCode) {
        alert("保存成功!");
    }
    else {
        alert("保存错误.");
    }
    if (window.opener)
        window.opener.location.reload();
}

function delesp(path) {
    if (confirm("确认删除此印章吗？")) {
        $.ajax({
            type: "post",
            url: "${ctx}/wf/delEsp.shtml",
            data: "path=" + path,
            success: function (msg) {
                alert(msg);
                window.location.reload();
            }
        });
    }
}