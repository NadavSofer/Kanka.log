import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../utils/firebase'


function Navbar() {

    const [user, loading] = useAuthState(auth);


    return (
        <nav
            className="flex items-center justify-between flex-wrap bg-white lg:px-12 shadow border-solid">
            <div className="flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-solid border-b-2 border-gray-300 pb-5 lg:pb-0">
                <Link to='/' className="flex items-center flex-shrink-0 text-gray-800 mr-16">
                    <span className="font-semibold text-xl tracking-tight">Kanka<span className='text-blue-500'>.Log</span></span>
                </Link>
                <div className="block lg:hidden ">
                    <button
                        id="nav"
                        className="flex items-center px-3 py-2 border-2 rounded text-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500">
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="menu w-full lg:block flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8">
                <div className="text-md font-bold text-blue-500 lg:flex-grow">

                    <a href="#responsive-header"
                        className="block py-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 hover:bg-blue-500 mr-2">
                        Menu 1
                    </a>
                </div>
                {!user && (
                    <div className="flex ">
                        <Link to="/Signup"
                            className="block text-md px-4 py-4 text-blue-500 ml-2 font-bold hover:text-white hover:bg-blue-500 lg:mt-0">Sign up</Link>

                        <Link to="/Login"
                            className=" block text-md px-4  ml-2 py-4 text-blue-500 font-bold hover:text-white hover:bg-blue-500 lg:mt-0">login</Link>
                    </div>
                )}

                {user && (
                    <div className="flex ">
                        <button onClick={()=> auth.signOut()} 
                        className='block py-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 hover:bg-blue-500 mr-2'>
                            sign out
                        </button>
                        {user.photoURL && <img src={user.photoURL} className='h-20 block py-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 mr-2 h-20'/>}
                    </div>
                )}

            </div>

        </nav>
    )
}

export default Navbar