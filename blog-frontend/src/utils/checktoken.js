import axios from 'axios';

export const checkTokenValidity = async (token) => {
    try {
        const response = await axios.get('http://localhost:5000/api/auth/', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
        if (response.status === 200) return true;
        else {
            return false;
        }
    } catch (error) {
        return false; 
    }
};

export const createGuestToken = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/auth/guest', {
            withCredentials: true, 
        });
        if (response.status === 201) return response.data.token; 
        return false;
    } catch (error) {
        return false; 
    }
};
