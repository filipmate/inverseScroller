;(function ( $, window, document, undefined ) 
{

    var pluginName = 'inverseScroller',
        defaults = {
    		next: null,
    		prev: null,
    		changeHash: true,
			inverseElement: null,
			vertical: false,
			itemsSelector: 'li',
			itemsContainerSelector: 'ul',
			currentItemClass: 'current',
			step: 1
        };

    function inverseScroller( element, options ) 
	{
        this.element = element;
        this.currentSlideIndex = 0;
        this.positionSet = [];
		this.lastPosition = {x: 0, y: 0, width: 0, height: 0};
        this.options = $.extend( {}, defaults, options);
		
		this.slidesCount = $(this.options.itemsSelector, this.element).length;
		this.itemsContainer = $(this.options.itemsContainerSelector, this.element);
        this._defaults = defaults;
        this._name = pluginName;
		this.items = $(this.options.itemsSelector, this.element);
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
    	if ( this.options.vertical )
		{
		}
		else
		{
			for ( var i = 0; i < this.items.length; i++ )
			{
				console.log($(this.items[i]).position());
				console.log(this.items[i].offsetLeft);
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
		}
    	if ( this.options.inverseElement && this.options.inverseElement.length > 0 )
		{
			var diff = parseInt(this.options.inverseElement.height() - $('.item:last', this.options.inverseElement).height());
			this.options.inverseElement.css({top: '-' + diff + 'px'});
		}
    };
    
    inverseScroller.prototype.initNavigation = function () {
		this.invalidateNavigation();
		
		$(this.options.itemsSelector + ':first', this.element).addClass(this.options.currentItemClass);
		var This = this, mainElement = this.element, itemsSelector = this.options.itemsSelector, currentItemClass = this.options.currentItemClass;

		this.options.next.bind('click', function(e) {
			This.setCurrentIndex($(itemsSelector, $(mainElement)).index($(itemsSelector + '.' + currentItemClass, mainElement)) + This.options.step);
		});
		this.options.prev.bind('click', function(e) {
			This.setCurrentIndex($(itemsSelector, $(mainElement)).index($(itemsSelector + '.' + currentItemClass, mainElement)) - This.options.step);
		});
    };
    
    inverseScroller.prototype.setCurrentIndex = function (index) {
		if ( index < 0 ) {
			index = 0;
		}
		if ( index > this.items.length ) {
			index = this.items.length;
		}
		
    	if ( index != this.currentSlideIndex ) {
    		this.currentSlideIndex = index;
    		this.invalidateNavigation();
    		$(this.options.itemsSelector + '.' + this.options.currentItemClass, this.element).removeClass('current');
    		$(this.options.itemsSelector, this.element).eq(index).addClass(this.options.currentItemClass);
			$(this.element).stop(true, false).animate({scrollLeft: this.positionSet[index].x, scrollTop: this.positionSet[index].y}, { duration: 300, easing: 'swing' });
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