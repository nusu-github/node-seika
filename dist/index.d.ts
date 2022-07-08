import HTTP from "./method/HTTP.js";
import SeikaSay2 from "./method/SeikaSay2.js";
import WCFClient from "./method/WCFClient.js";
export { HTTP, SeikaSay2, WCFClient };
/**
 * AssistantSeikaへのアクセス方法を指定して使えるようにする
 * @param option
 */
declare const init: (option?: {
    access_method?: "SeikaSay2" | "WCFClient" | "HTTP";
    path?: string;
    url?: string;
    id?: string;
    password?: string;
}) => Promise<HTTP | SeikaSay2 | WCFClient>;
export default init;
//# sourceMappingURL=index.d.ts.map