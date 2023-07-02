import React from 'react'
import { useEffect, useState } from 'react'
import { RootState } from '../Redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setEntities } from '../Redux/actions';
import { Link } from 'react-router-dom';

function Entity() {
    const key: string = useSelector((state: RootState) => state.key);
    const url: string = useSelector((state: RootState) => state.baseURL);
    const entities: unknown[] = useSelector((state: RootState) => state.entities);
    const { category, campaignId } = useParams();
    const dispatch = useDispatch();


    useEffect(() => {
        getData()
    }, [])

    const getData = () => {
        fetch(`${url}/campaigns/${campaignId}/${(category as string).toLowerCase()}`, {
            headers: {
                'Authorization': 'Bearer ' + key,
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.data);
                dispatch(setEntities(data.data))

            })
    }


    return (
        <div>
            <h1>{category}</h1>

            <section id="campaigns"
                className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 
        justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {
                    entities.map((item: unknown, index: number) => (
                        <div key={index}>
                            <div className="w-80 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                            <Link to={`/${campaignId}/${(category as string).toLowerCase()}/${(item as any).entity_id}`}>
                                    <img src={(item as any).image_full}
                                        alt={`${(item as any).name}`} className="h-48 w-80 object-cover rounded-t-xl" />
                                    <div className="px-4 py-3 w-80">
                                        <p className="text-lg font-bold text-black truncate block capitalize">{(item as any).name}</p>
                                        <p>{(item as any).entity_id}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))
                }
            </section>

        </div>
    )
}



export default Entity
