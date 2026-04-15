// src/pages/SharedBrain.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "../components/Card";
import { Sidebar } from "../components/Sidebar";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { TwitterIcon } from "../icons/TwitterIcon";
import { ArticleIcon } from "../icons/ArticleIcon";
import { UserModal } from "../components/UserModal";
import { BACKEND_URL } from "../config";

interface SharedContent {
    _id: string;
    title: string;
    link: string;
    type: "youtube" | "tweet" | "article";
    tags?: string[];
    date?: string;
}

export function SharedBrain() {
    type ContentType = 'tweet' | 'youtube' | 'article' | 'document' | 'link';
    const { hash } = useParams();
    const [username, setUsername] = useState("");
    const [contents, setContents] = useState<SharedContent[]>([]);
    const [filter, setFilter] = useState<null | ContentType>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/app/v1/brain/shareLink/${hash}`)
            .then((res) => {
                setUsername(res.data.username);
                setContents(res.data.content);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [hash]);

    const visible = filter
        ? contents.filter(c => c.type === filter)
        : contents;

    if (loading) return <div className="h-screen flex items-center justify-center text-lg">Loading...</div>;
    if (error) return <div className="h-screen flex items-center justify-center text-lg text-red-500">Link not found or expired.</div>;

    return (
        <div className="flex">
            <Sidebar onSelect={(type) => setFilter(type)} />
            <div className="ml-96 flex-1">
                <div className="bg-white py-6 flex items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold whitespace-nowrap shrink-0">
                        {username}'s Notes
                    </h1>
                    <div className="flex mr-8 justify-end gap-4 items-center">
                        <UserModal />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    {visible.map((c) => {
                        let icon = null;
                        if (c.type === "youtube") icon = <YoutubeIcon />;
                        else if (c.type === "tweet") icon = <TwitterIcon />;
                        else icon = <ArticleIcon />;
                        const date = c.date ? new Date(c.date).toISOString().split("T")[0] : "";
                        return (
                            <Card
                                key={c._id}
                                id={c._id}
                                title={c.title}
                                link={c.link}
                                icon={icon}
                                type={c.type}
                                date={date}
                                tag={c.tags ?? []}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}