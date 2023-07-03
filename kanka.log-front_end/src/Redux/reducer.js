const initState = {
    baseURL:'https://kanka.io/api/1.0',
    placeholderImage: 'https://th.kanka.io/TMUEmOVYU-ClCFa8I5B9pKvhsb4=/280x210/smart/app/backgrounds/mountain-background-medium.jpg',
    key: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMTRlNWI3MmRlZDgzZmEwMDQyZmEwNTE4YzdlNWVhMmY5YzYyMTQyOGExMDFmMDY1ZDhhZjhlNGJkYWYxM2E2MDQyZjI1MGZmMmZhNzZkNzkiLCJpYXQiOjE2ODc1MzI0NTEuNDM2MTc5LCJuYmYiOjE2ODc1MzI0NTEuNDM2MTg4LCJleHAiOjE3MTkxNTQ4NTEuNDE5NzQsInN1YiI6Ijk1ODUiLCJzY29wZXMiOltdfQ.pvS4XVVrrcnu3SNeMCWc9zyZsPeLVBvHanetPjiflnlSasRUd_A0lsjBcj8jIIPOUdkCHnzXNOrVcGnmEfXywJxeUEi9z_oeMRyAyC-2oQBnwbfO2H01aY2CnythtHL9lh7DTEtXTDhRlmzCXXz920kCeyafIdJX3Ck1IULNletMvGS8hHZwZJUIcwCpBhKTxh1namdzpYy7k--ewSQqpSN9a-cv6lMnAakwIlaMUyc-XH7Gp7P96-0Oy6T2bTxAG8bKc2MSRpTRkedFZz1oEcOGmwEMURZvIuEm4vlViIVTQup8j8Tarrioi1MyDgXYEt8U0PrfGTIo5vL2hmM7plblEPz1LKRn13XbA0FRiuHF7ZzkweUyfE7GX0TvZlEpzGXMi-Yo612bvi_k_HpsbXBTCxyaI4Tn-MThA_irW_PoPTiTRSQf_HbkmN6lVaW221435vH1QL5l-a0hyYdu6Md7hT6OPL6JnintkNPzqNv7MfghVAsG2p4vYWzqMRl6omurRJbYkHzHR-X_khF0b-nhCj3szovU3veVIFJzRFUVQzI3Z35JYNl3tbcgA9pGtxR0u56Lg1ds0WtWwZXY5axB0e38L7gPrC_Ut-0en78ybNWaIAThWwHx9I07Tb7g58Q4aVym7v5WzDKvaOMgGI6uQgwHRMI0y76L6BzoroI',
    campaigns: [],
    userInfo: {},
    entities: [],
    currentEntity:{}
};

export const rootReducer = (state= initState, action={}) => {
    switch (action.type) {
        case 'setCampaigns':
            return {...state, campaigns: action.payload}
        
        case 'setEntities':
            return {...state, entities: action.payload}

        case 'setCurrentEntity':
            return {...state, currentEntity: action.payload };
        default:
            return {...state};
    }
};