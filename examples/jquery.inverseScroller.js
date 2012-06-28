;(function ( $, window, document, undefined ) 
{

    var pluginName = 'inverseScroller',
        defaults = {
    		idPrefix: 'slider_',
    		next: null,
    		prev: null,
    		changeHash: true,
			inverseElement: null,
			vertical: false,
			itemsSelector: 'li',
			itemsContainerSelector: 'ul',
			currentItemClass: 'current'
        };

    function inverseScroller( element, options ) 
	{
        this.element = element;
        this.currentSlideIndex = 0;
        
        this.options = $.extend( {}, defaults, options);
		
		this.slidesCount = $(this.options.itemsSelector, this.element).length;
		this.itemsContainer = $(this.options.itemsContainerSelector, this.element);
        this._defaults = defaults;
        this._name = pluginName;

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
			this.itemsContainer.width(0);
			
			var items = $(this.options.itemsSelector, this.element);
			for ( var i = 0; i < items.length; i++ )
			{
				this.itemsContainer.width(this.itemsContainer.width() + $(items[i]).width());
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
			This.setCurrentIndex($(itemsSelector, $(mainElement)).index($(itemsSelector + '.' + currentItemClass, mainElement)) + 1);
		});
		this.options.prev.bind('click', function(e) {
			This.setCurrentIndex($(itemsSelector, $(mainElement)).index($(itemsSelector + '.' + currentItemClass, mainElement)) - 1);
		});
    };
    
    inverseScroller.prototype.setCurrentIndex = function (index) {
    	if ( index != this.currentSlideIndex ) {
    		this.currentSlideIndex = index;
    		this.invalidateNavigation();
    		
    		$(this.options.itemsSelector + '.' + this.options.currentItemClass, this.element).removeClass('current');
    		$(this.options.itemsSelector, this.element).eq(index).addClass(this.options.currentItemClass);
    		if ( this.options.vertical )
			{
			}
			else
			{				
				var items = $(this.options.itemsSelector, this.element), left = 0;
				for ( var i = 0; i < index; i++ )
				{
					left += $(items[i]).width();
				}
				$(this.element).stop(true, false).animate({scrollLeft: left}, { duration: 1000, easing: 'swing' });
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