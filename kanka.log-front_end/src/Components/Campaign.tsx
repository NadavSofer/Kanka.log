import React from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { GiOrganigram, GiCastle, GiAxeSword, GiWomanElfFace, GiDoubleDragon } from 'react-icons/gi';
import { MdFamilyRestroom } from 'react-icons/md';
import { FaUserAlt, FaJournalWhills } from 'react-icons/fa';
import { IoBook } from 'react-icons/io5';
import { BsFillCalendarEventFill } from 'react-icons/bs';

function Campaign() {
    const titleArr: string[] = ['Characters', 'Locations', 'Families', 'Items', 'Races', 'Creatures', 'Events', 'Journals', 'Organisations'];
    const iconArr = [FaUserAlt, GiCastle, MdFamilyRestroom, GiAxeSword, GiWomanElfFace, GiDoubleDragon, BsFillCalendarEventFill, FaJournalWhills, GiOrganigram];
    const { campaignId } = useParams();

    return (
        <section
            id="campaigns"
            className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 
        justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5 "
        >
            {titleArr.map((item: string, index: number) => {
                const Icon = iconArr[index];
                return (
                    <div key={index}>
                        <div className="w-50 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl">
                            <Link to={`/${campaignId}/${item}`}>
                                <Icon
                                    className="h-20 w-80 pt-7 object-cover rounded-t-xl text-blue-500"
                                />
                                <div className="px-4 py-3 w-80">
                                    <p className="text-lg font-bold text-black truncate block capitalize">{item}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

export default Campaign;
