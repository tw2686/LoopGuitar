document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-accordion-show]').forEach(function (elm) {
        elm.addEventListener('click', function () {
            var toggle = document.querySelector('#' + elm.dataset.accordionShow).classList.contains('accordion--visible');
            if (!toggle) {
                var visible = document.querySelector('.accordion--visible');
                if (visible) {
                    visible.classList.toggle('accordion--visible');
                }
            }
            document.querySelector('#' + elm.dataset.accordionShow).classList.toggle('accordion--visible');
        });
    });
});
document.addEventListener('DOMContentLoaded', function () {
    var interval;
    var currentIndex = 1;
    var container = document.querySelector('.testimonials');
    var count = document.querySelectorAll('.testimonial').length;

    startInterval();

    function startInterval() {
        interval = window.setInterval(function () {
            /*var currentElm = document.querySelector('.testimonial:nth-child(' + currentIndex + ')');
            container.innerHTML += currentElm.outerHTML;
            document.querySelector('.testimonial:nth-child(1)').style.marginLeft = '-' + (currentIndex) * 100 + '%';
            currentIndex++;*/
            if (document.querySelector('.testimonial--visible')) {
                document.querySelector('.testimonial--visible').classList.remove('testimonial--visible');
            }
            var elm = document.querySelector('.testimonial:nth-child(' + currentIndex + ')');
            if (elm) {
                elm.classList.add('testimonial--visible');
            }
            if (currentIndex < count) {
                currentIndex++
            } else {
                currentIndex = 1;
            }
        }, 4000);
    }
});