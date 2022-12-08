console.info(`
If you're looking at this code...welcome! I've left this site unminifed and unobfuscated so you can browse my work.

Like what you see? Hiring?

Contact me at jamie@jamiestill.com or see https://www.linkedin.com/in/jamiestill :)  

`);

/*
 * Insert Google Earth links for figcaptions with GPS coordinates
 */

// Get the figcaptions
let figcaptions = document.querySelectorAll('figcaption .lat-long');
if (figcaptions) {

    figcaptions.forEach(figcaption => { 
        figcaption.innerHTML = createGoogleEarthLink(figcaption.innerText, "Where on earth was this photo taken?");
        }
    );
}

    
    