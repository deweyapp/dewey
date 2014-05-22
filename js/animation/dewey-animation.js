define(
[
  'jQuery'
],
function($) { 'use strict';

    $( ".settings-toggle" ).click(function( event ) {
        $( ".settings" ).addClass( "open" );

    });

});