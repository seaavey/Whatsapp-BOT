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
