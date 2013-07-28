$(function() {
	$('.slider-main')
	.on('create.jcarousel', initCallback)
	.jcarousel({
		'wrap' : 'last'
	})
	.jcarouselAutoscroll({
		'interval' : 5000,
		'target' : '+=1'
	});	
});

function initCallback(event) {
	$('.slider-main').hover(stopAutoScroll, startAutoScroll);
	$('.slider-link').click(scrollToImage);
}

function stopAutoScroll() {
	$('.slider-main').jcarouselAutoscroll('stop');
}

function startAutoScroll() {
	$('.slider-main').jcarouselAutoscroll('start');
}

function scrollToImage() {
	$('.slider-main').jcarouselAutoscroll('stop');
	$('.slider-main').jcarousel('scroll', $(this).data('rel'));
}
