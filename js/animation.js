const imagePanels = document.querySelectorAll('.image-panel:not(#hero)');
const options = {
	threshhold: 0.6,
	rootMargin: '-25%',
};
const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		console.log('Intersecting:', entry.isIntersecting);
		if (entry.isIntersecting) {
			entry.target.classList.add('fly-in');
		}
	});
}, options);

imagePanels.forEach((imagePanel) => {
	observer.observe(imagePanel);
});
