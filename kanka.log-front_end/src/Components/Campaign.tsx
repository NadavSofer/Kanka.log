import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../Redux/store'

function Campaign() {
    const key: string = useSelector((state: RootState) => state.key);
    const url: string = useSelector((state: RootState) => state.baseURL);

    

    return (
        <div>

        </div>
    )
}

export default Campaign