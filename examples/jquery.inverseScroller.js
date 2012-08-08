;(function ( $, window, document, undefined ) 
{

    var pluginName = 'inverseScroller',
        defaults = {
    		next: null,
    		prev: null,
    		changeHash: true,
			inverseElement: null,
			itemsSelector: 'li',
			itemsContainerSelector: 'ul',
			step: 1,
			inverse: false,
			startPosition: 0,
			carousel: false,
			duration: 300,
			animateOnHover: false,
			autoscrollDuration: 300,
			easing: 'swing'
        };

    function inverseScroller( element, options ) 
	{
        this.element = element;
        this.currentSlideIndex;
		this.isAnimate = false;
        this.positionSet = [];
		this.lastPosition = {x: 0, y: 0, width: 0, height: 0};
        this.options = $.extend( {}, defaults, options);
		
		this.slidesCount = $(this.options.itemsSelector, this.element).length;
		this.itemsContainer = $(this.options.itemsContainerSelector, this.element);
        this._defaults = defaults;
        this._name = pluginName;
		this.items = $(this.options.itemsSelector, this.element);
		this.autoscroll = false;
        this.init();
    }

    inverseScroller.prototype.init = function () 
	{
    	if ( this.options.next != null && this.options.prev != null )
    	{
			if ( typeof this.options.next == 'string' )
			{
				this.options.next = $(this.options.next);
			}
			if ( typeof this.options.prev == 'string' )
			{
				this.options.prev = $(this.options.prev);
			}
    		this.initNavigation();
    	}
		
		if ( this.options.animateOnHover )
		{
			$(this.element).hover($.proxy(
				function(){
					this.autoscroll = true;
					if (!this.isAnimate)
					{
						this.setCurrentIndex(this.currentSlideIndex + this.options.step);
					}
				}, this),
				$.proxy(function(){
					this.autoscroll = false;
				}, this)
			)
		}
		if ( this.options.carousel )
		{
			$(this.options.itemsSelector, this.element).remove();
			this.itemsContainer.css({position: 'relative'});
			this.setCarouselIndex(this.options.startPosition);
			var element = $(this.getItemByIndex(this.options.startPosition));
			element.css({position: 'absolute', left: 0});
			this.itemsContainer.append(element);
			
		}
		else
		{
			for ( var i = 0; i < this.items.length; i++ )
			{
				this.positionSet[i] = {x: this.items[i].offsetLeft, y: this.items[i].offsetTop, width: $(this.items[i]).width(), height: $(this.items[i]).height()};
				if ( this.positionSet[i].x  + this.positionSet[i].width > this.lastPosition.x + this.lastPosition.width )
				{
					this.lastPosition.x = this.positionSet[i].x;
					this.lastPosition.width = this.positionSet[i].width;
				}
				if ( this.positionSet[i].y + this.positionSet[i].height > this.lastPosition.y + this.lastPosition.height )
				{
					this.lastPosition.y = this.positionSet[i].y;
					this.lastPosition.height = this.positionSet[i].height;
				}
			}
			this.setCurrentIndex(this.options.startPosition, false);
		}
		
		if ( this.options.inverse )
		{
			this.positionSet.reverse();
		}
		
    };
    
    inverseScroller.prototype.initNavigation = function () {
		this.invalidateNavigation();
		
		$(this.options.itemsSelector + ':first', this.element).addClass(this.options.currentItemClass);
		var This = this, mainElement = this.element, itemsSelector = this.options.itemsSelector, currentItemClass = this.options.currentItemClass;

		this.options.next.bind('click', function(e) {
			This.setCurrentIndex(This.currentSlideIndex + This.options.step);
		});
		this.options.prev.bind('click', function(e) {
			This.setCurrentIndex(This.currentSlideIndex - This.options.step);
		});
    };
    
	inverseScroller.prototype.test = function (event) {
	
	}
	
    inverseScroller.prototype.setCurrentIndex = function (index, animate) {
		animate = typeof animate !== 'undefined' ? animate : true;
		if ( this.options.carousel )
		{
			if ( index != this.currentSlideIndex && !this.isAnimate ) 
			{
				this.isAnimate = true;
				var left = this.itemsContainer.width();
				var This = this;
				if (index > this.currentSlideIndex)
				{
					
					$(this.options.itemsSelector, this.element).each(function () {
						$(this).stop(true, false).animate({left: parseInt($(this).css('left')) - left}, { duration: This.options.duration, easing: This.options.easing, complete: function(){This.setCarouselIndex(index);}});
					});
				}
				else
				{
					$(this.options.itemsSelector, this.element).each(function () {
						$(this).stop(true, false).animate({left: parseInt($(this).css('left')) + left}, { duration: This.options.duration, easing: This.options.easing, complete: function(){This.setCarouselIndex(index);}});
					});
				}
			}
		}
		else
		{
			if ( index < 0 ) 
			{
				index = 0;
			}
			if ( index > this.items.length ) 
			{
				index = this.items.length;
			}
			
			if ( index != this.currentSlideIndex ) 
			{
				this.currentSlideIndex = index;
				this.invalidateNavigation();
				if ( animate )
				{
					
					$(this.element).stop(true, false).animate({scrollLeft: this.positionSet[index].x, scrollTop: this.positionSet[index].y}, { duration: 300, easing: this.options.easing });
				}
				else
				{
					$(this.element).scrollLeft(this.positionSet[index].x);
					$(this.element).scrollTop(this.positionSet[index].y);
				}
			}
		}
    }
	
	inverseScroller.prototype.setCarouselIndex = function (index) {

		$(this.options.itemsSelector, this.element).each(function () {
			if ( parseInt($(this).css('left') != 0) )
			{
				$(this).remove();
			}
		});
		var left = 0;
		for ( var i = index - 1; i >= index - this.options.step; i-- )
		{
			var element = $(this.getItemByIndex(i));
			left -= this.itemsContainer.width();
			element.css({position: 'absolute', left: left});
			this.itemsContainer.append(element);
		}
		left = 0;
		for ( var i = index + 1; i <= index + this.options.step; i++ )
		{
			var element = $(this.getItemByIndex(i));
			left += this.itemsContainer.width();
			element.css({position: 'absolute', left: left});
			this.itemsContainer.append(element);
		}
		this.currentSlideIndex = index;
		if ( this.autoscroll )
		{
			var This = this;
			setTimeout(function () {
				if ( This.autoscroll ) 
				{
					This.setCurrentIndex(index + 1)
				}
			}, This.options.autoscrollDuration);
		}
		this.isAnimate = false;
	}
	
	inverseScroller.prototype.getItemByIndex = function (index) {
		if ( index < 0 )
		{
			return this.items[this.items.length + ( index % this.items.length )];
		}
		return this.items[(index % this.items.length)];
	}

    inverseScroller.prototype.invalidateNavigation = function () {
	
		if ( !this.options.carousel )
		{
			if ( this.currentSlideIndex == 0 )
			{
				this.options.prev.hide();
			}
			
			if ( this.currentSlideIndex == this.slidesCount - 1 )
			{
				this.options.next.hide();
			}
			
			if ( this.currentSlideIndex > 0 )
			{
				this.options.prev.show();
			}
			
			if ( this.currentSlideIndex < this.slidesCount - 1 )
			{
				this.options.next.show();
			}
		}
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