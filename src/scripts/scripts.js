document.addEventListener('DOMContentLoaded', () => {

    /* Уведомления */

    document.querySelectorAll('.alert').forEach(function(alert) {
        alert.addEventListener('click', function() {
            alert.style.display = 'none';
        });
    });

    document.addEventListener('keyup', function(event) {
        if (event.keyCode === 27) {
            document.querySelectorAll('.alert').forEach(function(alert) {
                alert.style.display = 'none';
            });
        }
    });


    /* Форма */

    const subscriptionSuccessAlert = document.querySelector('#subscriptionSuccessAlert');
    const subscriptionFailureAlert = document.querySelector('#subscriptionFailureAlert');
    const subscriptionForm = document.querySelector('#subscriptionForm');
    const subscriptionInputs = subscriptionForm.querySelectorAll('input, textarea, select');
    const subscriptionSubmit = subscriptionForm.querySelector('.subscription__submit');

    /* На время отправки формы инпуты должны блокироваться. Пишем функции для этого: */
    function disableSubscriptionInputs() {
        subscriptionInputs.forEach(input => input.setAttribute('disabled', 'disabled'));
    }

    function enableSubscriptionInputs() {
        subscriptionInputs.forEach(input => input.removeAttribute('disabled'));
    }

    /* Если пользователь начал взаимодействовать с инпутами, то убираем уведомления с прошлой попытки отправки: */

    subscriptionInputs.forEach(input => input.addEventListener('input', () => {
        subscriptionFailureAlert.style.display = 'none';
    }));


    /* Отправка */

    subscriptionForm.addEventListener('submit', function(event) {

        event.preventDefault();


        /* Если с прошлой попытки висит уведомление об ошибке: */
        subscriptionFailureAlert.style.display = 'none';

        /* Начинаем отправку данных, для начала блокируем форму */
        disableSubscriptionInputs();
        subscriptionSubmit.classList.add('button--loading');

        /* Представим, что 3000ms отправляем данные */
        setTimeout(function() {

            /* Как только пришёл ответ убираем button--loading ... */
            subscriptionSubmit.classList.remove('button--loading');

            /* ... дальше развилка, пусть для примера будет рандом 50/50: */
            if (Math.random() < 0.5) {

                /* Если данные успешно отправлены -- показываем уведомление и галочку на кнопке на 4.5 секунды: */
                subscriptionSubmit.classList.add('button--success');
                subscriptionSuccessAlert.style.display = 'block';
                setTimeout(function() {
                    subscriptionSubmit.classList.remove('button--success');
                    subscriptionSuccessAlert.style.display = 'none';
                    enableSubscriptionInputs();
                }, 4500);

            } else {

                /* Если данные не были отправлены: */

                // Уведомление в этом случае показываем, и НЕ убираем -- пусть висит, пока пользователь не увидит и явно не закроет, или не начнёт заново заполнять форму:
                subscriptionFailureAlert.style.display = 'block';

                // На кнопке показываем иконку восклицательного знака, но всего на пару секунд:
                subscriptionSubmit.classList.add('button--warning');
                setTimeout(function() {
                    subscriptionSubmit.classList.remove('button--warning');
                    enableSubscriptionInputs();
                }, 2000);

            }

        }, 3000);

    });


});



/* Модалка */

(function($) {

    $('.mfp-handler').magnificPopup({
        type: 'inline',
        removalDelay: 200,
        showCloseBtn: false
    });

})(jQuery);



/* Инпуты */

(function ($) {

    /* Select placeholder */
    function selectPlaceholder($element) {
        if ($element.val() === 'placeholder') {
            $element.parent('.input').addClass('input--placeholder-is-chosen');
        } else {
            $element.parent('.input').removeClass('input--placeholder-is-chosen');
        }
    }

    $('select.input__widget').each(function () {
        selectPlaceholder($(this));
    }).on('change', function () {
        selectPlaceholder($(this));
    });

    /* Expanding textarea */
    function expandTextarea($element) {
        $element.css('height', 'auto');
        $element.css('height', ($element[0].scrollHeight + 2 * parseInt($element.css('border-width'), 10)) + 'px');
    }

    $('.input--expandable .input__widget').each(function () {
        expandTextarea($(this));
    }).on('input', function () {
        expandTextarea($(this));
    });

    /* Error field */
    $('.input__widget').on('focus', function () {
        $(this).parents('.input').removeClass('input--error');
        $(this).parents('.input').nextUntil(':not(.helper--error)').remove();
    });

})(jQuery);
