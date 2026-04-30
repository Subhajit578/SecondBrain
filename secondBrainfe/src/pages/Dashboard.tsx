import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CreateContentModal } from "../components/CreateContentModal";
import { Sidebar } from "../components/Sidebar";
import { ArticleIcon } from "../icons/ArticleIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { ShareIcon } from "../icons/ShareIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { useContent } from "../hooks/useContent";
import { ShareContentModal } from "../components/ShareContentModal";
import { useAuth } from "../hooks/useAuth";
import { UserModal } from "../components/UserModal";
import { SearchBar } from "../components/SearchBar";
import { useSearch } from "../hooks/useSearch";
export function Dashboard() {
    type ContentType = 'tweet' | 'youtube' | 'article' | 'document' | 'link';
    const [modalOpen,setModalOpen] = useState(false)
    const [filter, setFilter] = useState<null | ContentType>(null);
    const [shareModal, setShareModalOpen]= useState(false)
    const {contents,refresh} = useContent() 
    const {results, active, search, clear} = useSearch()
    const { user} = useAuth();
    const visible = filter ? contents.filter(c => c.type === filter) : contents;
    const displayItems = active ? results : visible
    return <div className="flex">
        <Sidebar onSelect={(type) => setFilter(type)}/>
        <div className="ml-96 flex-1">
            
        <CreateContentModal open = {modalOpen} onClose={() => {
            setModalOpen(false)
            refresh();
        }}/>
        <ShareContentModal open= {shareModal} onClose={() => {
            setShareModalOpen(false)
            refresh();
        }}/>
        
        <div className="bg-white py-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold whitespace-nowrap shrink-0">
            {active ? "Search Results" : "All Notes"}
            </h1>
        <div className="flex mr-8 justify-end gap-4">
        {user && (
            <>
                <SearchBar onSearch={search} onClear={clear} />
                <Button text="Share Brain" startIcon={<ShareIcon/>}
                    onClick={() => setShareModalOpen(true)}
                    variant="secondary" fullWidth={false} loading={false}/>
                <Button text="Add Content" startIcon={<PlusIcon/>}
                    onClick={() => setModalOpen(true)}
                    variant="primary" fullWidth={false} loading={false}/>
            </>
        )}
        <UserModal />
    </div>
        </div>
        {/* interface CardProps {
        title: string
        link : string,
        type:'tweet' | 'youtube' | 'article' | 'document' ,
        icon: ReactElement, 
        date: string, 
        tag : string[]
        }*/}
        <div className = "flex flex-wrap gap-4">
        {/* <Card title = "How to activate Focus" type = "youtube" link ="https://www.youtube.com/watch?v=9ktV_AaHbmY" tag = {tags} icon= {<YoutubeIcon/>} date = "11/8/2025"/>
        <Card title = "Science Tweet" type = "tweet" link ="https://x.com/gunsnrosesgirl3/status/1985619415904251978" tag = {tags} icon= {<TwitterIcon/>} date = "11/8/2025"/>
        <Card title = "How to activate Focus " type = "youtube" link ="https://www.youtube.com/watch?v=9ktV_AaHbmY" tag = {tags} icon= {<YoutubeIcon/>} date = "11/8/2025"/>
        <Card title = "Science Tweet" type = "tweet" link ="https://x.com/gunsnrosesgirl3/status/1985619415904251978" tag = {tags} icon= {<TwitterIcon/>} date = "11/8/2025"/>
        <Card title = "How to activate Focus" type = "youtube" link ="https://www.youtube.com/watch?v=9ktV_AaHbmY" tag = {tags} icon= {<YoutubeIcon/>} date = "11/8/2025"/>
        <Card title = "Science Tweet" type = "tweet" link ="https://x.com/gunsnrosesgirl3/status/1985619415904251978" tag = {tags} icon= {<TwitterIcon/>} date = "11/8/2025"/>
        <Card title = "Science Article" type = "article" link ="https://www.nytimes.com/2025/11/03/science/duchin-math-elections-gerrymandering.html" tag = {tags} icon= {<ArticleIcon/>} date = "11/8/2025"/> */}
        {/* interface CardProps {
    title: string
    link : string,
    type:'tweet' | 'youtube' | 'article' | 'document' ,
    icon: ReactElement, 
    date: string, 
    tag : string[]
} */}
        {displayItems.map(({id, title, link, type, date, tags}) => 
        {
            let icon = null;
            if(type == "youtube") icon = <YoutubeIcon />
            else if(type == "tweet") icon = <TwitterIcon/>
            else if(type == "article") icon = <ArticleIcon/>
            else icon = <ArticleIcon/>
            const cleanedDate = new Date(date).toISOString().split("T")[0]
            return (
                <Card key = {id} id = {id} title={title} link = {link} icon = {icon} type = {type} date = {cleanedDate} tag = {tags} onDelete={refresh}/>
            )
        } 
        )}
        </div>
        </div>
    </div>
}