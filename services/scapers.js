import axios from "axios"
import * as cheerio from "cheerio"

export const jawdalSholat = async daerah => {
  try {
    daerah = daerah.replace(/\s/g, "-")
    const res = await axios.get("https://jadwal-sholat.tirto.id/kota" + daerah)
    if (res.status !== 200) {
      return {
        status: res.status,
        message: "Daerah Tidak Ditemukan"
      }
    }
    const $ = cheerio.load(res.data)
    const result = []
    const table = $("table")
    table.find("tr.table-content-sholat").each((_i, el) => {
      result.push({
        time: $(el).find("td:nth-child(1)").text(),
        subuh: $(el).find("td:nth-child(2)").text(),
        duha: $(el).find("td:nth-child(3)").text(),
        dzuhur: $(el).find("td:nth-child(4)").text(),
        ashar: $(el).find("td:nth-child(5)").text(),
        maghrib: $(el).find("td:nth-child(6)").text(),
        isya: $(el).find("td:nth-child(7)").text()
      })
    })
    return result
  } catch (error) {
    return {
      status: 500,
      message: "Internal Server Error"
    }
  }
}
export const pindl = async url => {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
      }
    })
    const $ = cheerio.load(data)
    const tag = $('script[data-test-id="video-snippet"]')
    let result = JSON.parse(tag.text())
    return {
      title: result.name,
      media: result.contentUrl,
      creator: result.creator.name
    }
  } catch (error) {
    return "Data Tidak Ditemukan"
  }
}

export const spotifydl = async url => {
  url = url.replace("intl-id/", "");
  const id = url.split("track/")[1].split("?")[0];
  const res = await axios.get(`https://spowload.com/spotify/track-${id}`, {
      withCredentials: true
  });
  const info = (await axios.get(`https://api.fabdl.com/spotify/get?url=${url}`).then(res => res.data.result));
  const cookies = res.headers["set-cookie"].map(cookie => cookie.split(";")[0]).join("; ");
  const csrf = cheerio.load(res.data)('meta[name="csrf-token"]').attr("content");
  const down = await axios.post("https://spowload.com/convert", { urls: `https://open.spotify.com/track/${id}`, cover: info.image }, { headers: { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf, Cookie: cookies } }).then(res => res.data);
  if (down.erorr)
      throw "Data Tidak Ditemukan";
  return {
      info,
      url: down.url
  };
};