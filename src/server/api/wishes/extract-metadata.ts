import { URL } from 'url';
import { requireAuth } from '~~/lib/requireAuth';
import puppeteer from 'puppeteer';
import fs from 'fs';
import * as cheerio from 'cheerio';

const decodeEntities = (encodedString: string | undefined | null) => {
    if (!encodedString) return null;

    const $ = cheerio.load(`<html><body><div id="result">${encodedString}</div></body></html>`);

    const result = $('#result').html() || null;

    return result;
};

const getWithPuppeteer = async (url: string) => {
    let head: string | null = null;
    let fullDOM: string | null = null;
    let error: string | null = null;

    const chromePath = fs.existsSync('/usr/bin/google-chrome-stable') ? '/usr/bin/google-chrome-stable' : undefined;
    const browser = await puppeteer.launch({
        executablePath: chromePath,
        args: ['--no-sandbox'],
    });

    try {
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36'
        );

        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 });

        fullDOM = await page.evaluate(() => document.documentElement.outerHTML);
        head = await page.evaluate(() => document.head.outerHTML);
    } catch (err: any) {
        error = '' + err;
    } finally {
        browser.close();
    }

    if (error) {
        throw new Error(error);
    }

    return {
        head,
        fullDOM,
    };
};

const getWithOFetch = async (url: string) => {
    const headers = {
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
        'user-agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    };

    const result = await $fetch.raw<string>(url, {
        headers,
        timeout: 10000,
    });

    if (result.status !== 200 || !result._data) {
        throw new Error(`OFetch failed to get ${url}`);
    }

    return {
        fullDOM: result._data,
        head: result._data.split('</head>')[0],
    };
};

export default defineEventHandler((event) =>
    requireAuth(event, async (_) => {
        const body = await readBody<{ url: string }>(event);

        let head: string | null = null;
        let fullDOM: string | null = null;

        try {
            const results = await Promise.all([getWithPuppeteer(body.url), getWithOFetch(body.url)]);

            head = results.sort((a, b) => (a.head?.length || 0) - (b.head?.length || 0)).at(-1)?.head || null;
            fullDOM =
                results.sort((a, b) => (a.fullDOM?.length || 0) - (b.fullDOM?.length || 0)).at(-1)?.fullDOM || null;
        } catch (ex) {
            console.warn('Failed to get it', ex);
            setResponseStatus(event, 500);
            return null;
        }

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

        const extractAndFixPossibleImages = () => {
            const images = findMetadatas('image').map((md) => {
                const value = md?.content;

                if (value?.startsWith('/')) {
                    const host = new URL(body.url);
                    return `${host.origin}${value}`;
                }

                return value;
            });

            const imagesFroMDom = fullDOM?.match(/<img[^>]+src="([^">]+)"/g)?.map((img) => {
                const src = img.match(/src="([^"]+)"/)?.[1];
                if (!src) return null;

                if (src.startsWith('/')) {
                    const host = new URL(body.url);
                    return `${host.origin}${src}`;
                }

                return src;
            });

            imagesFroMDom?.forEach((img) => {
                if (img) images.push(img);
            });

            return Array.from(new Set(images));
        };

        const findPossiblePrice = () => {
            // try {
            //     // look for dom elements with 'price' in attribute value. Then grab the innertext of those elements.
            //     const dom = new JSDOM(result.fullDOM || '');
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
