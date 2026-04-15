import { AllIcon } from "../icons/AllIcon";
import { ArticleIcon } from "../icons/ArticleIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { LinkIcon } from "../icons/LinkIcon";
import { Logo } from "../icons/Logo";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";
type ContentType = 'tweet' | 'youtube' | 'article' | 'document' | 'link';

export function Sidebar({onSelect} : { onSelect : (type:ContentType | null) =>void}) {
    return <div className="h-screen w-68 bg-gray-100 fixed top-0 left-0 pl-6">
        <div className=" pt-8 text-2xl flex items-center font-semibold">
        <div className="pr-2 text-purple-700">
            <Logo/>
        </div>
        Second Brain
        </div>
        <div className="pt-8 pl-4">
            <SidebarItem text= "All" icon={<AllIcon/>} onClick={()=>onSelect(null)}/>
            <SidebarItem text = "Tweets" icon = {<TwitterIcon />} onClick={()=>onSelect("tweet")}/>
            <SidebarItem text = "Videos" icon = {<YoutubeIcon />} onClick={()=>onSelect("youtube")}/>
            <SidebarItem text = "Document" icon = {<DocumentIcon />} onClick={()=>onSelect("document")}/>
            <SidebarItem text = "Link" icon = {<LinkIcon />} onClick={()=>onSelect("link")}/>
            <SidebarItem text = "Article" icon = {<ArticleIcon />} onClick={()=>onSelect("article")}/>
        </div>
    </div>
}