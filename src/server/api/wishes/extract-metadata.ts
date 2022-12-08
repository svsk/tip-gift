import { URL } from 'url';
import { requireAuth } from '~~/lib/requireAuth';
import { JSDOM } from 'jsdom';

const decodeEntities = (encodedString: string | undefined | null) => {
    if (!encodedString) return null;

    const result =
        new JSDOM(`<html><body><div id="result">${encodedString}</div></body></html>`).window.document.getElementById(
            'result'
        )?.innerText || null;

    return result;
};

export default defineEventHandler((event) =>
    requireAuth(event, async (_) => {
        const body = await readBody<{ url: string }>(event);

        let resultString: string | undefined = '';
        try {
            const result = await $fetch(body.url);
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

        const findMetadata = (...properties: string[]) => {
            const foundProps = properties.map((prop) =>
                metadata?.find((md) => {
                    return md?.property.includes(prop) || md?.property === prop;
                })
            );

            return foundProps.filter((prop) => !!prop).at(0)?.content;
        };

        const md = {
            image: findMetadata('image'),
            title: decodeEntities(findMetadata('og:title', 'title')),
            description: decodeEntities(findMetadata('og:description', 'description')),
            price: findMetadata('amount'),
            currency: findMetadata('currency'),
        };

        if (md.image?.startsWith('/')) {
            const host = new URL(body.url);
            md.image = `${host.origin}${md.image}`;
        }

        return md;
    })
);
