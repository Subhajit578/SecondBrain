//"tag" : "bg-purple-100 text-purple-600 hoover:bg-purple-600"
export function Tag({tags} : {tags:string[]}) {
    return (<div className="flex, flex-wrap, gap-2 mt-2">
        {tags.map((tagName) => (
        <div key = {tagName} className="inline-flex bg-purple-100 text-purple-600 hoover:bg-purple-600 px-2 py-2 rounded-2xl font-sans text-xs items-center">
        #{tagName} </div>))}
    </div>)
}