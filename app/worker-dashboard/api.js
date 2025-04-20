import Cookies from 'react-cookies';
import { callApi } from '../commonApi';

export async function getDashboardData() {
    try {
        const userID = Cookies.load("uid");

        const response = await callApi("getDashboardApplicationInfobyUser", { user_id: userID });
        return response;

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw error;
    }
}