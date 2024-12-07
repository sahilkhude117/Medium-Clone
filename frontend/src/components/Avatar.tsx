
export function Avatar({name ,size="small" } : {name : string ,size:"small"|"big"}) {
    return <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600
                            ${size === 'small' ? "h-6 w-6" : "h-10 w-10"}`}>
    <span className={`${size === 'small' ? 'text-xs' : 'text-md' } text-gray-600 items-center dark:text-gray-300`}>{name[0].toUpperCase()}</span>
    </div>
}