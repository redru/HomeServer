(function() {

    // Angular initialization
    app = angular.module('bank', ['ngRoute']);

    /**
     * Ready function
     */
    $(document).ready(function() {
        var hashVal = window.location.hash.substr(2);

        $('.nav-pills li.active').removeClass('active');
        $('#' + hashVal.toLowerCase()).addClass('active');

        document.title = 'Banking - ' + hashVal;
    });

    /**
     * Window hashchange event
     */
    window.onhashchange = function() {
        document.title = 'Banking - ' + window.location.hash.substr(2);
    };

    /**
     * nav pills click handler
     */
    $('.nav-pills li').click(function(e) {
        $('.nav-pills li.active').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
    });

})();