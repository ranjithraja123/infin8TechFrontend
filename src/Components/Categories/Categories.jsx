import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faHouse, faBurger, faCartShopping, faBook, faSyringe, faDumbbell, faGamepad } from '@fortawesome/free-solid-svg-icons';

const Categories = () => {
    return (
        <div className="flex flex-col w-full max-w-[480px] border border-none rounded-lg p-2 gap-2 bg-gradient-to-r from-black via-grey-200 to-green-800 shadow-2xl shadow-green-900">

            {/* Box 1 */}
            <div className="flex items-center justify-between h-10 border border-none">
                <div>

                <p className='text-white text-xl'>Categories</p>
                </div>
                <div className="flex text-white items-center">
                    <p className='hover:bg-green-800 p-1 rounded-lg cursor-pointer'>
                        Expense
                    </p>
                    <p className='p-3'>
                        |
                    </p>
                    <p className='hover:bg-green-800 p-1 rounded-lg cursor-pointer'>
                        Income
                    </p>
                </div>
            </div>

            <div className="flex gap-2">

                {/* Box 2 */}
                <div className="flex justify-center items-center border border-none w-1/3 h-[385px] bg-[rgba(91,145,59,0.7)] rounded-lg ">
                    <div className=' flex flex-col justify-center items-center'>

                        <FontAwesomeIcon icon={faHouse} className='text-3xl' />
                        <p className='text-white text-sm mt-2' style={{ textShadow: '0 0 8px #7CFC00' }}  >40 %</p>
                    </div>

                </div>



                {/* Right Side */}
                <div className="flex flex-col w-2/3 gap-2">

                    {/* Box 3 */}
                    <div className="flex justify-center items-center border border-none h-[100px] rounded-lg bg-[rgba(160,200,120,0.4)]">
                        <div className=' flex flex-col justify-center items-center'>

                            <FontAwesomeIcon icon={faBurger} className='text-3xl' />

                            <p className='text-white text-sm mt-2' style={{ textShadow: '0 0 8px #7CFC00' }}  >40 %</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex justify-center items-center border border-none rounded-lg flex-1 h-[80px] bg-[rgb(103,174,110,0.4)]">
                            <div className=' flex flex-col justify-center items-center'>

                                <FontAwesomeIcon icon={faCartShopping} className='text-3xl' />

                                <p className='text-white text-sm mt-2' style={{ textShadow: '0 0 8px #7CFC00' }}  >40 %</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center border border-none rounded-lg flex-1 h-[80px] bg-[rgb(95,139,76,0.4)]">
                            <div className=' flex flex-col justify-center items-center'>

                                <FontAwesomeIcon icon={faBook} className='text-3xl' />

                                <p className='text-white text-sm mt-2' style={{ textShadow: '0 0 8px #7CFC00' }}  >40 %</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex justify-center items-center border border-none rounded-lg flex-1 h-[80px] bg-[rgb(95,139,76,0.4)]">
                            <div className=' flex flex-col justify-center items-center'>

                            <FontAwesomeIcon icon={faSyringe} className='text-3xl' />

                                <p className='text-white text-sm mt-2' style={{ textShadow: '0 0 8px #7CFC00' }}  >40 %</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center border border-none rounded-lg flex-1 h-[80px] bg-[rgb(95,139,76,0.4)]">
                            <div className=' flex flex-col justify-center items-center'>

                            <FontAwesomeIcon icon={faDumbbell} className='text-3xl' />

                                <p className='text-white text-sm mt-2' style={{ textShadow: '0 0 8px #7CFC00' }}  >40 %</p>
                            </div>
                        </div>
                        <div className="flex justify-center items-center border border-none rounded-lg flex-1 h-[80px] bg-[rgb(144,198,124,0.4)]">
                            <div className=' flex flex-col justify-center items-center'>

                            <FontAwesomeIcon icon={faGamepad} className='text-3xl' />

                                <p className='text-white text-sm mt-2' style={{ textShadow: '0 0 8px #7CFC00' }}  >40 %</p>
                            </div>
                        </div>
                    </div>

                    {/* Box 9 */}
                    <div className="flex justify-center items-center border border-none rounded-lg h-[100px] bg-[rgb(103,174,110,0.4)]">
                        <p className='text-white text-sm mt-2' style={{ textShadow: '0 0 8px #7CFC00' }} >Others <span>3%</span></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Categories
