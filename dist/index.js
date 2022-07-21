import { z } from "zod";
import HTTP from "./method/HTTP.js";
import SeikaSay2 from "./method/SeikaSay2.js";
import WCFClient from "./method/WCFClient.js";
export { HTTP, SeikaSay2, WCFClient };
/**
 * edge-jsがimport出来るかテストする
 */
const edgejs_test = async () => {
    // eslint-disable-next-line import/no-extraneous-dependencies
    await import("edge-js");
    return true;
};
/**
 * AssistantSeikaへのアクセス方法を指定して使えるようにする
 * @param option
 */
const init = async (option = {}) => {
    const { access_method = "SeikaSay2", path: input_path = "", url = "http://localhost:7180/", id = "SeikaServerUser", password = "SeikaServerPassword", } = option;
    // eslint-disable-next-line no-param-reassign
    if (!(await edgejs_test()))
        throw new Error();
    const path = (() => {
        const result = z
            .string()
            .regex(/(SeikaSay2\.exe|WCFClient\.dll)$/)
            .safeParse(input_path);
        if (result.success) {
            return result.data;
        }
        if (access_method === "WCFClient") {
            return "./AssistantSeika/WCFClient/WCFClient.dll";
        }
        return "./AssistantSeika/SeikaSay2/SeikaSay2.exe";
    })();
    if (access_method === "WCFClient") {
        return new WCFClient(path);
    }
    if (access_method === "HTTP") {
        return new HTTP(url, id, password);
    }
    return new SeikaSay2(path);
};
export default init;
//# sourceMappingURL=index.js.map