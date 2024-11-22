interface QuickLinksProps {
    link: string;
    title: string;
}

const QuickLinks = ({link, title}: QuickLinksProps) => {
    return (
        <div className="mb-8 w-full sm:w-auto">
            <a className="p-3 sm:p-4 rounded-full bg-slate-600 font-roboto hover:opacity-85 duration-200 transition w-full sm:w-auto text-center" href={`${link}`}>{title}</a>
        </div>
    )
}

export default QuickLinks;