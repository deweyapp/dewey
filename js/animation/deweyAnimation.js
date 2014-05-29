$(document).ready(function(){

    $( ".settings-toggle" ).click(function( event ) {
        $( ".settings" ).toggleClass( "open" );
        $( "body" ).toggleClass( "no-scroll" );

    });

});