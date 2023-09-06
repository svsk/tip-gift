import { URL } from 'url';
import { requireAuth } from '~~/lib/requireAuth';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import fs from 'fs';

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
        const chromePath = fs.existsSync('/usr/bin/google-chrome-stable') ? '/usr/bin/google-chrome-stable' : undefined;

        const browser = await puppeteer.launch({
            headless: 'new',
            executablePath: chromePath,
            args: ['--no-sandbox'],
        });

        let headString: string | undefined = '';
        let resultString: string | undefined = '';

        try {
            const page = await browser.newPage();
            await page.setUserAgent(
                'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
            );

            await page.goto(body.url, { waitUntil: 'networkidle2', timeout: 20000 });

            resultString = await page.evaluate(() => document.documentElement.outerHTML);
            headString = await page.evaluate(() => document.head.outerHTML);
        } catch (err: any) {
            console.error(err);
            setResponseStatus(event, 500);
            return null;
        } finally {
            browser.close();
        }

        if (!headString) {
            console.warn('Failed to get it');
            setResponseStatus(event, 400);
            return null;
        }

        const head = headString;
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
            // try {
            //     // look for dom elements with 'price' in attribute value. Then grab the innertext of those elements.
            //     const dom = new JSDOM(resultString || '');
            //     const elements = dom.window.document.querySelectorAll('[*|price]');

            //     const prices = Array.from(elements).map((element) => element.textContent);
            // } catch (err: any) {
            //     console.log('Failed to find price', err);
            // }

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
