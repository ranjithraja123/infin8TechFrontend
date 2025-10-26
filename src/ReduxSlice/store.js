import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../ReduxSlice/authSlice'
import organizationReducer from './organizationSlice';
import expenseReducer from './expenseTableSlice';
import merchantREducer from './merchantSlice';
import categoryReducer from './categorySlice';




export const store = configureStore({
    reducer: {
        auth:authReducer,
        organization: organizationReducer,
        expense:expenseReducer,
        merchants:merchantREducer,
        category:categoryReducer
    }
})