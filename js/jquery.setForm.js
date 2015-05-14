/**
 * Created by YSTYLE on 2015-05-11-0011.
 */
(function ($) {
    $.fn.setform = function (jsonValue) {
        var obj = this;
        if(!jsonValue)return;
        $.each(jsonValue, function (name, ival) {
            var $oinput = obj.find("input[name=" + name + "]");
            if ($oinput.attr("type") == "radio" || $oinput.attr("type") == "checkbox") {
                $oinput.each(function () {
                    if (Object.prototype.toString.apply(ival) == '[object Array]') {//是复选框，并且是数组
                        for (var i = 0; i < ival.length; i++) {
                            if ($(this).val() == ival[i]) {
                                $(this).attr("checked", "checked");
                            }
                        }
                    } else {
                        if ($(this).val() == ival) {
                            $(this).attr("checked", "checked");
                        }
                        if(ival==true){
                            $(this).attr("checked", "checked");
                        }
                    }
                });
            } else if ($oinput.attr("type") == "textarea") {//多行文本框
                obj.find("[name=" + name + "]").html(ival);
            } else {
                obj.find("[name=" + name + "]").val(ival);
            }
        });
    };


    $.fn.serializeJson = function () {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                if(this.value){
                    serializeObj[this.name] = this.value;
                }
                if(this.value==="on"){
                    serializeObj[this.name] = true
                }
            }
        });
        return serializeObj;
    };
})(jQuery);
