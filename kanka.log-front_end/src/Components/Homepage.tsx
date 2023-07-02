import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../Redux/store'
import { useEffect } from 'react'
import { setCampaigns } from '../Redux/actions'
import { Link } from 'react-router-dom'
function Homepage() {
    const dispatch = useDispatch();
    const key: string = useSelector((state: RootState) => state.key);
    const url: string = useSelector((state: RootState) => state.baseURL);
    const campaigns: unknown[] = useSelector((state: RootState) => state.campaigns);
    const placeholderImage: string = useSelector((state: RootState) => state.placeholderImage);

    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        fetch(`${url}/campaigns`, {
            headers: {
                'Authorization': 'Bearer ' + key,
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                dispatch(setCampaigns(data.data))

            })
    }

    return (
        <section id="campaigns"
            className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 
        justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
            {
                campaigns.map((item: unknown, index: number) => (
                    <div key={index}>
                        <div className="w-80 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                            <Link to={`/${(item as any).id}`}>
                                <img src={(item as any).image_full === '' ? placeholderImage : (item as any).image_full}
                                    alt="Product" className="h-40 w-80 object-cover rounded-t-xl" />
                                <div className="px-4 py-3 w-80">
                                    <p className="text-lg font-bold text-black truncate block capitalize">{(item as any).name}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))
            }
        </section>
    )
}

export default Homepage