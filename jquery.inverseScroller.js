;(function ( $, window, document, undefined ) {

    var pluginName = 'inverseScroller',
        defaults = {
    		idPrefix: 'slider_',
    		navigation: true,
    		next: $('<div class="next"></div>'),
    		prev: $('<div class="prev"></div>'),
    		changeHash: true
        };

    function inverseScroller( element, options ) {
        this.element = element;
        this.currentSlideIndex = 0;
        this.slidesCount = $('li', this.element).length;
        
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    inverseScroller.prototype.init = function () {
    	if ( this.options.navigation )
    	{
    		this.initNavigation();
    	}
    	
    	if ( this.options.inverseContent && this.options.inverseContent.length > 0 )
		{
			var diff = parseInt(this.options.inverseContent.height() - $('.item:last', this.options.inverseContent).height());
			this.options.inverseContent.css({top: '-' + diff + 'px'});
		}
    };
    
    inverseScroller.prototype.initNavigation = function () {
    	var $next = $(this.element).find(this.options.next);
		if ( $next.length <= 0 ) {
			$next = this.options.next;
			$(this.element).parent().append($next)
		}
		var $prev = $(this.element).find(this.options.prev);
		if ( $prev.length <= 0 ) {
			$prev = this.options.prev;
			$(this.element).parent().append($prev)
		}
		this.invalidateNavigation();
		
		$('li:first', this.element).addClass('current');
		var mainElement = this.element;
		var This = this;
		$next.bind('click', function(e) {
			This.setCurrentIndex($('li', $(mainElement)).index($('li.current', mainElement)) + 1);
		});
		$prev.bind('click', function(e) {
			This.setCurrentIndex($('li', $(mainElement)).index($('li.current', mainElement)) - 1);
		});
    };
    
    inverseScroller.prototype.setCurrentIndex = function (index) {
    	if ( index != this.currentSlideIndex ) {
    		this.currentSlideIndex = index;
    		this.invalidateNavigation();
    		
    		$('.item.current', this.element).removeClass('current');
    		$('.item', this.element).eq(index).addClass('current');
    		
    		var top = 0;
    		$('.item', this.element).each( function (i) {
    			if ( i < index ) {
    				top += $(this).height();
    			}
    		});    		
    		$(this.element).stop(true, false).animate({top: '-' + top + 'px'}, { duration: 1000, easing: 'easeOutExpo' });
    		top = 0;
    		var inverseIndex = ($('.item',this.options.inverseContent).length - 1) - index;
    		$('.item', this.options.inverseContent).each( function (i) {
    			if ( i < inverseIndex ) {
    				top += $(this).height();
    			}
    		});
    		this.options.inverseContent.stop(true, false).animate({top: '-' + top + 'px'}, { duration: 1000, easing: 'easeOutExpo' });
    		if ( this.options.changeHash )
    		{
    			window.location.hash = '#' + $('.item', this.element).eq(index).attr('id').replace(this.options.idPrefix, '');
    		}
    	}
    }

    inverseScroller.prototype.invalidateNavigation = function () {
    	if ( this.currentSlideIndex == 0 )
    		this.options.prev.hide();
		
		if ( this.currentSlideIndex == this.slidesCount - 1 )
			this.options.next.hide();
		
		if ( this.currentSlideIndex > 0 )
			this.options.prev.show();
		
		if ( this.currentSlideIndex < this.slidesCount - 1 )
			this.options.next.show();
    };
    
    inverseScroller.prototype.hashChangedHandler = function () {
    	//console.log('hashChanged');
    };



    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new inverseScroller( this, options ));
            }
        });
    }

})( jQuery, window, document );