import { YoutubeTranscript } from "youtube-transcript";
import {JSDOM} from "jsdom"
import { Readability } from "@mozilla/readability";
type ContentType  = "youtube" | "tweet" | "article" | "document" | "link"
// create a extractText function which takes link, type, title, tags 
export async function extractText(
    type: ContentType,
    title: string,
    link: string | undefined,
    tags: string[]
): Promise<string> {
const baseline = [title, ...tags].join(" ");
if(!link) {
    return baseline;
}
try {
    if(type === "youtube") {
        const { YoutubeTranscript } = await import("youtube-transcript");
        const transcript = await YoutubeTranscript.fetchTranscript(link);
        const transcriptText = transcript.map(t => t.text).join(" ");
        return `${baseline}\n\n${transcriptText}`.slice(0, 30000);
    }
    if(type === "article") {
        const res = await fetch(link);
        const html = await res.text();
        const dom = new JSDOM(html, {url: link})
        const article = new Readability(dom.window.document).parse();
        if(article?.textContent) {
            return `${baseline}\n\n${article.textContent}`.slice(0, 30000);
        }
        return baseline;
    }
    if(type === "tweet") {
        return baseline
    }
    return baseline;
} catch (err ) {
    console.log("Erorr Extraction in ", err)
    return baseline;
}
}