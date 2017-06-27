"use strict";

(function(){
	
	function SthSelectPopup(){

		var _$popup = null;
		var _$title = null;
		var _$content = null;
		var _onSelectCallback = null;
		var _qntityOfItems = 0;

		/**
		 * Max of height (in pixels) that the popup can 
		 * assume when open.
		 */
		var MAX_HEIGHT = 500;

		/**
		 * Constructor.
		 * Creates the popup section element in the DOM.
		 * 
		 * The section is created only once. Several calls 
		 * does not have effect.
		 */
		(function create(){

			if(isAlreadyInDOM()){
				_$popup = $(".sth-select-popup");
				_$title = $(".sth-select-title");
				_$content = $(".sth-select-content");
				return;
			}

			_$popup = $('<section class="sth-select-popup"></section>');
			_$title = $('<div class="sth-select-title"></div>');
			_$content = $('<div class="sth-select-content"></div>');
			
			_$popup
				.append(_$title)
				.append(_$content)
				.appendTo( $("body") );
		})();

		/**
		 * Checks if the popup is already inserted in DOM.
		 * It prevents many insertions and performance loss.
		 */
		function isAlreadyInDOM(){
			let $alreadyExistent = $(".sth-select-popup");
			return ( $alreadyExistent && $alreadyExistent.length > 0 );
		}

		/**
		 * Shows the popup on the screen.
		 */
		function show(){
			let height = _calculatePopupHeight();
			_$popup.animate({height: height}, 500);
		}

		/**
		 * Calculates pop-up's height based on 
		 * number of added items.
		 */
		function _calculatePopupHeight(){
			let singleItemHeight = _$content
				.find(".sth-select-item")
				.first()
				.outerHeight();

			let qntityOfItems = _qntityOfItems;
			let allItemsHeight = (singleItemHeight * qntityOfItems);
			let titleHeight = _$popup.find(".sth-select-title").outerHeight();
			
			let contentHeight = (allItemsHeight + titleHeight);
			return contentHeight < MAX_HEIGHT ? contentHeight : MAX_HEIGHT;
		}

		/**
		 * Hides the popup on the screen.
		 */
		function hide(){
			_$popup.animate({height: 0}, 500);
		}

		/**
		 * Add an item.
		 */
		function addItem(item, autoRender){
			autoRender = autoRender || true;

			let text = item.text;
			let $listItem = $('<div class="sth-select-item">' + text + '</div>');

			if( autoRender )
				_$content.append( $listItem );

			return $listItem;
		}

		/**
		 * Adds many items.
		 * 
		 * #addItems() uses #addItem(), but renders all 
		 * added items at once for better performance.
		 */
		function addItems(items){
			_qntityOfItems = items.length;

			let $options = [];
			$.each(items, function(_, item){
				let $listItem = addItem(item, false);

				$options.push($listItem);

				$listItem.click(function(){
					_onSelectCallback(item);
					hide();
				});
			});

			_$content.append( $options );
		}

		/**
		 * Clear (removes from DOM) all elements on the list.
		 */
		function clear(){
			_$content.empty();
		}

		/**
		 * Event handler which calls a callback when an item 
		 * is selected.
		 */
		function onSelect(callback){
			_onSelectCallback = callback;
		}

		/**
		 * Sets the popup's title. 
		 */
		function setTitle(title){
			_$title.text(title);
		}

		return {
			show: show,
			hide: hide,
			addItem: addItem,
			addItems: addItems,
			clear: clear,
			onSelect: onSelect,
			setTitle: setTitle
		};
	}

	window.SthSelect = window.SthSelect || {};
	window.SthSelect.SthSelectPopup = SthSelectPopup;
})();