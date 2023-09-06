export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('ripple', {
        mounted: (parent: HTMLElement) => {
            parent.dataset.hasRipple = 'true';
            let timerId: any = 0;

            parent.addEventListener('mousedown', (e: MouseEvent) => {
                clearTimeout(timerId);
                let ripple = parent.querySelector<HTMLDivElement>('.ripple');
                if (!ripple) {
                    ripple = document.createElement('div');
                    ripple.classList.add('ripple');
                    parent.appendChild(ripple);
                }

                //const ripple = e.target.querySelector('.ripple');
                const size = parent.offsetWidth;
                const pos = parent.getBoundingClientRect();
                const x = e.pageX - pos.left - size;
                const y = e.pageY - pos.top - size;

                ripple.style.top = `${y}px`;
                ripple.style.left = `${x}px`;
                ripple.style.width = `${size * 2}px`;
                ripple.style.height = `${size * 2}px`;
                ripple.classList.remove('active');
                ripple.classList.remove('start');

                setTimeout(() => {
                    ripple?.classList.add('start');
                    setTimeout(() => {
                        ripple?.classList.add('active');
                    }, 0);
                }, 0);
            });

            parent.addEventListener('mouseup', (e: MouseEvent) => {
                const ripple = (e.target as HTMLElement)?.querySelector('.ripple');
                clearTimeout(timerId);

                timerId = setTimeout(() => {
                    ripple?.classList.remove('active');
                    ripple?.classList.remove('start');
                }, 500);
            });
        },
        getSSRProps: () => ({}),
    });
});
