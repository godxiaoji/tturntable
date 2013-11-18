# tTurntable

Javascript抽奖插件

方形转盘抽奖插件，当然你改改样式也能变成圆的。

效果详见 [Demo](http://travisup.com/demo/plugins/tturntable/demo.html)

### Usage
	
##### tTurntable(options)

这次没有把选择器单独设为一个参数，因为只设置一个选择器抽奖也只能当demo看看。如下：
    
    var options = {
			selector: "#J_Tt"
		};
		tt = tScrollbar(options);

##### .setting(options)

如果开始的时候没有传入配置，中途也是可以重新改的，有些参数是不能重置的，运行中也不能重置。

	tt.setting(options);

##### .start()

调用开始转的函数，其实开始按钮默认绑定的就是这个函数，运行中无效。

	tt.start();

##### .stop()

强制结束的函数。

	tt.stop();

##### .getPrevData()

获取上一次抽奖结果。

	tt.getPrevData();

##### .setEndStep(step)/.setEndIndex(index)/.setServerData(data)

这三个函一般是配合传入的start函数一起使用，具体用于转盘开转后与服务端交互和设置啥时候停止下来。

`setEndStep` 设置跳动多少次后停止，不常用，很难跟服务端交互。

`setEndStep` 设置停留在那个元素的索引，推荐用这个。

`setServerData` 设置服务端参数到插件方便结束后调用。一般转盘获得服务端参数后不是立马就停下来的，有时候因为转的太少，有时候因为还要执行降速，所以这个传参就显得比较有必要了，方便结束时弹个框显示服务端结果。下面已jQuery Ajax方式举例：

	tt = tTurntable({
		// 传入的自定义开始函数
     	start: function() {
			var self = this;
			$.ajax({
				url: 'travisup.com',
				data: null,
				type: 'GET',
				dataType: 'json',
				success: function(data) {
	                self.setEndIndex(data.index); // 设置在哪里停下
	                self.setServerData(data); // 传递服务端数据
				}
			});
        }
	});

##### HTML/CSS

这个插件的原理是不断的往下一个元素传递current，当然自己写DOM和样式是少不了的。

下面给出一份参考样例，[Demo](http://travisup.com/demo/plugins/tturntable/demo.html)上也有。

##### html

	<div id="J_Tt" class="tt">
        <ul id="J_Tt_list" class="tt-list">
            <li class="tt-item tt-item1 js-tt-item current"><strong>1</strong></li>
            <li class="tt-item tt-item2 js-tt-item"><strong>2</strong></li>
            <li class="tt-item tt-item3 js-tt-item"><strong>3</strong></li>
            <li class="tt-item tt-item4 js-tt-item"><strong>4</strong></li>
            <li class="tt-item tt-item5 js-tt-item"><strong>5</strong></li>
            <li class="tt-item tt-item6 js-tt-item"><strong>6</strong></li>
            <li class="tt-item tt-item7 js-tt-item"><strong>7</strong></li>
            <li class="tt-item tt-item8 js-tt-item"><strong>8</strong></li>
            <li class="tt-item tt-item9 js-tt-item"><strong>9</strong></li>
            <li class="tt-item tt-item10 js-tt-item"><strong>10</strong></li>
            <li class="tt-item tt-item11 js-tt-item"><strong>11</strong></li>
            <li class="tt-item tt-item12 js-tt-item"><strong>12</strong></li>
            <li class="tt-item tt-item13 js-tt-item"><strong>13</strong></li>
            <li class="tt-item tt-item14 js-tt-item"><strong>14</strong></li>
            <li class="tt-item tt-item15 js-tt-item"><strong>15</strong></li>
            <li class="tt-item tt-item16 js-tt-item"><strong>16</strong></li>
        </ul>
        <div class="tt-start"><a id="J_Tt_Start" class="js-tt-start" href="javascript:void(0);">抽奖</a></div>
    </div>

##### css

	.tt{position: relative; width: 500px; height: 500px;}
    .tt-item{position: absolute; width: 100px; height: 100px; background-color: #f60;}
    .tt-item strong{display: block; height: 98px; border: 1px solid #fff; font: 24px/98px "Microsoft YaHei"; text-align: center;}
    .tt-item1{left: 0; top: 0;}
    .tt-item2{left: 100px; top: 0;}
    .tt-item3{left: 200px; top: 0;}
    .tt-item4{left: 300px; top: 0;}
    .tt-item5{left: 400px; top: 0;}
    .tt-item6{left: 400px; top: 100px;}
    .tt-item7{left: 400px; top: 200px;}
    .tt-item8{left: 400px; top: 300px;}
    .tt-item9{left: 400px; top: 400px;}
    .tt-item10{left: 300px; top: 400px;}
    .tt-item11{left: 200px; top: 400px;}
    .tt-item12{left: 100px; top: 400px;}
    .tt-item13{left: 0; top: 400px;}
    .tt-item14{left: 0; top: 300px;}
    .tt-item15{left: 0; top: 200px;}
    .tt-item16{left: 0; top: 100px;}
    .tt .current{background-color: #f00; color: #fff;}
    .tt-start{position: absolute; left: 200px; top: 200px; width: 100px; height: 100px; background-color: #f60;}
    .tt-start a{display: block; height: 100px; font: 40px/100px "Microsoft YaHei"; text-align: center; color: #fff;}
    .tt-start a:hover{background-color: #f00; text-decoration: none;}

### Options

插件提供可配置的选项，可以通过前期初始化时传入或者通过 `.setting` 来配置。

* `selector`: 插件元素选择器，支持id `#id` 和class `.class`，默认`#J_Turntable`
* `classItem`: 奖品项的类名，用户遍历奖品列表，默认`js-tt-item`
* `classStart`: 开始按钮的类名，用户获取开始按钮，默认`js-tt-start`
* `classCurr`: 当前位置的类名，转盘转动时不断的把这个样式传递给下一个，默认`current`

以上配置项只能通过初始化的时候传入，中途不能更改。

* `upStep`: 加速次数，也就是多少次后达到最快，默认`5`
* `downStep`: 减速次数，减速多少次后停止，默认`5`
* `timeoutStep`: 超时次数，设置了超时次数后，达到次数后服务端还没返回结果，自动停止转动，默认`999`
* `startSpeed`: 开始速度，就是多少毫秒执行下一次，越大越慢，默认`300`
* `endSpeed`: 结束速度，就是多少毫秒执行下一次，越大越慢，默认`300`
* `highSpeed`: 匀速速度，就是多少毫秒执行下一次，越大越慢，该数值必须大于或等于 `startSpeed` 和 `endSpeed`，默认`50`

以上配置项除了 `timeoutStep`，其他一般情况不需要改动。

* `start()`: 点击开始按钮后执行的函数，一般去服务端请求的结果并设置，或者也可以自己随机一下。该函数配合上面提到的 `.setEndStep(step)` / `.setEndIndex(index)` / `.setServerData(data)` 可以把结果设置到插件中，以便转盘停转的时候获取到参数。
* `turn(turnData)`: 每跳动一次执行的函数，一般情况下用不到。不过也有情况用到的，如记录或者圆形转盘中间的指针变化。
* `running(turnData)`: 转动中如果点开始按钮就会执行该函数。
* `end(turnData, serverData)`: 转动停止时调用的函数，这时候可以弹窗告诉用户结果等，如果之前没有设置了服务端数据，则 `serverData` 为 `null`。

		tt = tTurntable({
	     	end: function(turnData, serverData) {
				alert(turnData.index);
	        }
		});

上面后三个函数传出 `turnData` 包括三个参数 `endStep` 停转的次数， `index` 元素的索引， `circle` 转动的圈数。

### Author

[Travis](http://travisup.com/)

