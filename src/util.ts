export function hash( n :number ) :String {
    let hash : String = "";
    const options: String = "qwertyuiopasdfghjklzxcvbnm"
    for(let i=0;i<n;i++) {
         hash = hash + options[Math.floor(Math.random() * options.length)]
    }
    return hash;
}