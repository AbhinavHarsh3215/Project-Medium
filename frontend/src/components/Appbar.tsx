import { Avatar } from './BlogCard';
import { Link, useNavigate } from 'react-router-dom';

export const Appbar = ({ name }: { name: string }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');  
        navigate('/signin');               
    };

    return (
        <div className="border-b flex justify-between px-10 py-4">
            <Link to={'/blogs'} className="flex flex-col justify-center">
                Medium
            </Link>
            <div>
                <Link to={'/publish'}>
                    <button
                        type="button"
                        className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                    >
                        New
                    </button>
                </Link>
                <button
                    type="button"
                    onClick={logout}
                    className="mr-4 text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                >
                    Logout
                </button>
                <Avatar size="big" name={name}></Avatar>
            </div>
        </div>
    );
};
