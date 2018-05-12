// 匿名函数避免变量污染，把Zepto传进去
; (function () {
    var Dialog = function (config) {
        var _this = this
        // 1.默认配置参数
        this.config = {
            type: 'waiting', // 对话框类型 必选
            message: null, // 对话框提示信息
            buttons: null, // 按钮配置(确定,取消,无等)
            delay: null, // 对话框延时多少秒自动关闭(null不关闭)
            delayCallBack: null, // 延时关闭回调
            maskOpacity: null, // 遮罩透明度(null不设置透明度，为默认透明度)
            maskClose: false,
            width: 'auto',
            height: 'auto',
            effect: false
        }
        // 默认参数扩展
        if (config && $.isPlainObject(config)) {
            // 传递了参数config并且为oject类型
            $.extend(this.config, config)
        } else {
            this.isConfig = true // 没传递参数给一个标识
        }

        // 2.将html用js生成DOM内容
        this.body = $('body')
        this.mask = $('<div class="g-dialog-contianer">')
        this.win = $('<div class="dialog-window">')
        this.winHeader = $('<div class="dialog-header"></div>')
        this.winContent = $('<div class="dialog-content">')
        this.winFooter = $('<div class="dialog-footer">')

        // 渲染Dom
        this.create()
    }
    Dialog.zIndex = 10000
    Dialog.prototype = {
        create: function () {
            var _this = this,
                config = this.config,
                mask = this.mask,
                win = this.win,
                header = this.winHeader,
                content = this.winContent,
                footer = this.winFooter,
                body = this.body;
            
            Dialog.zIndex++;
            this.mask.css('z-index', Dialog.zIndex);

            if (this.isConfig) {
                // 如果构造函数没有传递参数，显示waiting类型dialog
                win.append(header.addClass('loading'))
                mask.append(win)
                body.append(mask)
            } else {
                // 传递了参数
                win.append(header.addClass(config.type))
                if (config.message) {
                    win.append(content.html(config.message))
                }
                if (config.buttons) {
                    this.createButtons(footer, config.buttons)
                    win.append(footer)
                }

                if (config.width && config.width !== 'auto') {
                    win.width(config.width)
                }
                if (config.height && config.height !== 'auto') {
                    win.height(config.height)
                }
                if (config.maskOpacity) {
                    mask.css('backgroundColor', 'rgba(0,0,0,' + config.maskOpacity + ')')
                }
                if (config.delay) {
                    window.setTimeout(function () {
                        _this.close()
                        config.delayCallBack && config.delayCallBack()
                    }, config.delay)
                }
                if (config.effect) {
                    this.animate()
                }
                if (config.maskClose){
                    mask.click(function(){
                        _this.close()
                    })
                }
                mask.append(win)
                body.append(mask)
            }
        },
        createButtons: function (footer, buttons) {
            var _this = this
            buttons.map(function (item) {
                var type = item.type ? " class=" + item.type + "" : ""
                var buttonText = item.text ? item.text : ""
                var callback = item.callback ? item.callback : null
                var button = $("<button" + type + ">" + buttonText + "</button>")
                footer.append(button)
                if (callback) {
                    button.on('click', function (e) {
                        e.stopPropagation()
                        var isClose = callback()
                        if (isClose !== false) {
                            _this.close()
                        }
                    })
                } else {
                    button.on('click', function (e) {
                        e.stopPropagation()
                        _this.close()
                    })
                }
            })
        },
        close: function () {
            this.mask.remove()
        },
        animate: function () {
            var _this = this
            this.win.css('-webkit-transform', 'scale(0,0)')
            window.setTimeout(function () {
                _this.win.css('-webkit-transform', 'scale(1,1)');
            }, 100)
        }
    }
    // 实例化绑定到Zepto上
    window.dialog = function(config){
        return new Dialog(config)
    }
})(Zepto);