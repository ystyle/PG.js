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

    //默认显示第一个面板
    $(".tabs-nwjs:first").show();

    // 文件选择框更改事件
    $("#fileDialog").change(function () {
        if (this.value) {
            window.localStorage.setItem('LastReadPath',this.value);
            var json = fs.readFileSync(this.value);
            window.localStorage.setItem('packages', json);
            $("#refresh").trigger("click");
        }
    });
    //文件保存框更改事件
    $("#fileSaveDialog").change(function () {
        if (this.value) {
            saveJson(this.value);
        }
    });
});

/**
 * 保存JSON
 * @param path
 */
var saveJson = function (path) {
    window.localStorage.setItem('LastWritePath', path);
    var json = window.localStorage.getItem('packages');
    fs.writeFileSync(path, json);
}

// 初始化 angular
var app = angular.module('pg', []).config(['$controllerProvider', function ($controllerProvider) {
    $controllerProvider.allowGlobals();
}]);

/**
 * 定义Angular的controller
 */
app.controller('packageGeneratorCtrl', function ($scope,Packages,$timeout) {

    // pageage.json 内容
    $scope.package = Packages.all();

    // 初始化界面时弹出的信息
    $scope.temppathMsg = "打开文件:"+Packages.getLastReadPath()+"\n"+"保存路径:"+Packages.getLastWritePath();

    /**
     * 清除本地缓存
     */
    $scope.clearStorage = function () {
        window.localStorage.clear();
        $scope.refresh();
    }

    /**
     * 关闭模式化窗口
     */
    $scope.cloaseModal = function () {
        $('#myModal').modal('hide');
    }

    /**
     * 打开文件选择框
     */
    $scope.openFileDialog = function () {
        $("#fileDialog").trigger("click");
    }

    /**
     * 保存文件
     * @param package
     */
    $scope.savePackage = function (package) {
        Packages.save(package);
        var path = Packages.getLastWritePath();
        if(!path){
            $("#fileSaveDialog").trigger("click");
        }else{
            saveJson(path);
        }
    }

    /**
     * 刷新界面数据
     */
    $scope.refresh = function () {
        $scope.package = Packages.all();
    }

    /**
     * 初始化界面检测上一次未关闭文件
     */
    $timeout(function () {
        if (Packages.getLastReadPath() || Packages.getLastWritePath()) {
            $('#myModal').modal('show');
        }
    });
});

app.factory('Packages', function () {
    return {
        /**
         * 查询package.json
         * @returns {*}
         */
        all: function () {
            var packageString = window.localStorage.getItem('packages');
            if (packageString) {
                return angular.fromJson(packageString);
            }
            return {};
        },
        /**
         * 保存package.json
         * @param packages
         */
        save: function (packages) {
            window.localStorage.setItem('packages', angular.toJson(packages,true));
        },
        /**
         * 取得上一次读取文件的路径
         * @returns {string}
         */
        getLastReadPath: function () {
            return window.localStorage.getItem('LastReadPath') || '';
        },
        /**
         * 设置当前使用的文件路径
         * @param path
         */
        setLastReadPath: function (path) {
            return window.localStorage.setItem('LastReadPath',path);
        },
        /**
         * 取得上一次保存文件的路径
         * @returns {string}
         */
        getLastWritePath: function () {
            return window.localStorage.getItem('LastWritePath') || '';
        },
        /**
         * 设置当前保存文件的路径
         * @param path
         */
        setLastWritePath: function (path) {
            window.localStorage.setItem('LastWritePath', path);
        }
    };
});