// Observser
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
        } else {
            entry.target.classList.remove('show')
        }
    })
})

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el))


// Slides
const slides = document.querySelectorAll('.slides .quote-card')
let slideIndex = 0;
let intervalId = null;


document.addEventListener("DOMContentLoaded", initializeSlider)

function initializeSlider(){

    slides[slideIndex].classList.add('displaySlide');
    intervalId = setInterval(nextSlide, 5000);
    

}
function showSlide(index){

    if(index >= slides.length){
        slideIndex = 0;
    } else if(index < 0) {
        slideIndex = slides.length - 1
    }
    slides.forEach(slide => {
        slide.classList.remove('displaySlide')
    })
    slides[slideIndex].classList.add("displaySlide")
}
function prevSlide(){
    slideIndex --;
    showSlide(slideIndex);
    clearInterval(intervalId);

}
function nextSlide(){
    slideIndex++;
    showSlide(slideIndex)
}

// FAQ

const accordionHeaders = document.querySelectorAll(".accordion-header")

const accordionContents = document.querySelectorAll(".accordion-content")

accordionHeaders.forEach((header) => {
    header.addEventListener('click',() => {
        const accordionItem = header.parentElement;

        const accordionContent = accordionItem.querySelector('.accordion-content')

        const accordionHeader = accordionItem.querySelector('.accordion-header')

        accordionContents.forEach((content) => {
            if (content !== accordionContent) {
                content.classList.remove('active');
                content.style.maxHeight = '0';
                
            }
        })

        accordionHeaders.forEach((header) => {
            if (header !== accordionHeader) {
                header.classList.remove('active')
            }
        })

        accordionContent.classList.toggle('active')

        header.classList.toggle('active')

        if (accordionContent.classList.contains('active')) {
            accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
        } else {
            accordionContent.style.maxHeight = '0'
        }
    } )
})