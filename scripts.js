console.info(`
If you're looking at this code...welcome! I've left this site unminifed and unobfuscated so you can browse my work.

Like what you see? Hiring?

Contact me at jamie@jamiestill.com or see https://www.linkedin.com/in/jamiestill :)  

`);

const imagePanels = document.querySelectorAll('.image-panel:not(#hero)');
const options = {
	threshhold: 0.25,
	rootMargin: '-15%',
};

const observer = new IntersectionObserver((entries) => {
	entries.forEach((entry) => {
		console.log(entry.isIntersecting);
		if (entry.isIntersecting) {
			entry.target.addClass('fly-in');
		}
	});
}, options);

imagePanels.forEach((imagePanel) => {
	observer.observe(imagePanel);
});
