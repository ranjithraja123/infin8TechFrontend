import React from 'react'
import BEIComp from '../../Components/BeiComp/BEIComp'
import './dashboard.css'
import Categories from '../../Components/Categories/Categories'
import Stats from '../../Components/Statistics/Stats'
import Reminders from '../../Components/Reminders/Reminders'
import Balance from '../../Components/Balance/Balance'
import Transactions from '../../Components/Transactions/Transactions'
import Goal from '../../Components/Goal/Goal'

const Dashboard = () => {
    return (
        <>
            <div className='dashboard flex flex-col p-4'>

                <div className='h-full mt-5'>

                    <BEIComp />
                </div>
                <div className='flex gap-3 mt-5'>

                    <Categories />
                    <Stats />
                    <Reminders />
                </div>
                <div className="flex gap-1">
                    <div className="flex-1 mt-5">
                        <Balance />
                    </div>
                    <div className="flex-1 -mt-20 -ml-12">
                        <Transactions />
                    </div>
                    <div className="flex-1 -mt-20 ">
                        <Goal />
                    </div>
                </div>


            </div>

        </>
    )
}

export default Dashboard
