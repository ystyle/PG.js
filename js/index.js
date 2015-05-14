/**
 * Created by YSTYLE on 2015-05-09-0009.
 */
var fs = require('fs');
$(function () {
    // 菜单切换
    $('ul.nav.nav-tabs a').click(function (e) {
        e.preventDefault();
        var id = $(this).attr("href");
        $(".tabs-nwjs").hide();
        $(id).show();
        $(this).tab('show');
    });

    initUI();
    //默认显示第一个面板
    $(".tabs-nwjs:first").show();

    // 打开文件
    $("#load").click(function (e) {
        $("#fileDialog").trigger("click");
    });

    // 重新读取
    $("#refresh").click(function (e) {
        if (globalSetting.packagePath) {
            loadJSONFile();
        }
    });

    // 保存文件
    $("#save").click(function (e) {
        if (globalSetting.packagePath) {
            saveJSONFile();
        } else {
            $("#fileSaveDialog").trigger("click");
        }
    });
});

/**
 * 加载json文件
 */
function loadJSONFile() {
    var JsonObj = JSON.parse(fs.readFileSync(globalSetting.packagePath));
    globalSetting.json = JsonObj;
    $("#form-basic").setform(JsonObj);// 基本信息
    $("#form-window").setform(JsonObj.window);// 窗口设置
    $("#form-advanced").setform(JsonObj);// 高级设置

    $("#form-maintainers").setform(JsonObj.maintainers); //软件维护者信息
    if (JsonObj.keywords) {
        $("#form-keywords").setform({keywords: JsonObj.keywords.join(",")}); // 关键词
    }
    $("#form-bugs").setform({bugs: JsonObj.bugs}); // bug提交地址
    $("#form-contributors").setform(JsonObj.contributors); // 贡献者信息
    $("#form-licenses").setform(JsonObj.licenses); // licenses
    $("#form-repositories").setform(JsonObj.repositories); // 仓库地址
}
/**
 * 保存json文件
 */
function saveJSONFile() {
    var basic = $("#form-basic").serializeJson();// 基本信息
    var windowobj = $("#form-window").serializeJson();// 窗口设置
    var advanced = $("#form-advanced").serializeJson();// 高级设置


    var maintainers = $("#form-maintainers").serializeJson(); //软件维护者信息
    var keywordsstr = $("#form-keywords").serializeJson(); // 关键词
    var bugs = $("#form-bugs").serializeJson(); // bug提交地址
    var contributors = $("#form-contributors").serializeJson(); // 贡献者信息
    var licenses = $("#form-licenses").serializeJson(); // licenses
    var repositories = $("#form-repositories").serializeJson(); // 仓库地址

    // 合并对象
    var newmerge = {
        maintainers: maintainers,
        keywords: function () {
            if (keywordsstr) {
                return keywordsstr.split(',');
            } else {
                return [];
            }
        },
        bugs: function () {
            if (bugs) {
                return bugs;
            } else {
                return "";
            }
        },
        contributors: function () {
            if (contributors) {
                return contributors;
            } else {
                return {};
            }
        },
        licenses: function () {
            if (licenses) {
                return licenses;
            } else {
                return {};
            }
        },
        repositories: function () {
            if (repositories) {
                return repositories;
            } else {
                return {};
            }
        }
    };

    var json = $.extend(basic, advanced, newmerge);

    if (window) {
        json.window = windowobj;
    }
    globalSetting.json = json;
    fs.writeFileSync(globalSetting.packagePath, JSON.stringify(globalSetting.json));
}

/**
 * 初始化界面
 */
function initUI() {
    $("#fileDialog").change(function () {
        if (this.value) {
            globalSetting.packagePath = this.value;
            loadJSONFile();
        }
    });
    $("#fileSaveDialog").change(function () {
        if (this.value) {
            globalSetting.packagePath = this.value;
            saveJSONFile();
        }
    });
}

// 文件保存路径
var globalSetting = {};
