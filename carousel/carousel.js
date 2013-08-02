/** Copyright 2012-2013 Stephen Baker ~ Dragon Bits, LLC. */ 
(function($) {
	$.carousel = function(el, options, $set, callback) {
		var controlsMade = false;
		var t = this;
		t.timer = false;
		
		t.init = function() {
			t.settings = $.extend({}, $.carousel.defaults, options);
			
			// Validate settings
			if (typeof t.settings.prevBtnInner != 'function' || typeof t.settings.nextBtnInner != 'function') {
				$.error($set.selector + ': prevBtnInner and nextBtnInner must be functions');
			}

			if (t.settings.mode.toLowerCase() == 'continious') t.settings.transition = 'slide';

			// Wrap Elements
			if (t.settings.wrapAt) {
				var z, $eles = $(el).find(t.settings.wrapTag);
				
				if (!$eles.length) $.error($set.selector + ': Wrap at was unable to find the set selector "' + t.settings.wrapTag + '"');
				
				$eles.wrapAll('<ul />').each(function(i) {
					if (i % parseInt(t.settings.wrapAt) == 0 && i) {
						z = i;
						$eles.slice((i-parseInt(t.settings.wrapAt)),i).wrapAll('<li />');
					}
				}).slice(z, $eles.length).wrapAll('<li />');
			}

			// Find the UL
			if ($(el)[0].nodeName.toLowerCase() != 'ul') {
				if (!$(el).find('ul').length) $.error($set.selector + ': Carousel requires there be a UL within the provided element');
				else t.$ul = $(el).find('ul');
			} else t.$ul = $(el);

			// Setup necessary values if they were not provided
			if (!t.settings.step) t.settings.step = t.settings.show
			if ((t.settings.mode.toLowerCase() == 'auto' || t.settings.mode.toLowerCase() == 'continious') && t.settings.wrap.toLowerCase() == 'none') t.settings.wrap = 'circular';
			
			// Determine Carousel Type
			switch (t.settings.direction.toLowerCase()) {
			case 'vert':
			case 'tb':
			case 'bt':
				t.settings.TYPE = 'vertical';
				break;
			case 'horz':
			case 'rtl':
			case 'ltr':
				t.settings.TYPE = 'horizontal';
				break;

			default: $.error($set.selector + ': Provided direction is unrecgonized');
			}

			// Determine duration and speed settings
			switch (t.settings.mode.toLowerCase()) {
			case 'auto': 
				t.settings.duration = t.settings.duration ? t.settings.duration : 3000;               // Amount of time between rotations
				t.settings.speed    = (function() { 
					switch (t.settings.transition.toLowerCase()) {
					case 'slide':
						return t.settings.speed ? t.settings.speed : 250 * t.settings.step;
						break;
					case 'fade':
					case 'crossfade':
					case 'xfade':
						return t.settings.speed ? t.settings.speed : 500;
						break;
						
					default: $.error($set.selector + ': Unknown transition effect: ' + t.settings.transition);
					}
				})();
				break;
			case 'continious':
				t.settings.duration = t.settings.duration ? t.settings.duration : 800
				break;
			case 'manual':
				t.settings.speed = (function() { 
					switch (t.settings.transition.toLowerCase()) {
					case 'slide':
						return t.settings.speed ? t.settings.speed : 250 * t.settings.step;
						break;
					case 'fade':
					case 'crossfade':
					case 'xfade':
						return t.settings.speed ? t.settings.speed : 500;
						break;
						
					default: $.error($set.selector + ': Unknown transition effect: ' + t.settings.transition);
					}
				})();
				break;
				
			default:
				$.error($set.selector + ': Unrecgonized mode');
			}

			// Wrap the UL in the stage and the stage in the wrapper and add carousel class to UL
			t.$ul.wrap($('<div />').addClass('carousel-wrapper').addClass(t.settings.TYPE));
			t.$ul.wrap($('<div />').addClass('stage'));
			t.$ul.wrap($('<div />').addClass('mask'));
			t.$ul.addClass('carousel');

			// Store Wrapper, Stage and Mask
			t.$mask = t.$ul.parent();
			t.$stage = t.$mask.parent();
			t.$wrapper = t.$stage.parent();

			// If the buffer setting is on we cannot allow Margin in the bottom or right positions...
			if (t.settings.buffer) {
				t.$ul.find('>li').each(function() {
					if (parseInt($(this).css(t.settings.TYPE.substr(0,1) == 'v' ? 'margin-bottom' : 'margin-right') > 0))
						$(this).css(t.settings.TYPE.substr(0,1) == 'v' ? 'margin-bottom' : 'margin-right', 0);
				});
			}

			// Determine the LI Gap, which is the amount of space between LI elements due to margin
			if (t.settings.TYPE.substr(0,1) == 'v') {
				if (parseInt(t.$ul.find('>li:eq(0)').css('margin-top')) != parseInt(t.$ul.find('>li:eq(0)').css('margin-top'))) 
					t.settings.LIGAP = Math.max(parseInt(t.$ul.find('>li:eq(0)').css('margin-top')),parseInt(t.$ul.find('>li:eq(0)').css('margin-top')) );
				else t.settings.LIGAP = parseInt(t.$ul.find('>li:eq(0)').css('margin-top'));
			} else t.settings.LIGAP = t.$ul.find('>li:eq(0)').outerWidth(true) - t.$ul.find('>li:eq(0)').width();

			// Determine the usable area. This is the amount of space that an li will take up (So its the total amount of space avalialbe minus the gap between LIs from margins)
			t.settings.USABLEAREA = (t.settings.maskSize - (t.settings.LIGAP * t.settings.show) - (t.settings.buffer ? t.settings.LIGAP : 0));
			
			// Set LI size by diving the usable area by the requested show, then store the result
			t.$ul.find('>li').css(t.getSizeTerm(), Math.floor(t.settings.USABLEAREA / t.settings.show));
			t.settings.LISIZE = (t.settings.TYPE.substr(0,1) == 'v' ? t.$ul.find('>li:eq(0)').height() : t.$ul.find('>li:eq(0)').width()) + t.settings.LIGAP;
			
			// Determine pages by diving the total number of LIs by the requested show
			t.settings.PAGES = Math.ceil(t.$ul.find('>li').length / t.settings.show);
			
			// Determine the mask size by multiplying the show by the size of the LI, adding in another gap space if a buffer is requested, this should always be the same as the requested mask size
			t.settings.MASKSIZE = (t.settings.show * t.settings.LISIZE + (t.settings.buffer ? t.settings.LIGAP : 0));

			// Set the mask size. If the LISIZE calculation has a remainder (modolus) add it back on as a margin
			t.$mask.css((t.getSizeTerm()), t.settings.MASKSIZE + 'px');
			if (t.settings.USABLEAREA % t.settings.show != 0) t.$mask.css((t.settings.TYPE.substr(0,1) == 'v' ? 'margin-bottom' : 'margin-right'), t.settings.USABLEAREA % t.settings.show);

			t.$ul.find('>li').each(function() {
				$(this).data('index', $(this).index());
			});

			// Setup for circular wrap if needed
			if (t.settings.wrap.toLowerCase() == 'circular') {
				if (t.$ul.find('>li').length % t.settings.show != 0) {
					var $cloneTarget = t.$ul.find('>li');
					for (var count=1; count<t.settings.show;count++) {
						t.$ul.append($cloneTarget.clone(true).addClass('cloned'));
					}
				}
				
				if (t.$ul.find('>li').length % t.settings.show == 0 && t.settings.transition.toLowerCase() != 'xfade' && t.settings.transition.toLowerCase() != 'crossfade') {
					t.$ul.find('>li').slice(-t.settings.show).clone().addClass('cloned').prependTo(t.$ul);
					t.$ul.find('>li').slice(t.settings.show, t.settings.show*2).clone().addClass('cloned').appendTo(t.$ul);
				}
				
				t.$ul.css(t.settings.TYPE.substr(0,1) == 'v' ? 'top' : 'left', -(t.settings.LISIZE * t.settings.show) + 'px');
			}
			
			// Ensure the UL is the proper Size (Mathmatics rely on this)
			t.$ul.css((t.settings.TYPE.substr(0,1) == 'v' ? 'height' : 'width'), (t.settings.LISIZE * t.$ul.find('>li').length));

			// If the carousel is horizontal we'll need to adjust it's height once all the images load...
			if (t.settings.TYPE.substr(0,1) == 'h') {
				if (t.$wrapper.find('img').length) {
					$(window).load(function() {
						t.$mask.css('height', (function() {
							var height = 0;
							t.$ul.find('>li').each(function() {
								height = $(this).outerHeight(true) > height ? $(this).outerHeight(true) : height;
							});
							return height;
						})());
					});
				} else t.$mask.css('height', t.$ul.outerHeight(true));
			}

			// Setup For Transitions
			// Cross Fade
			if (t.settings.transition.toLowerCase() == 'crossfade' || t.settings.transition.toLowerCase() == 'xfade') {
				var z, $eles = t.$ul.find('>li');

				$eles.each(function(i) {
					if (i % parseInt(t.settings.show) == 0 && i) {
						z = i;
						$eles.slice((i-parseInt(t.settings.show)),i).wrapAll($('<ul />')).parent().wrap($('<li />').addClass('xfade').css(t.getSizeTerm(), t.$mask.css(t.getSizeTerm())));
					}
				}).slice(z, $eles.length).wrapAll($('<ul />')).parent().wrap($('<li />').addClass('xfade').css(t.getSizeTerm(), t.$mask.css(t.getSizeTerm())));

				t.$ul.css(t.settings.TYPE.substr(0,1) == 'v' ? 'top' : 'left', 0).find('>li:gt(0)').hide();
				t.$wrapper.addClass('xfade');
			}
			
			// Add Control Elements... Wait for images as some of the math requires all calculations be complete
			if (t.$wrapper.find('img').length) {
				$(window).load(function() {
					t.makeControls();
				});
			} else t.makeControls();
			
		}

		/*========================================
		  INTERNAL LOGIC
		  ======================================*/
		t.rotate = function(type, step) {
			if ((function() {
				r = true;
				t.$ul.add($('>li', t.$ul)).each(function() {
					if (r)
						r = $(this).is(':not(:animated)');
				})
					return r;
			})()) {
				var isPage = typeof type == 'number',
				step = (step == null) ? t.settings.step : step,
				moveTo = isPage
					? -((type * t.settings.show - t.settings.show) * t.settings.LISIZE + ((t.settings.wrap.toLowerCase() == 'circular' ? t.settings.show : 0) * t.settings.LISIZE))
				    : (t.settings.LISIZE * step) * (type == 'next' ? -1 : 1) + t.getCurrentPosition(),
				animationsettings = t.settings.TYPE.substr(0,1) == 'v' ? {top: moveTo + 'px'} : {left: moveTo + 'px'}, 
                rotationCallback = function() {
					// Reposition if Circular Wrapping is enabled
					if (t.settings.wrap.toLowerCase() == 'circular')
						t.executeCircularWrap();
					
					
					// Adjust Pagination Active element - Using <= 1 to account for a show of 1 or greater than 1...
					if ($('.pages li', t.$wrapper).length && t.getCurrentLI() % t.settings.show <= 1) {
						$page = $('.pages li', t.$wrapper).removeClass('active').eq(t.getCurrentPage()-1).addClass('active');
					} else $page = null;
					
					if (t.isAuto()) t.restartAuto();
					if (typeof(t.settings.afterRotate) == 'function') t.settings.afterRotate($page || null);

				},
				checkForDisableButtons = function() {
					// Enable / Disable Next and Previous buttons if NO wrap is enabled
					if (t.settings.wrap.toLowerCase() == 'none') {
						t.$wrapper.find('.btn').removeClass('disabled');
						if (t.settings.transition.toLowerCase() == 'crossfade' || t.settings.transition.toLowerCase() == 'xfade') {
							if (t.$ul.find('>li:visible').is(':first-child')) t.$wrapper.find('.previous').addClass('disabled');
							else if (t.$ul.find('>li:visible').is(':last-child')) t.$wrapper.find('.next').addClass('disabled');
						} else {
							if (moveTo >= 0 || moveTo <= -(t.getWidth() - (t.settings.show * t.settings.LISIZE))) {
								t.$wrapper.find('.' + ((typeof type == 'number' && type > t.getCurrentPage()) || type == 'next' ? 'next' : 'previous') ).addClass('disabled');
							}
						}
					}
				};
				
				if (typeof(t.settings.beforeRotate) == 'function') t.settings.beforeRotate($('.pages li.active', t.$wrapper));
				
				switch (true) {
				case t.settings.transition.toLowerCase() == 'crossfade' || t.settings.transition.toLowerCase() == 'xfade': 
					var $this = t.$ul.find('>li:visible'), $next = (function() {
						if (isPage) {
							return t.$ul.find('>li:eq(' + (type-1) + ')');
						} else if (type == 'next')
							return $this.next().length ? $this.next() : t.$ul.find('>li:eq(0)');
						else
							return $this.prev().length ? $this.prev() : t.$ul.find('>li:last');
					})();

					if (t.isAuto()) t.stopAuto();
					$this.fadeOut(t.settings.speed);
					$next.fadeIn(t.settings.speed, function() {
						if (isPage) $page = $('.pages li', t.$wrapper).removeClass('active').eq(type-1).addClass('active');
						else $page = $('.pages li', t.$wrapper).removeClass('active').eq($next.index()).addClass('active');

						checkForDisableButtons();
						if (t.isAuto()) t.startAuto();
						if (typeof(t.settings.afterRotate) == 'function') t.settings.afterRotate($page || null);

					});
					break;
				case t.settings.transition.toLowerCase() == 'fade' && t.settings.mode.toLowerCase() != 'continious':
					checkForDisableButtons();
					t.$ul.fadeOut(t.settings.speed, function() {
						t.$ul.css(animationsettings).fadeIn(t.settings.speed, rotationCallback);
						if (t.isAuto()) t.restartAuto();
					});
					break;
					
				default:
					checkForDisableButtons();
					t.$ul.animate(animationsettings, t.settings.speed, rotationCallback);
				}
			}
		};

		t.isAuto = function() {
			return t.settings.mode.match(/continious|auto/i);
		};

		t.restartAuto = function() {
			t.stopAuto();
			t.startAuto();
		};
		
		t.startAuto = function() {
			if (t.settings.mode.toLowerCase() == 'continious') {
				
				t.startContiniousSlide();
				if (!t.settings.makePlayPause) {
					t.$wrapper.mouseenter(function() {
						t.stopAuto();
					});
					t.$wrapper.mouseleave(function() {
						t.startContiniousSlide();
					});
				}
				
			} else {
				t.timer = window.setInterval(function() {
					switch (t.settings.direction.toLowerCase()) {
					case 'vert':
					case 'horz':
					case 'ltr':
					case 'tb':
						t.rotate('next');
						break;
					case 'rtl':
					case 'bt':
						t.rotate('previous');
						break;
						
					default: $.error($set.selector + ': Unknown direction supplied');
					}
				}, t.settings.duration);
			}

			if (t.$playPause)
				t.$playPause.find('>span').removeClass('play').addClass('pause');
		};

		t.stopAuto = function() {
			if (t.settings.mode.toLowerCase() == 'continious') t.$ul.stop();
			else if (t.timer) window.clearInterval(t.timer);

			if (t.$playPause)
				t.$playPause.find('>span').removeClass('pause').addClass('play');
		}

		t.startContiniousSlide = function() {
			var animationsettings = 
				t.settings.TYPE.substr(0,1) == 'v' 
				    ? {top: -(t.getWidth() - (t.settings.show * t.settings.LISIZE))} 
			        : {left: -(t.getWidth() - (t.settings.show * t.settings.LISIZE))};

			t.$ul.animate(animationsettings, (((t.$ul.find('>li').length - t.settings.show * 2) - t.getCurrentLI()) * t.settings.duration), 'linear',  function() {
				t.executeCircularWrap();
				t.startContiniousSlide();
			});
		}

		t.executeCircularWrap = function() {
			if (Math.abs(t.getCurrentPosition()) >= Math.abs(t.getWidth() - (t.settings.show * t.settings.LISIZE))) {
				t.$ul.css(t.settings.TYPE.substr(0,1) == 'v' ? 'top' : 'left', -(t.settings.show * t.settings.LISIZE) + 'px');
			} else if (Math.abs(t.getCurrentPosition()) == 0) {
				t.$ul.css(t.settings.TYPE.substr(0,1) == 'v' ? 'top' : 'left', -(t.getWidth() - ((t.settings.show * 2) * t.settings.LISIZE)) + 'px');
			}
		};

		t.getCurrentLI = function() {
			// Current X/Y Position divided by total number of LIs gives the currently visible LIs index, +1 accounts for that being 0 indexed. circular subtracting show accounts for circular wrapping mode prepending show to the ul
			return ((Math.abs(t.getCurrentPosition()) / t.settings.LISIZE) + 1) - (t.settings.wrap.toLowerCase() == 'circular' ? t.settings.show : 0);
		};

		t.getCurrentPage = function() {
			// Given the current LI, dividing by show will give us a fractional value that is always the exact page number OR a fraction between n and (n-1), so Math.ceil will round us up.
			// Think of it like this... a show of 4 with 12 LIs gives us 3 pages. Assuming we're at LI #5; 5 / 4 = 1.25, Math.ceil(1.25) == 2;
			return Math.ceil(t.getCurrentLI() / t.settings.show);
		}

		t.getCurrentPosition = function() {
			return t.settings.TYPE.substr(0,1) == 'v' ? t.$ul.position().top : t.$ul.position().left;
		}
		
		t.getWidth = function() {
			return t.settings.TYPE.substr(0,1) == 'v' ? t.$ul.height() : t.$ul.width();
		}

		/*========================================
		  SETUP FUNCTIONS
		  ======================================*/
		// For Binding Events.
		t.bindEvents = function() {
			if (t.settings.mode.toLowerCase() == 'auto' || t.settings.mode.toLowerCase() == 'continious') t.startAuto();
				
			$('.previous', t.$wrapper).click(function(e) {
				e.preventDefault();
				t.stopAuto();
				if ($(this).is(':not(.disabled)'))
					t.rotate('previous');
			});
			$('.next', t.$wrapper).click(function(e) {
				e.preventDefault();
				t.stopAuto();
				if ($(this).is(':not(.disabled)'))
					t.rotate('next');
			});
			$('.pages li', t.$wrapper).click(function(e) {
				e.preventDefault();
				if ($(this).is(':not(.active)'))
					t.rotate($(this).prevAll().length + 1);
			});

			$('.playPause', t.$wrapper).click(function(e) {
				if (t.$playPause.find('>span').is('.play')) t.startAuto();
				else t.stopAuto();
			});
		};

		t.makeControls = function() {
			if (!controlsMade) {
				// Left / Right Control Elements
				if (t.settings.makeControls) t.makeBtns();
				
				// Pagination
				if (t.settings.makePagination && (t.settings.transition.toLowerCase() == 'crossfade' || t.settings.transition.toLowerCase() == 'xfade')) {
					t.settings.PAGES = t.$ul.find('>li.xfade').length;
					t.makePagination();
				} else if ( t.settings.makePagination && t.settings.mode.toLowerCase() != 'continious' 
					 && (t.settings.wrap.toLowerCase() != 'circular' || t.$ul.find('>li:not(.cloned)').length % t.settings.show == 0)) 		     
					     t.makePagination();
				
				// Play Pause Button
				if (t.settings.makePlayPause) t.makePlayPause();

				t.bindEvents();
				controlsMade = true;
				
				if (typeof t.settings.onComplete == 'function') t.settings.onComplete(t.settings);
				
				if (typeof callback == 'function' && $set.filter(':last')[0] === $(el)[0]) callback(); 
			}
		};

		// Makes teh Play/Pause button. Takes into account the orentation of the rotator
		t.makePlayPause = function() {
			if (t.settings.mode.toLowerCase() == 'auto' || t.settings.mode.toLowerCase() == 'continious') {
				t.$playPause = $('<div />').addClass('playPause').append($('<span />').addClass('play'));
				t.$wrapper.append(t.$playPause);
				
				if (t.settings.TYPE.substr(0,1) == 'h') {
					t.$wrapper.css('height', t.$wrapper.height() + Math.abs((t.settings.makePagination && t.$pages ? t.$pages.height() - t.$playPause.height() : t.$playPause.height())));
				} else {
					t.$wrapper.css('width', t.$wrapper.width() + Math.abs((t.settings.makePagination && t.$pages ? t.$pages.width() - t.$playPause.width() : t.$playPause.width())));
				}

			}
		};

		// Makes The Previous/Next buttons. Takes into account the orentation of the rotator
		t.makeBtns = function() {
			var offset = 0;
			t.$mask.before($('<div />').addClass('previous btn' + (t.settings.wrap.toLowerCase() == 'none' ? ' disabled' : '')).html($('<span />').html(t.settings.prevBtnInner())));
			t.$mask.after($('<div />').addClass('next btn' + (t.settings.wrap.toLowerCase() == 'none' && t.settings.PAGES < 2 ? ' disabled' : '')).html($('<span />').html(t.settings.nextBtnInner())));

			if (t.$stage.find('.btn').css('position').toLowerCase() != 'absolute') {
				if (t.settings.TYPE.substr(0,1) == 'v') {
					t.$stage.find('.btn').css('width', t.$mask.width());
					
					// Determine Offset size
					t.$stage.find('.btn').each(function() { offset += $(this).outerHeight(true); });
					
					// Setup high level structural widths
					t.$stage.css('height', t.$mask.outerHeight(true) + offset);
					t.$wrapper.css('height', t.$stage.outerHeight(true));
					
				} else if (t.settings.TYPE.substr(0,1) == 'h') {
					var minHeight = parseInt(t.$stage.find('.btn:eq(0) span').css('min-height'));
					
					// Determine Offset size
					t.$stage.find('.btn').each(function() { offset += $(this).outerWidth(true); });
					
					// Setup high level structural widths
					t.$stage.css('width', t.$mask.outerWidth(true) + offset);
					t.$wrapper.css('width', t.$stage.outerWidth(true));
					
					// Modify left/right button heights and vertical offsets
					t.$stage.find('.btn').css('height', (t.$mask.height() > minHeight ? t.$mask.height() : minHeight))
						.find('span').css('margin-top', '-' + (Math.floor(t.$stage.find('.btn span:eq(0)').outerHeight(true)/2)) + 'px');
					
				} else $.error($set.selector + ': Unable to size buttons due to unrecgonized TYPE value');
			}
		};
		
		// Makes the Pagination. Takes into account the orentation of the rotator
		t.makePagination = function() {
			var $pages = $('<ul />').addClass('pages');
			for (var i = 1; i <= t.settings.PAGES; i++) {
				$pages.append($('<li />').html(t.settings.pageInner(i)).attr('rel', i));
			}
			t.$pages = $pages;
			t.$pages.find('li:first-child').addClass('active');
			t.$wrapper.append(t.$pages);

			if (t.settings.TYPE.substr(0,1) == 'v') {
				t.$pages.css('margin-top', '-' + (Math.floor(t.$pages.height()/2)) + 'px');
				t.$mask.css('width', (t.$wrapper.outerWidth(true) - t.$pages.outerWidth(true) - t.$pages.find('>li:eq(0)').outerHeight(true))+"px");
			} else if (t.settings.TYPE.substr(0,1) == 'h') {
				t.$pages.css('margin-left', ('-' + (Math.floor(t.$pages.width()/2)) + 'px'));
				t.$wrapper.height(t.$wrapper.height() + t.$pages.outerHeight(true));
			} else $.error($set.selector + ': Unable to setup pagination due to unrecgonized TYPE value');

		};
		/*========================================
		  ABSTRACTED (repetitive) LOGIC
		  ======================================*/
		t.getSizeTerm = function() {
			return t.settings.TYPE.substr(0,1) == 'v' ? 'height' : 'width';
		};
		
		t.init();
	}
	
	$.carousel.defaults = {
		// Control Elements
		makeControls: true,
		makePagination: false,
		makePlayPause: false,
		// Behaviour
		direction: 'tb',
		duration: false,
		speed: false,
		step: false,
		show: 4,
		wrap: 'circular', // Circular (continous) or none (No Wrap)
		mode: 'manual', // Auto (Auto Rotate), Manual (Requires User Input) or Continious (Never Stops, save for user interaction)
		transition: 'slide',
		buffer: false,
		// Wrapping Behaviour
		wrapTag: '>div',
		wrapAt: false, // Needs a better name?
		// Sizes
		maskSize: 88,
		// Labels
		prevBtnInner: function() { return '&nbsp;' },
		nextBtnInner: function() { return '&nbsp;' },
		pageInner: function(i) { return '&nbsp;' },
		// Callbacks (more to come)
		onComplete: null,
		beforeRotate: null,
		afterRotate: null
	}

	$.fn.carousel = function(options, callback) {
		if (typeof options == 'function') {
			if (typeof callback  == 'object') var t = callback, callback = options, options = t;
			else callback = options, options  = {};
		}

		if ((typeof(options)).match('object|undefined')) {
			var $set = this;
			this.each(function(i) {
				(new $.carousel(this, options, $set, callback));
			});
		}
		return this;
	}
})(jQuery);