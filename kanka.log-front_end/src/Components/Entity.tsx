import React from 'react'
import { RootState } from '../Redux/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChatGPT from './ChatGPT';

//name, entry

function Entity() {
    const key: string = useSelector((state: RootState) => state.key);
    const url: string = useSelector((state: RootState) => state.baseURL);
    const { entity_id } = useParams();
    
    return (
        <div>
            <h1>{entity_id}</h1>
            <ChatGPT/>
        </div>
    )
}



export default Entity
