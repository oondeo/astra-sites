jQuery( document ).on('click', '.theme-screenshot, .more-details, .theme-name, .install-theme-preview', function(event) {
	event.preventDefault();
	
	$this 	= jQuery( this ).parents( '.theme' );
	anchor 	= $this.find('.astra-demo-import');
	$this.addClass('theme-preview-on');

	renderDemoPreview( anchor );
});

jQuery( document ).on('click', '.close-full-overlay', function(event) {
	event.preventDefault();
	
	jQuery('.theme-install-overlay').css('display', 'none');
	jQuery('.theme-install-overlay').remove();
	jQuery( '.theme-preview-on' ).removeClass('theme-preview-on');
});

jQuery( document ).on('click', '.next-theme', function(event) {
	event.preventDefault();
	
	currentDemo = jQuery( '.theme-preview-on' )
	currentDemo.removeClass('theme-preview-on');
	nextDemo = currentDemo.nextAll('.theme');
	nextDemo.addClass( 'theme-preview-on' );

	anchor 		= nextDemo.find('.astra-demo-import');
	renderDemoPreview( anchor );
});

jQuery( document ).on('click', '.previous-theme', function(event) {
	event.preventDefault();
	
	currentDemo = jQuery( '.theme-preview-on' );
	currentDemo.removeClass('theme-preview-on');
	prevDemo = currentDemo.prevAll('.theme');
	prevDemo.addClass( 'theme-preview-on' );
	anchor = prevDemo.find('.astra-demo-import');
	renderDemoPreview( anchor );
});

function renderDemoPreview( anchor ) {
	demoId 		= anchor.data('id');
	apiURL 		= anchor.data('demo-api');
	demoURL 	= anchor.data('demo-url');
	screenshot 	= anchor.data('screenshot');
	demo_name 	= anchor.data('demo-name');
	content 	= anchor.data('content');

	var template = wp.template('astra-demo-preview');

	templateData = [{id: demoId, astra_demo_url: demoURL, demo_api: apiURL, screenshot: screenshot, demo_name: demo_name, content: content}]

	// delete any earlier fullscreen preview before we render new one.
	jQuery( '.theme-install-overlay' ).remove();
	jQuery( '.wrap' ).append( template( templateData[0] ) );
	jQuery('.theme-install-overlay').css('display', 'block');
	checkNextPrevButtons();

	return;
}

function checkNextPrevButtons() {
	currentDemo = jQuery( '.theme-preview-on' );
	nextDemo = currentDemo.nextAll('.theme').length;
	prevDemo = currentDemo.prevAll('.theme').length;
	
	if ( nextDemo == 0 ) {
		jQuery( '.next-theme' ).addClass('disabled');
	} else if ( nextDemo != 0 ) {
		jQuery( '.next-theme' ).removeClass('disabled');
	}

	if ( prevDemo == 0 ) {
		jQuery( '.previous-theme' ).addClass('disabled');
	} else if ( prevDemo != 0 ) {
		jQuery( '.previous-theme' ).removeClass('disabled');
	}

	return;
}

jQuery( document ).on('click', '.collapse-sidebar', function(event) {
	event.preventDefault();

	overlay = jQuery( '.wp-full-overlay' );

	if( overlay.hasClass('expanded') ) {
		overlay.removeClass('expanded');
		overlay.addClass('collapsed');
		return;
	}

	if( overlay.hasClass('collapsed') ) {
		overlay.removeClass('collapsed');
		overlay.addClass('expanded');
		return;
	}
});

jQuery( document ).on('click', '.astra-demo-import', function(event) {
	event.preventDefault();

	$this = jQuery( this );

	disabled = $this.attr('disabled');

	if (typeof disabled !== typeof undefined && disabled !== false) {
		return;
	}

	$this.addClass('updating-message installing').text( 'Importing Demo' );
	$this.closest( '.theme' ).focus();

	demoId = $this.data('id');
	apiURL = $this.data('demo-api');

	jQuery.ajax({
		url: ajaxurl,
		type: 'POST',
		dataType: 'json',
		data: {
			action: 'astra-import-demo',
			api_url: apiURL
		},
	})
	.done(function() {
		$this.removeClass('updating-message installing').text( 'Demo Imported' ).attr('disabled', 'disabled');
	})
	.fail(function() {
		$this.removeClass('updating-message installing').text( 'Error.' );
	});

});