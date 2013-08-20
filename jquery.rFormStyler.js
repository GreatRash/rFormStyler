(function($, w, d) {
	var methods = {
		init: function(options) {
			var defaults = $.extend({
				cssPrefix: 'formstyler',

				select: {
					fancyCorners: false
				},

				debug: false
			}, options);

			return this.each(function() {
				var self, $this;

				$this = $(this);

				// cache defaults
				$this.data('defaults', defaults);

				methods.updateSelect.call(this);
			});
		},
		updateSelect: function() {
			$(this).each(function() {
				var $this = $(this), $wrap, $value, $button, $list, $optgroups, $options,
					self = $this[0],
					defaults = $this.data('defaults'),
					pref = defaults.cssPrefix;

				if (!$this.data('styled')) {
					$wrap = $('<div class="' + pref + '__select-wrap" />');
					$value = $('<div class="' + pref + '__select-value"><div class="' + pref + '__select-value-inner" /></div>');
					$button = $('<div class="' + pref + '__select-button"><div class="' + pref + '__select-button-inner" /></div>');
					$list = $('<div class="' + pref + '__select-list" />');

					// append elements
					$this.wrap($wrap).css({
						'position': 'absolute',
						'left': '-32767px'
					});

					$value.insertAfter($this);
					$button.insertAfter($this);
					$list.insertAfter($this);

					if (defaults.select.fancyCorners) {
						$fancy = $('<span class="' + pref + '__select-tl"></span><span class="' + pref + '__select-tr"></span><span class="' + pref + '__select-bl"></span><span class="' + pref + '__select-br"></span><span class="' + pref + '__select-t"></span><span class="' + pref + '__select-b"></span><span class="' + pref + '__select-l"></span><span class="' + pref + '__select-r"></span><span class="' + pref + '__select-bg"></span>');
						$fancy.insertAfter($this);
					}
				}

				// mark styled select
				$this.data('styled', true);

				$wrap = $this.parent();
				$value = $wrap.find('div.' + pref + '__select-value');
				$button = $wrap.find('div.' + pref + '__select-button');
				$list = $wrap.find('div.' + pref + '__select-list');
				$optgroups = $this.find('optgroup');

				if (self.disabled) {
					$wrap.addClass('disabled');
				}

				if (self.multiple) {
					$wrap.addClass('multiple');
				}

				if (defaults.select.fancyCorners) {
					$wrap.addClass('fancy');
				}

				// fill select value
				$value.children(':first').html(self.options[self.selectedIndex].text);
				$wrap.data('index', self.selectedIndex);

				// fill list with options
				$list.empty();

				if ($optgroups.length) {
					$optgroups.each(function(i) {
						var html = '',
							optNum = 0;

						html += '<div class="' + pref + '__select-optgroup' + (this.disabled ? ' disabled' : '') + '" data-index="' + i + '">';
						html += '<div class="' + pref + '__select-optgroup-inner">';
						html += '<span class="' + pref + '__select-optgroup-label">';
						html += '<span class="' + pref + '__select-optgroup-label-inner">' + this.label + '</span></span>';

						$(this).find('option').each(function() {
							var isDisabled = this.disabled || $(this).parent().attr('disabled'),
								isSelected = self.selectedIndex === optNum;

							html += '<div class="' + pref + '__select-option' + (isDisabled ? ' disabled' : '') + (isSelected ? ' selected' : '') + '" data-index="' + this.index + '" data-value="' + this.value + '">';
							html += '<div class="' + pref + '__select-option-inner">' + this.text + '</div></div>';

							optNum++;
						});

						html += '</div></div>';

						$list.append(html);
					});
				} else {
					$this.find('option').each(function(j) {
						var html = '',
							isSelected = self.selectedIndex === j;

						html += '<div class="' + pref + '__select-option' + (this.disabled ? ' disabled' : '') + (isSelected ? ' selected' : '') + '" data-index="' + this.index + '" data-value="' + this.value + '">';
						html += '<div class="' + pref + '__select-option-inner">' + this.text + '</div></div>';

						$list.append(html);
					});
				}

				// set event listeners
				$this.on('focus', function() {
					$wrap.addClass('focus').css('z-index', '32767');

					if (defaults.debug && console.log) {
						console.log('Select focused');
					}
				}).on('blur', function(e) {
					if (!$wrap.hasClass('multiple')) {
						$list.hide(0);
						$wrap[0].opened = false;
					}

					$wrap.removeClass('focus').css('z-index', 'auto');

					if (defaults.debug && console.log) {
						console.log('Select blured');
					}
				}).on('keyup', function(e) {
					if (!$wrap.hasClass('multiple')) {
						if (e.keyCode === 13 || e.keyCode === 27) { // enter | escape
							$list.hide(0);
							$wrap[0].opened = false;
						}

						$list.find('div[data-value]').removeClass('selected').eq(this.selectedIndex).addClass('selected');

						$value.children(':first').html(self.options[this.selectedIndex].text);
					}
				});

				$wrap.on('mouseenter', function(e) {
					e.preventDefault();

					if (self.disabled) {
						return false;
					}

					$(this).addClass('hover');

					if (defaults.debug && console.log) {
						console.log('Pseudo-select mouseenter');
					}
				}).on('mouseleave', function(e) {
					e.preventDefault();

					$(this).removeClass('hover');

					if (defaults.debug && console.log) {
						console.log('Pseudo-select mouseleave');
					}
				}).on('mousedown', function(e) {
					e.preventDefault();

					$(this).addClass('active');

					if (defaults.debug && console.log) {
						console.log('Pseudo-select mousedown');
					}
				}).on('mouseup', function(e) {
					e.preventDefault();

					$(this).removeClass('active');

					if (defaults.debug && console.log) {
						console.log('Pseudo-select mouseup');
					}
				}).on('click', function(e) {
					e.preventDefault();

					if (self.disabled) {
						return false;
					}

					if (!$wrap.hasClass('multiple')) {
						if (!this.opened) {
							$list.show(0);
							this.opened = true;
						} else {
							$list.hide(0);
							this.opened = false;
						}
					}

					$this.trigger('focus');

					if (defaults.debug && console.log) {
						console.log('Pseudo-select click');
					}
				});

				$list.find('div[data-value]').on('mouseenter', function(e) {
					e.preventDefault();

					if ($wrap.hasClass('multiple')) {
						return false;
					}

					$(this).addClass('hover');

					if (defaults.debug && console.log) {
						console.log('Pseudo-select option mouseenter');
					}
				}).on('mouseleave', function(e) {
					e.preventDefault();

					if ($wrap.hasClass('multiple')) {
						return false;
					}

					$(this).removeClass('hover');

					if (defaults.debug && console.log) {
						console.log('Pseudo-select option mouseleave');
					}
				}).on('mouseup', function(e) {
					e.stopPropagation();
					e.preventDefault();
				}).on('mousedown', function(e) {
					var $this = $(this),
						val = $wrap.data('values') || [self.options[self.selectedIndex].value];

					e.stopPropagation();
					e.preventDefault();

					if ($this.hasClass('disabled')) {
						return false;
					}

					if (!$wrap.hasClass('multiple')) {
						$list.hide(0);
						$wrap[0].opened = false;
					}

					self.selectedIndex = $this.data('index');

					if (!$wrap.hasClass('multiple') || !e.ctrlKey) {
						$wrap.removeData('values');

						$list.find('div[data-value]').removeClass('selected');

						$value.children(':first').html(self.options[self.selectedIndex].text);
					} else {
						val.push($this.data('value'));
						$wrap.data('values', val);

						$(self).val($wrap.data('values'));
					}

					$this.addClass('selected');

					if (defaults.debug && console.log) {
						console.log('Pseudo-select option click');
						console.log('Selected index: ' + $this.data('index'));
						console.log('Selected value: ' + $this.data('value'));
					}
				}).on('keydown', function(e) {
					var $this = $(this),
						index = $wrap.data('index');

					e.preventDefault();

					if (e.keyCode === 38 || e.keyCode === 37) { // up | left
						index--;
					}

					if (e.keyCode === 40 || e.keyCode === 39) { // down | right
						index++;
					}
				});
			});
		}
	};

	$.fn.rFormStyler = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.rFormStyler');
		} 
	};
})(jQuery, window, document);