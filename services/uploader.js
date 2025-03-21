import axios from "axios";
import FormData from "form-data";
import fileType from "file-type";
import logger from "../helpers/log.js";
export default async function Uploader(buffer) {
    try {
        let mime = await fileType.fromBuffer(buffer);
        let form = new FormData();
        form.append("files[]", buffer, `file-${Date.now()}.${mime.ext}`);
        let { data } = await axios.post("https://pomf.lain.la/upload.php", form, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
                ...form.getHeaders()
            }
        });
        return data.files[0].url;
    }
    catch (error) {
        logger.error(error);
    }
}
