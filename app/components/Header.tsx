const Header = () => {
    return (
        <div className="flex justify-center mt-8 items-center">
            <div className="flex flex-col justify-center items-center gap-4">
                <div className="relative w-72 h-44">
                    <img src="/images/Duaelity_logo.png" alt="Duaelity logo" className="w-full h-full absolute object-cover" />
                </div>
                <span className="font-semibold font-heading text-6xl">Duel Your Way to the Top</span>
            </div>
        </div>
    )
}

export default Header;