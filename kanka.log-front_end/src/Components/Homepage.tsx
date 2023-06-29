import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../Redux/store'
import { useEffect } from 'react'
import { setCampaigns } from '../Redux/actions'
import { Link } from 'react-router-dom'
function Homepage() {
    const dispatch = useDispatch()
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
                console.log(data.data);
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
                                    <div className="flex items-center">
                                        <p className="text-lg font-semibold text-black cursor-auto my-3">$149</p>
                                        <div className="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                            fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">
                                            <path fillRule="evenodd"
                                                d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                                            <path
                                                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                                        </svg></div>
                                    </div>
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