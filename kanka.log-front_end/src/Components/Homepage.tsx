import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../Redux/store'
import { useState, useEffect } from 'react'
import { setCampaigns } from '../Redux/actions'

function Homepage() {
    const dispatch = useDispatch()
    const key: string = useSelector((state: RootState) => state.key);
    const url: string = useSelector((state: RootState) => state.baseURL);
    const campaigns: unknown[] = useSelector((state: RootState) => state.campaigns);

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
        <div>
            {
            campaigns.map((item: unknown, index: number) => (
                <div key={index}>
                    <h3>{(item as any).name}</h3>
                </div>
            ))
            }
        </div>
    )
}

export default Homepage