export const setCampaigns = (arr:[]) => {
    return {
        type: 'setCampaigns',
        payload: arr
    }
}

export const setEntities = (arr:[]) => {
    return {
        type: 'setEntities',
        payload: arr
    }
}

export const setCurrentEntity = (id:string) => {
    return {
        type: 'setCurrentEntity',
        payload: id
    }
}