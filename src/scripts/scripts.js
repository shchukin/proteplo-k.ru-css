document.addEventListener('DOMContentLoaded', () => {

    /* Глобальные константы */

    const isDesktop = window.matchMedia("(min-width: 740px)").matches;
    const responsiveSpacing = isDesktop ? 24 : parseInt(getComputedStyle(document.documentElement).getPropertyValue('--container-padding'));



    /* Слайдер "Service" */

    new Swiper('.swiper--service', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: responsiveSpacing,
        autoHeight: true,

        navigation: {
            prevEl: '.service__navigation .swiper-button-prev',
            nextEl: '.service__navigation .swiper-button-next',
        },

        breakpoints: {
            740: {
                slidesPerView: 4,
                slidesPerGroup: 4,
            }
        }
    });


    /* Слайдер "Team" */

    new Swiper('.swiper--team', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: responsiveSpacing,
        autoHeight: true,

        navigation: {
            prevEl: '.team__navigation .swiper-button-prev',
            nextEl: '.team__navigation .swiper-button-next',
        },

        breakpoints: {
            740: {
                slidesPerView: 4,
                slidesPerGroup: 4,
            }
        }
    });


    /* Слайдер "Guide" */

    if( ! isDesktop ) {
        new Swiper('.swiper--guide', {
            slidesPerView: 1,
            slidesPerGroup: 1,
            spaceBetween: responsiveSpacing,
            autoHeight: true,

            navigation: {
                prevEl: '.guide__navigation .swiper-button-prev',
                nextEl: '.guide__navigation .swiper-button-next',
            },
        });
    }


    /* Слайдер "Solutions" */

    new Swiper('.swiper--partners', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: responsiveSpacing,
        autoHeight: true,

        navigation: {
            prevEl: '.experience__partners-navigation .swiper-button-prev',
            nextEl: '.experience__partners-navigation .swiper-button-next',
        },

        breakpoints: {
            740: {
                slidesPerView: 4,
                slidesPerGroup: 4,
            }
        }
    });


    /* Слайдер "Solutions" */

    new Swiper('.swiper--solutions', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: responsiveSpacing,
        autoHeight: true,

        navigation: {
            prevEl: '.experience__solutions-navigation .swiper-button-prev',
            nextEl: '.experience__solutions-navigation .swiper-button-next',
        },

        breakpoints: {
            740: {
                slidesPerView: 4,
                slidesPerGroup: 4,
            }
        }
    });


    /* Слайдер "Feedback" */

    new Swiper('.swiper--feedback', {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: parseInt(getComputedStyle(document.documentElement).getPropertyValue('--container-padding')),
        autoHeight: true,

        navigation: {
            prevEl: '.feedback__navigation .swiper-button-prev',
            nextEl: '.feedback__navigation .swiper-button-next',
        },

    });




    /* Форма */

    /* Уведомления */
    document.querySelectorAll('.alert').forEach(function (alert) {
        alert.addEventListener('click', function () {
            alert.style.display = 'none';
        });
    });

    document.addEventListener('keyup', function (event) {
        if (event.keyCode === 27) {
            document.querySelectorAll('.alert').forEach(function (alert) {
                alert.style.display = 'none';
            });
        }
    });


    /* Сама форма */
    document.querySelectorAll('.callback__form').forEach(function (subscriptionForm) {
        const subscriptionInputs = subscriptionForm.querySelectorAll('.input');
        const subscriptionSubmit = subscriptionForm.querySelector('.callback__submit');
        const subscriptionSuccessAlert = document.querySelector('.notifications-center__callback-success');
        const subscriptionFailureAlert = document.querySelector('.notifications-center__callback-failure');

        /* Состояния инпутов (на время отправки формы инпуты должны блокироваться) */
        function disableSubscriptionInputs() {
            subscriptionInputs.forEach((input) => {
                input.classList.add('input--loading');
                input.querySelector('.input__widget').setAttribute('disabled', 'disabled');
            });
        }

        function enableSubscriptionInputs() {
            subscriptionInputs.forEach((input) => {
                input.classList.remove('input--loading');
                input.querySelector('.input__widget').removeAttribute('disabled');
            });
        }

        /* Состояния кнопки */
        function changeSubmitStateToLoading() {
            subscriptionSubmit.classList.add('button--loading');
            subscriptionSubmit.setAttribute('disabled', 'disabled');
        }

        function changeSubmitStateToSuccess() {
            subscriptionSubmit.classList.remove('button--loading');
            subscriptionSubmit.classList.add('button--success');
            subscriptionSubmit.setAttribute('disabled', 'disabled');
        }

        function changeSubmitStateToFailure() {
            subscriptionSubmit.classList.remove('button--loading');
            subscriptionSubmit.classList.add('button--warning');
            subscriptionSubmit.setAttribute('disabled', 'disabled');
        }

        function changeSubmitStateToPristine() {
            subscriptionSubmit.classList.remove('button--loading', 'button--success', 'button--warning');
            subscriptionSubmit.removeAttribute('disabled');
        }

        /* Если пользователь начал взаимодействовать с инпутами, то убираем уведомления с прошлой попытки отправки: */
        subscriptionInputs.forEach(input => input.addEventListener('input', () => {
            subscriptionFailureAlert.style.display = 'none';
        }));


        /* Отправка */
        subscriptionForm.addEventListener('submit', function (event) {
            event.preventDefault();

            /* Если с прошлой попытки висит уведомление об ошибке: */
            subscriptionFailureAlert.style.display = 'none';

            /* Начинаем отправку данных, для начала блокируем форму */
            disableSubscriptionInputs();
            changeSubmitStateToLoading();

            /* Представим, что 3000ms отправляем данные */
            setTimeout(function () {

                /* ... дальше развилка, пусть для примера будет рандом 50/50: */

                // Если данные успешно отправлены
                if (Math.random() < 0.5) {

                    // показываем зелёное уведомление:
                    subscriptionSuccessAlert.style.display = 'block';

                    // показываем галочку на кнопке:
                    changeSubmitStateToSuccess();

                    // и то и другое на 4.5 секунды:
                    setTimeout(function () {
                        subscriptionSuccessAlert.style.display = 'none';
                        changeSubmitStateToPristine();
                        enableSubscriptionInputs();
                    }, 4500);

                }

                // Если произошла ошибка
                else {

                    // показываем красное уведомление
                    subscriptionFailureAlert.style.display = 'block';

                    // Показываем восклицательный знак на кнопке:
                    changeSubmitStateToFailure();

                    // В данном случае всего 2 секунды, чтобы пользователь мог быстро вернуться к работе с формой.
                    // Уведомление в этом случае НЕ убираем -- пусть висит, пока пользователь не увидит и явно не закроет, или не начнёт заново заполнять форму / попытается отправить:
                    setTimeout(function () {
                        changeSubmitStateToPristine();
                        enableSubscriptionInputs();
                    }, 2000);

                }

            }, 3000);

        });
    });





    /* FAQ */
    const faqQuestions = document.querySelectorAll('.faq__question');


    /* Дублируем хендлеры для десктопов */

    const faqDesktopTabs = document.createElement('div');
    faqDesktopTabs.classList.add('faq__desktop-tabs');

    faqQuestions.forEach(question => {
        const questionCopy = question.cloneNode(true);
        questionCopy.classList.remove('faq__question');
        questionCopy.classList.add('faq__desktop-question-copy');
        faqDesktopTabs.appendChild(questionCopy);
    });

    const faqList = document.querySelector('.faq__list');
    faqList.parentElement.insertBefore(faqDesktopTabs, faqList);

    const faqDesktopCopies = document.querySelectorAll('.faq__desktop-question-copy');



    /* Расхлопывание */

    function handleFaqToggle(index) {
        const faqItem = faqQuestions[index].parentElement;
        const correspondingCopy = faqDesktopCopies[index];

        const isExpanded = faqItem.classList.toggle('faq__item--expanded');

        if (isExpanded) {

            faqQuestions.forEach((q, i) => {
                if (i !== index) {
                    q.parentElement.classList.remove('faq__item--expanded');
                }
            });

            faqDesktopCopies.forEach((c, i) => {
                if (i !== index) {
                    c.classList.remove('faq__desktop-question-copy--current');
                }
            });

            correspondingCopy.classList.add('faq__desktop-question-copy--current');
        } else {
            correspondingCopy.classList.remove('faq__desktop-question-copy--current');
        }
    }

    faqQuestions.forEach((question, index) => {
        question.addEventListener('click', () => {
            handleFaqToggle(index);
        });
    });

    faqDesktopCopies.forEach((copy, index) => {
        copy.addEventListener('click', () => {
            if (!copy.classList.contains('faq__desktop-question-copy--current')) { // на десктопах не закрываем текущий айтем по повторному клику
                handleFaqToggle(index);
            }
        });
    });

    /* При первом открытии страницы расхлопываем первый элемент */
    handleFaqToggle(0);




    /* Шапка */

    const $header = document.querySelector('.header');
    const $headerMenu = $header.querySelector('.header__menu');
    const $headerBurger = $header.querySelector('.header__burger');
    const $headerLinks = document.querySelectorAll('.header__link');

    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header')) || 0;
    const anchorOffset = isDesktop ? 50 : 24;


    /* Расхлопывание бургера */

    $headerBurger.addEventListener('click', () => {
        $header.classList.toggle('header--expanded');
    });

    document.addEventListener('click', (event) => {
        if (!$headerMenu.contains(event.target) && !$headerBurger.contains(event.target)) {
            $header.classList.remove('header--expanded');
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            $header.classList.remove('header--expanded');
        }
    });


    // Якоря

    $headerLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();

            const targetId = this.getAttribute('href').substring(1); // Get the target ID without the #
            const targetElement = document.getElementById(targetId);

            if (targetElement) {

                $header.classList.remove('header--expanded');

                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerHeight - anchorOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });




    /* Инпуты */

    // Select placeholder
    function selectPlaceholder(element) {
        if (element.value === 'placeholder') {
            element.parentElement.classList.add('input--placeholder-is-chosen');
        } else {
            element.parentElement.classList.remove('input--placeholder-is-chosen');
        }
    }

    document.querySelectorAll('select.input__widget').forEach(select => {
        selectPlaceholder(select);
        select.addEventListener('change', () => {
            selectPlaceholder(select);
        });
    });

    // Expanding textarea
    function expandTextarea(element) {
        element.style.height = 'auto';
        element.style.height = (element.scrollHeight + 2 * parseInt(getComputedStyle(element).borderWidth, 10)) + 'px';
    }

    document.querySelectorAll('.input--expandable .input__widget').forEach(textarea => {
        expandTextarea(textarea);
        textarea.addEventListener('input', () => {
            expandTextarea(textarea);
        });
    });

    // Ошибки
    document.querySelectorAll('.input__widget').forEach(input => {
        input.addEventListener('focus', () => {
            let parent = input.closest('.input');
            if (parent) {
                parent.classList.remove('input--error');
                let siblings = parent.nextElementSibling;
                while (siblings && siblings.classList.contains('helper--error')) {
                    siblings.remove();
                    siblings = parent.nextElementSibling;
                }
            }
        });
    });



    /* Модалка */

    (function ($) {

        $('.mfp-handler').magnificPopup({
            type: 'inline',
            removalDelay: 200,
            showCloseBtn: false,
            callbacks: {
                open: function() {
                    // Use jQuery to select the content of the currently opened modal
                    const modalContent = $('.mfp-content');
                    const textareas = modalContent.find('.input--expandable .input__widget');

                    textareas.each(function() {
                        expandTextarea(this);
                    });
                }
            }
        });

    })(jQuery);

});

