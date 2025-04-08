import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";
export async function fetchOgTags(url: string) {
  try {
    const response = await axios.get(url, {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Whale/4.30.291.11 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "ko-KR,ko;q=0.9",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Sec-CH-UA": '"Chromium";v="132", "Whale";v="4", "Not.A/Brand";v="99"',
        "Sec-CH-UA-Mobile": "?0",
        "Sec-CH-UA-Platform": '"Windows"',
        Priority: "u=0, i",
        Cookie:
          "wcs_bt=s_2ad25f7103648:1744088679; _fwb=2518H3WO19LA5Wa5Jd1ysLT.1744088679751; NNB=BZOTNELJV32GO; SRT30=1744088681; SRT5=1744088681; BUC=WPQJzFt0I9q76W9EUnoLLjrQHcZ_e2ztv1q8JKPXAt8=",
        Host: "smartstore.naver.com",
        Connection: "keep-alive",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const ogData: Record<string, string> = {};

    $("meta").each((_, el) => {
      const property = $(el).attr("property");
      const content = $(el).attr("content");
      if (property && property.startsWith("og:")) {
        ogData[property] = content ?? "";
      }
    });

    ogData["hostname"] = new URL(url).hostname;
    return ogData;
  } catch (err: any) {
    console.error("OG 데이터 요청 실패:", err.message);
    throw new Error("OG 데이터를 가져오는 데 실패했습니다.");
  }
}
