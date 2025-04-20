import Cookies from "react-cookies";

export const getUserToken = () => {
    try {
        const token = Cookies.load('data');
        return token;
    } catch (error) {
        return null;
    }
}