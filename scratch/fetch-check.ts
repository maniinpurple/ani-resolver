
const url = "https://hianime.at/search?keyword=firefly";
const agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const res = await fetch(url, { headers: { "User-Agent": agent } });
console.log(res.status);

const html = await res.text();
console.log(html);
