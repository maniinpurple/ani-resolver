const OBF_KEY = "otaku-embed-v1";
const agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

type Subtitle = {
    lang: string;
    label: string;
    default: boolean;
    src: string;
}

type TimeRange = {
    start: number;
    end: number;
}

type SkipTimes = {
    intro: TimeRange | null;
    outro: TimeRange | null;
};

type PlayerConfig = {
    src: string;
    subtitles: Subtitle[];
    skip: SkipTimes | null;
}


async function fetchBlob(url: string): Promise<string> {
    const res = await fetch(url, { headers: { "User-Agent": agent } });
    const html = await res.text();
    const pCode = html.split('window.__P="')[1]?.split('"')[0];
    if (!pCode) throw new Error("pCode not found: " + url);
    return pCode;
}

// console.log(await fetchBlob("https://zokoanime.video/stream/anime/146263/sub"));

function dexor(data: Buffer): Buffer {
    const key = Buffer.from(OBF_KEY);
    const output = Buffer.alloc(data.length);
    for (let i = 0; i < data.length; i++) {
        output[i] = data[i] ^ key[i % key.length];
    }
    return output;
}

function deobfuscate(pCode: string): PlayerConfig {
    const encodedBytes = Buffer.from(pCode, 'base64');
    const dexored = dexor(encodedBytes);
    const jsonText = dexored.toString('utf8');
    return JSON.parse(jsonText);
}

async function resolveZoko(embedUrl: string): Promise<PlayerConfig> {
    const pCode = await fetchBlob(embedUrl);
    return deobfuscate(pCode);
}

const config = await resolveZoko("https://zokoanime.video/stream/anime/146263/sub");
console.log(config.src);
// console.log(config.subtitles.find((sub) => sub.lang === "vi"));
console.log(config.subtitles);
console.log(config.skip);