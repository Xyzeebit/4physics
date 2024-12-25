$(document).ready(function() {
    $('.close-btn').on('click', function() {
        $('.bg-overlay').hide(200)
    })

    $('.open-btn').on('click', function() {
        $('.bg-overlay').show('slow')
    })
})
