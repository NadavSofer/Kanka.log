import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {

    return (
        <footer className="bg-white rounded-lg shadow-inner dark:bg-gray-800" style={{ position: 'fixed', bottom: '0', width: '100vw' }}>
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="#" className="hover:underline">Nadav Sofer</a>
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <Link to="/About" className="mr-4 hover:underline md:mr-6 ">About</Link>
                    </li>
                    <li>
                        <a href="https://kanka.io/" target='blank' className="mr-4 hover:underline md:mr-6">Kanka</a>
                    </li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer