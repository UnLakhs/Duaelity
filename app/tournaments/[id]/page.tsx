import { PageProps } from "@/.next/types/app/layout";


const tournamentDetails = async ({params}: PageProps) => {
    const { id } = await params;    //for nextjs 15, the await is needed. Otherwise an error occurs
    return (
        <div className="flex flex-col justify-center text-center text-black gap-4">
            <h1>welcome to {id}</h1>
        </div>
    )       
}   

export default tournamentDetails;