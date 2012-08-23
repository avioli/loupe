/**
 * loupe - an image magnifier for jQuery
 * (C) 2010 jdbartlett, MIT license
 * http://github.com/jdbartlett/loupe
 *
 * @updates: Ivaylo (Evo) Stamatov 2012-08
 */
(function ($) {
	$.fn.loupe = function (arg) {
		var options = $.extend({
			loupe: 'loupe',
			width: 200,
			height: 150
		}, arg || {});

		return this.length ? this.each(function () {
			var $this = $(this), $big, $loupe,
				$small = $this.is('img') ? $this : $this.find('img:first'),
				$trigger = $this.siblings('.trigger'),
				$clicker = $this.parent('a'),
				move, hide = function () { $loupe.hide(); },
				time;

			if (!$trigger.length)
				$trigger = $this;

			if ($this.data('loupe') != null) {
				return $this.data('loupe', arg);
			}

			fakeclick = function(e, target) {
				if (!target) return;
				while (target.nodeType != 1) { target = target.parentNode; }
				var ev = document.createEvent('MouseEvents');
				ev.initMouseEvent('click', true, true, e.view, 1,
					target.screenX, target.screenY, target.clientX, target.clientY,
					e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
					0, null);
				ev.__fakeClick__ = true;
				target.dispatchEvent(ev);
			}

			move = function (e) {
				var os = $small.offset(),
					sW = $small.outerWidth(),
					sH = $small.outerHeight(),
					oW = options.width / 2,
					oH = options.height / 2;

				if (!$this.data('loupe') ||
					e.pageX > sW + os.left + 10 || e.pageX < os.left - 10 ||
					e.pageY > sH + os.top + 10 || e.pageY < os.top - 10) {
					return hide();
				}

				time = time ? clearTimeout(time) : 0;

				$loupe.show().css({
					left: e.pageX - oW,
					top: e.pageY - oH
				});
				$big.css({
					left: -(((e.pageX - os.left) / sW) * $big.width() - oW)|0,
					top: -(((e.pageY - os.top) / sH) * $big.height() - oH)|0
				});
			};

			$loupe = $('<div />')
				.addClass(options.loupe)
				.css({
					width: options.width,
					height: options.height,
					position: 'absolute',
					overflow: 'hidden'
				})
				.append($big = $('<img />').attr('src', $this.attr($this.is('img') ? 'src' : 'href')).css('position', 'absolute'))
				.mousemove(move)
				.click(function(e) { if ($clicker.length) fakeclick(e, $clicker.get(0)); })
				.hide()
				.appendTo('body');

			$this.data('loupe', true);
			$trigger.data('loupe', true)
				.mouseenter(move)
				.mouseout(function () {
					time = setTimeout(hide, 10);
				});
		}) : this;
	};
}(jQuery));
