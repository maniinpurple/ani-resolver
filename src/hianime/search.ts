import * as cheerio from 'cheerio';

const agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";


type SearchResult = {
    id: string;
    name: string;
    jname: string;
};

async function search(q: string): Promise<SearchResult[]> {
    const formattedQuery = q.replaceAll(" ", "+");
    const url = `https://hianime.at/search?keyword=${formattedQuery}`;
    const res = await fetch(url, { headers: { "User-Agent": agent } });
    const html = await res.text();
    const results: SearchResult[] = [];
    const $ = cheerio.load(html);

    $('.film_list-wrap').find('.film-name a').each((index, element) => {
        const href = $(element).attr('href');
        const name = $(element).attr('title');
        const jname = $(element).attr('data-jname');
        if (!href || !name || !jname) return;
        
        const id = href.split('/').at(-1);
        if (!id) return;

        results.push({ id: id, name: name, jname: jname});
    });

    return results;
}

console.log(await search("firefly"));
console.log(await search("frieren"));
console.log(await search("firefly wedding"));



