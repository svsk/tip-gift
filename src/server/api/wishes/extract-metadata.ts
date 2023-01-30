import { URL } from 'url';
import { requireAuth } from '~~/lib/requireAuth';
import { JSDOM } from 'jsdom';

const decodeEntities = (encodedString: string | undefined | null) => {
    if (!encodedString) return null;

    const result =
        new JSDOM(`<html><body><div id="result">${encodedString}</div></body></html>`).window.document.getElementById(
            'result'
        )?.innerHTML || null;

    return result;
};

export default defineEventHandler((event) =>
    requireAuth(event, async (_) => {
        const body = await readBody<{ url: string }>(event);
        const userAgent =
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

        let resultString: string | undefined = '';
        try {
            const result = await $fetch(body.url, {
                headers: {
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'accept-language': 'en;q=0.9',
                    'cache-control': 'max-age=0',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'cross-site',
                    'sec-fetch-user': '?1',
                    'sec-gpc': '1',
                    'upgrade-insecure-requests': '1',
                    'Referrer-Policy': 'strict-origin-when-cross-origin',
                    'user-agent': userAgent,
                },
            });

            resultString = result?.toString();
        } catch (err: any) {
            console.error(err);
            event.res.statusCode = 500;
            return null;
        }

        if (!resultString) {
            console.warn('Failed to get it');
            event.res.statusCode = 400;
            return null;
        }

        const head = resultString.split('<head').at(1)?.split('</head').at(0);
        const metadata = head
            ?.split('<meta')
            .map((meta) => {
                const property =
                    meta.split('property="').at(1)?.split('"').at(0) || meta.split('name="').at(1)?.split('"').at(0);
                const content = meta.split('content="').at(1)?.split('"').at(0);

                if (!property || !content) return null;

                return {
                    property,
                    content,
                };
            })
            .filter((md) => !!md);

        const findMetadatas = (...properties: string[]) => {
            const foundProps = properties.flatMap((prop) =>
                metadata?.filter((md) => {
                    return md?.property.includes(prop) || md?.property === prop;
                })
            );

            return foundProps.filter((prop) => !!prop);
        };

        const findMetadata = (...properties: string[]) => findMetadatas(...properties).at(0)?.content;

        const extractAndFixPossibleImages = () =>
            Array.from(
                new Set(
                    findMetadatas('image').map((md) => {
                        const value = md?.content;

                        if (value?.startsWith('/')) {
                            const host = new URL(body.url);
                            return `${host.origin}${value}`;
                        }

                        return value;
                    })
                )
            );

        const findPossiblePrice = () => {
            const items = resultString?.matchAll(/^price(.*?)(\d{1,100}\.\d{1,2})/g);
            console.log(items);
            return '';
        };

        const md = {
            possibleImages: extractAndFixPossibleImages(),
            title: decodeEntities(findMetadata('og:title', 'title')),
            description: decodeEntities(findMetadata('og:description', 'description')),
            price: findMetadata('amount') || findPossiblePrice(),
            currency: findMetadata('currency'),
        };

        return md;
    })
);
