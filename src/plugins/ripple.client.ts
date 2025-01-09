const ensureStyleExists = () => {
    if (!document.getElementById('ripple-style')) {
        // Add the style to the head.
        const style = `
            [data-has-ripple] {
                overflow: hidden;

                .ripple {
                    background-color: white;
                    border-radius: 50%;
                    pointer-events: none;
                    position: absolute;
                    transform: scale(0);
                    opacity: 0.2;
                    will-change: transform, opacity;

                    &.ripple-start {
                        transform: scale(0.2);
                    }

                    &.ripple-active {
                        transform: scale(2);
                        transition: transform 700ms, opacity 700ms;
                        opacity: 0.2;
                    }

                    &.ripple-ended {
                        opacity: 0;
                    }
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.id = 'ripple-style';
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
    }
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('ripple', {
        mounted: (parent: HTMLElement, directiveData: { value: boolean }) => {
            if (directiveData.value === false) return;

            ensureStyleExists();

            parent.dataset.hasRipple = 'true';
            let timerId: any = 0;

            parent.addEventListener('mousedown', (e: MouseEvent) => {
                clearTimeout(timerId);

                document.querySelectorAll('.ripple.ripple-active').forEach((alreadyRippledElement) => {
                    alreadyRippledElement.classList.remove('ripple-active');
                    alreadyRippledElement.classList.remove('ripple-start');
                });

                let ripple = parent.querySelector<HTMLDivElement>('.ripple');
                if (!ripple) {
                    ripple = document.createElement('div');
                    ripple.classList.add('ripple');
                    parent.appendChild(ripple);
                }

                ripple.classList.remove('ripple-ended');

                //const ripple = e.target.querySelector('.ripple');
                const size = parent.offsetWidth;
                const pos = parent.getBoundingClientRect();
                const x = e.pageX - pos.left - size;
                const y = e.pageY - pos.top - size;

                ripple.style.top = `${y}px`;
                ripple.style.left = `${x}px`;
                ripple.style.width = `${size * 2}px`;
                ripple.style.height = `${size * 2}px`;
                ripple.classList.remove('ripple-active');
                ripple.classList.remove('ripple-start');

                setTimeout(() => {
                    ripple?.classList.add('ripple-start');
                    setTimeout(() => {
                        ripple?.classList.add('ripple-active');
                    }, 0);
                }, 0);
            });

            parent.addEventListener('mouseup', (_: MouseEvent) => {
                const ripples = Array.from(document.querySelectorAll('.ripple'));
                clearTimeout(timerId);

                timerId = setTimeout(() => {
                    ripples.forEach((rip) => rip.classList.add('ripple-ended'));
                }, 200);
            });
        },
        getSSRProps: () => ({}),
    });
});
