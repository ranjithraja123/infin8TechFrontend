import React from 'react'
import RequestsTable from '../../Components/RequestTable/RequestsTable'


const Requests = () => {
    return (
        <div className='expense'>

            <div>
                <div className=''>

                    <div className='flex justify-between p-4'>

                        <p className='font-bold text-4xl'>Requests</p>

                    </div>

                    <div className='p-4'>
                        <RequestsTable />
                    </div>



                </div>


            </div>
        </div>
    )
}

export default Requests
