import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../Redux/store'
import { useEffect } from 'react'
import { setCampaigns } from '../Redux/actions'
import { Link } from 'react-router-dom'
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import landscape from '../landscape.jpeg'


function Homepage() {
    const dispatch = useDispatch();
    const key: string = useSelector((state: RootState) => state.key);
    const url: string = useSelector((state: RootState) => state.baseURL);
    const campaigns: unknown[] = useSelector((state: RootState) => state.campaigns) || [];
    const placeholderImage: string = useSelector((state: RootState) => state.placeholderImage);
    const [user, loading] = useAuthState(auth);

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

    const divStyle: React.CSSProperties = {
        backgroundImage: `url(${landscape})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
    };

    const outerDivStyle: React.CSSProperties = {
        backgroundColor: '#F9FAFB',
        opacity: 0.9,
        backgroundImage: 'radial-gradient(#0008ff 0.9px, transparent 0.9px), radial-gradient(#0008ff 0.9px, #F9FAFB 0.9px)',
        backgroundSize: '36px 36px',
        backgroundPosition: '0 0,18px 18px',
    };

    return (
        <>
            {user && (
                <section
                    id="campaigns"
                    className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
                >
                    {campaigns.map((item: unknown, index: number) => (
                        <div key={index}>
                            <div className="w-80 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                                <Link to={`/${(item as any).id}`}>
                                    <img
                                        src={
                                            (item as any).image_full === ''
                                                ? placeholderImage
                                                : (item as any).image_full
                                        }
                                        alt="Product"
                                        className="h-40 w-80 object-cover rounded-t-xl"
                                    />
                                    <div className="px-4 py-3 w-80">
                                        <p className="text-lg font-bold text-black truncate block capitalize">
                                            {(item as any).name}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {!user && (
                <div style={outerDivStyle}>
                    <div className='w-4/5 mx-auto' style={{ height: '84vh' }}>
                        <div className='h-3/5 flex flex-col items-center justify-end' style={divStyle}>
                            <div className='h-3/4 flex items-center justify-center w-full text-center'>
                            <span className=" font-semibold text-xl tracking-tight w-full py-8 bg-white/70">Kanka<span className='text-blue-500'>.Log</span></span>
                            </div>
                            <Link to='/Signup' className="animate-bounce hover:animate-none text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-l px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mb-4">
                                Sign Up
                            </Link>
                        </div>
                        <div className='h-2/5 flex justify-center items-start'>
                            <Link to='/Login' className=" text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-l px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-4">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Homepage