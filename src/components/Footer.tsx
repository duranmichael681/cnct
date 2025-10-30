
export default function Footer() {
    return (
        <div className="bg-[#161616] w-full p-10 text-white">
            <div className="flex gap-6 items-center">
                <h2 className="text-4xl font-bold">CNCT</h2>
                <hr className="border-white border-1 h-10" />
                <span className="font-bold italic">Connect. Plan. Show Up. </span>
            </div>
            <div className="flex py-10 gap-6">
                <hr className="border-white border-1 h-22" />
                <div className="flex flex-col gap-2">
                    <a href="">Meet the Team</a>
                    <a href="">FAQ</a>
                    <a href="">About</a>
                </div>
            </div>
            <a href="" className="text-[var(--primary)]">Back to the Top</a>
        </div>
    )
}