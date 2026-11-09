import * as cheerio from "cheerio";

type Server = {
    name: string;
    type: "sub" | "dub";
    embedUrl: string;
}

type ServerListResponse = {
    status: boolean;
    html?: string;
}

async function servers(episodeId: number): Promise<Server[]> {
    const url = `https://hianime.at/api/theme/episode/servers?episodeId=${episodeId}`;
    const agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
    const res = await fetch(url, { headers: { "User-Agent": agent } });
    const data: ServerListResponse = await res.json();
    const results: Server[] = [];
    if (!data.status || !data.html) return results;
    const $ = cheerio.load(data.html);


    $('.server-item').each((index, element) => {
        const dataType = $(element).attr('data-type');
        const dataServerName = $(element).attr('data-server-name');
        const dataHash = $(element).attr('data-hash');

        if (!dataType || !dataServerName || !dataHash) return;
        if (dataType !== "sub" && dataType !== "dub") return;
        const embedUrl = Buffer.from(dataHash, 'base64').toString('utf8');
        if (!embedUrl) return;

        results.push({
            name: dataServerName,
            type: dataType,
            embedUrl: embedUrl
        });
    })
    return results;
}



console.log(await servers(9227));


