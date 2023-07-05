import React, { useEffect, useState } from 'react';
import { RootState } from '../Redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setEntities } from '../Redux/actions';
import { Link } from 'react-router-dom';

function Category() {
    const key: string = useSelector((state: RootState) => state.key);
    const url: string = useSelector((state: RootState) => state.baseURL);
    const entities: unknown[] = useSelector((state: RootState) => state.entities) || [];
    const { category, campaignId } = useParams();
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        getData(currentPage);
    }, [currentPage]);


    const getData = (page: number) => {
        fetch(`${url}/campaigns/${campaignId}/${(category as string).toLowerCase()}?page=${page}`, {
            headers: {
                'Authorization': 'Bearer ' + key,
                'Content-type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                dispatch(setEntities(data.data));
                setTotalPages(data.meta.last_page);
            });
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    return (
        <div>
            <h1>{category}</h1>

            <section id="campaigns" className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
                {entities.map((item: unknown, index: number) => (
                    <div key={index}>
                        <div className="w-80 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                            <Link to={`/${campaignId}/${(category as string).toLowerCase()}/${(item as any).id}`}>
                                <img src={(item as any).image_full ? (item as any).image_full: (item as any).image_thumb} alt={`${(item as any).name}`} className="h-48 w-80 object-cover rounded-t-xl" />
                                <div className="px-4 py-3 w-80">
                                    <p className="text-lg font-bold text-black truncate block capitalize">{(item as any).name}</p>
                                    <p>{(item as any).entity_id}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                ))}


            </section>
            <div className="pagination flex items-center px-3 py-2 justify-center">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className='flex items-center px-3 py-2 border-2 rounded text-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500'>
                    Prev
                </button>
                <span className='mx-4'>{currentPage}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className='flex items-center px-3 py-2 border-2 rounded text-blue-500 border-blue-500 hover:text-blue-500 hover:border-blue-500'>
                    Next
                </button>
            </div>

        </div>
    );
}

export default Category;
