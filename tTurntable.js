/**
 * tTurntable
 * @Author  Travis(LinYongji)
 * @Contact http://travisup.com/
 * @Version 1.0.0
 * @date    2013-11-18
 */
(function() {
    var rQuickExpr = /^(?:#([\w-]+)|\.([\w-]+))$/,
        rWhitespace = /(^\s+)|(\s+$)/g;

    // 基础兼容封装
    // 获取特定元素
    function getMatchElem(selector, parent, nodes) {
        var rets = [],
            i = 0, m, match;
        
        if(selector.nodeType === 1) {
            return selector;
        }
        match = rQuickExpr.exec(selector);
        if (match) {
            if ((m = match[1])) {
                rets = document.getElementById(m);
                return rets ? [rets] : null;
            }
            else if ((m = match[2])) {
                if(parent instanceof Array && parent[0]) {
                    parent = parent[0];
                }
                parent = parent || document;
                if(!nodes && parent.getElementsByClassName) {
                    rets = parent.getElementsByClassName(m);
                } else {
                    nodes = nodes || parent.getElementsByTagName('*');
                    for(; i < nodes.length; i++) {
                        if (nodes[i].nodeType === 1 && hasClass(nodes[i], m)) {
                            rets.push(nodes[i]);
                        }
                    }
                }
            }
        }
        return rets[0] ? rets : null;
    }
    // 样式操作
    function hasClass(elem, className) {
        return (' ' + elem.className + ' ').indexOf(' ' + className + ' ') >= 0;
    }
    function addClass(elem, className) {
        if (!hasClass(elem, className)) {
            elem.className = trim(elem.className + ' ' + className + ' ');
        }
    }
    function removeClass(elem, className) {
        elem.className = trim((' ' + elem.className + ' ').replace(' ' + className + ' ', ' '));
    }
    function setPixelCss(elem, name, val) {
        elem.style[name] = val + 'px';
    }
    // 删除左右空格
    function trim(str) {
        return (str || '').replace(rWhitespace, '');
    }
    // 事件绑定/解绑
    function addEvent(elem, type, fn) {
        if (window.addEventListener) {
            elem.addEventListener(type, fn, false);
        } else if (document.attachEvent) {
            elem.attachEvent('on' + type, fn);
        } else {
            elem['on' + type] = fn;
        }
    }
    function removeEvent(elem, type, fn) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, fn, false);
        } else if (document.detachEvent) {
            elem.detachEvent('on' + type, fn);
        } else {
            elem['on' + type] = null;
        }
    }
    // 判断是否函数
    function isFunction(obj) {
        return typeof obj === "function";
    }
    // 默认函数
    function returnFalse() {
        return false;
    }

    // 主模块
    function Turntable(custom) {
        var self = this,
            $wrap, $list, $start,

            running = false, // 运行状态
            length = 0, // 列表长度

            step = 0, // 转动次数
            endStep = 0, // 停止次数
            index = 0, // 当前元素索引
            circle = 1, // 转的圈数 
            speed = 0, // 速度
            serverData = null, // 服务端数据

            // 数据缓存
            turnData = {},
            prevData = {
                endStep: 0,
                index: 0,
                circle: 0
            },

            // 自定义配置
            options = {
                // class
                selector: '#J_Turntable', // 选择器
                classItem: 'js-tt-item', // 列表class
                classStart: 'js-tt-start', // 开始按钮class
                classCurr: 'current', // 当前class
                // step
                upStep: 5, // 加速次数
                downStep: 5, // 减速次数
                timeoutStep: 999, // 停止转动次数
                // speed
                startSpeed: 300, // 开始速度
                endSpeed: 300, // 中间均速
                highSpeed: 50, // 快结束速度
                // function
                // 点开始调用函数
                start: returnFalse,
                // 每转动一次调用的函数
                turn: returnFalse,
                // 转动中调用的函数
                running: returnFalse,
                // 转动结束后调用函数
                end: returnFalse
            };

        // 转动
        function turn() {
            removeClass($list[index], options.classCurr);

            // +1
            step++;
            index++;
            if(index >= length) {
                index -= length;
                circle++;
            }

            addClass($list[index], options.classCurr);

            turnData = {
                endStep: endStep,
                index: index,
                circle: circle
            };

            // 转动调用函数
            options.turn.call(self, turnData);

            if(step != endStep) {
                setTimeout(turn, getNextTime());
            } else {
                // 结束
                running = false;
                prevData = turnData;
                options.end.call(self, turnData, serverData);
            }
        }

        // 获取下次定位时间
        function getNextTime() {
            // 加速
            if(step > 0 && step <= options.upStep) {
                speed -= parseInt((options.startSpeed - options.highSpeed) / options.upStep);
                speed = Math.max(options.highSpeed, speed);
            }
            // 减速
            else if(endStep && step >= endStep - options.downStep) {
                speed += parseInt((options.endSpeed - options.highSpeed) / options.downStep);
                speed = Math.min(options.endSpeed, speed);
            }
            // 高速
            else {
                speed = options.highSpeed;
            }
            return speed;
        }
        
        // 设置
        this.setting = function(custom) {
            var i,
                arrInt = ['upStep', 'downStep', 'timeoutStep', 'startSpeed', 'endSpeed', 'highSpeed'],
                arrFn = ['start', 'turn', 'running', 'end'];
            if(running === false && typeof custom === 'object') {
                for(i in options) {
                    if(typeof custom[i] !== 'undefined') {
                        if(arrInt[i]) {
                            options[i] = parseInt(custom[i]);
                        }
                        else if(arrFn[i]) {
                            options[i] = isFunction(custom[i]) ? custom[i] : returnFalse;
                        }
                        else {
                            options[i] = custom[i];
                        }
                    }
                }

                // 起始速度和结束速度不能大于高速，字面数字是相反的展现
                if(options.startSpeed < options.highSpeed) {
                    options.startSpeed = options.highSpeed;
                }
                if(options.endSpeed < options.highSpeed) {
                    options.endSpeed = options.highSpeed;
                }
            }
            return options;
        };
        // 开始转动
        this.start = function() {
            if(running === false) {
                // 初始化数据
                self.reset();
                running = true;
                // 开始转动
                setTimeout(turn, speed);
                // 调用自定义函数
                options.start.call(self);
            } else {
                // 运行中点start无效
                options.running.call(self, turnData);
            }
        };
        // 强制结束
        this.stop = function() {
            if(running === true) {
                endStep = step + 1;
            }
        };
        // 设置结束的次数
        this.setEndStep = function(sStep) {
            if(running === true) {
                endStep = sStep;
            }
        };
        // 设置结束的索引
        this.setEndIndex = function(sIndex) {
            var sStep = circle * length + sIndex;
            if(running === true) {
                if(sStep < step + options.downStep) {
                    sStep += length;
                }
                endStep = Math.max(sStep, step);
            }
        };
        // 设置服务端数据
        this.setServerData = function(data) {
            serverData = data;
        };
        // 获取抽奖数据
        this.getPrevData = function() {
            return prevData;
        };
        // 重置数据
        this.reset = function() {
            var i = 0;
            if(running === false) {
                step = 0;
                index = 0;
                circle = 1;
                speed = options.startSpeed;
                endStep = options.timeoutStep;
                setServerData = null;

                for(; i < length; i++) {
                    if(i == 0) {
                        addClass($list[i], options.classCurr);
                    } else {
                        removeClass($list[i], options.classCurr);
                    }
                }
            }
        };
        // 初始化
        function initialize() {
            self.setting(custom);
            $wrap = getMatchElem(options.selector);
            $list = getMatchElem('.'+options.classItem, $wrap);
            $start = getMatchElem('.'+options.classStart, $wrap);
            length = $list.length;

            addEvent($start[0], 'click', self.start);
        }
        
        initialize();
        return this;
    }

    window.tTurntable = function(options) {
        return new Turntable(options);
    };
})();