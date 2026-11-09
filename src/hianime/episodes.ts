import * as cheerio from 'cheerio';

type Episode = {
    id: number;
    number: number;
    url: string;
    jname: string;
    title: string;
}

type EpisodeListResponse = {
    status: boolean;
    totalItems?: number;
    html?: string;
}

async function episodes(animeId: string): Promise<Episode[]> {
    const numericId = animeId.split('-').at(-1);
    const url = `https://hianime.at/api/theme/episode/list/${numericId}`;
    const agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    const res = await fetch(url, { headers: { "User-Agent": agent } });
    const data: EpisodeListResponse = await res.json();
    const results: Episode[] = [];
    if (!data.status || !data.html) return results;
    const $ = cheerio.load(data.html);

    $('.ss-list').find('a').each((index, element) => {
        const dataId = $(element).attr('data-id');
        const ssliOrder = $(element).attr('data-number');
        const dataHref = $(element).attr('href');
        const dataJname = $(element).find('.ssli-detail .ep-name').attr('data-jname');
        const title = $(element).attr('title');

        if (!dataId || !ssliOrder || !dataHref || !dataJname || !title) return;

        results.push({
            id: parseInt(dataId),
            number: parseInt(ssliOrder),
            url: dataHref,
            jname: dataJname,
            title: title
        });
    });
    
    return results;
}

console.log(await episodes("blue-box-season-2-7182"));






