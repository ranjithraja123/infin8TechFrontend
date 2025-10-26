import React from 'react'

const BEIComp = () => {
    return (
        <div className='flex gap-8'>

            <div class="box-border border-none shadow-2xl shadow-green-900 rounded-3xl bg-gradient-to-r from-black via-grey-200 to-green-800 w-lg border-4 p-4 text-amber-200">
                <div className='flex justify-between'>
                    <div className='flex flex-col'>
                        <p className='text-3xl italic'>Income</p>
                        <p className='text-sm italic'>1 transactions</p>
                        <p className='mt-8 text-2xl italic font-bold'>$1500</p>
                    </div>
                    <div>
                        <div class=" flex items-center justify-center box-border rounded-full size-30 border-1 p-4">
                            <p className='text-4xl'>72%</p>
                        </div>
                    </div>

                </div>

            </div>
            <div class="box-border border-none shadow-2xl shadow-green-900 rounded-3xl bg-gradient-to-r from-black via-grey-200 to-green-800 w-lg border-4 p-4 text-amber-200">
                <div className='flex justify-between'>
                    <div className='flex flex-col'>
                        <p className='text-3xl italic'>Expense</p>
                        <p className='text-sm italic'>10 transactions</p>
                        <p className='mt-8 text-2xl italic font-bold'>$1500</p>
                    </div>
                    <div>
                        <div class=" flex items-center justify-center box-border rounded-full size-30 border-1 p-4">
                            <p className='text-4xl'>82%</p>
                        </div>
                    </div>

                </div>

            </div>
            <div class="box-border border-none shadow-2xl shadow-green-900 rounded-3xl bg-gradient-to-r from-black via-grey-200 to-green-800 w-lg border-4 p-4 text-amber-200">
                <div className='flex justify-between'>
                    <div className='flex flex-col'>
                        <p className='text-3xl italic'>Balance</p>
                        <p className='text-sm italic'>15 transactions</p>
                        <p className='mt-8 text-2xl italic font-bold'>$1500</p>
                    </div>
                    <div>
                        <div class=" flex items-center justify-center box-border rounded-full size-30 border-1 p-4">
                            <p className='text-4xl'>92%</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default BEIComp
