import React from 'react'
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Campaign() {

    const titleArr: string[] = ['Characters', 'Locations', 'Families', 'Items', 'Races', 'Quests', 'Events', 'Journals', 'Organisations']
    const { campaignId } = useParams()
    

    return (
        <section id="campaigns"
            className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 
        justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
            {
                titleArr.map((item: unknown, index: number) => (
                    <div key={index}>
                        <div className="w-80 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                            <Link to={`/${campaignId}/${(item as string)}`}>
                                <img src=''
                                    alt="Product" className="h-40 w-80 object-cover rounded-t-xl" />
                                <div className="px-4 py-3 w-80">
                                    <p className="text-lg font-bold text-black truncate block capitalize">{(item as string)}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))
            }
        </section>
    )
}

export default Campaign