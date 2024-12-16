import { FaShieldAlt, FaRobot, FaGlobe, FaDatabase, FaCloud } from "react-icons/fa";

const categories = [
    { name: "Cyber Security", icon: <FaShieldAlt /> },
    { name: "AI", icon: <FaRobot /> },
    { name: "Web Dev", icon: <FaGlobe /> },
    { name: "Data Science", icon: <FaDatabase /> },
    { name: "Cloud", icon: <FaCloud /> },
];

const Category = () => {
    return (
        <div className="w-full py-2 bg-gray-100">
            <h2 className="text-2xl font-semibold text-center mb-4">Categories</h2>
            <div className="flex justify-center space-x-4">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center justify-center p-2 w-24 h-auto bg-gray-50 rounded-md hover:bg-blue-100 transition-shadow shadow-sm cursor-pointer"
                    >
                        <div className="text-xl text-blue-600 mb-1">{category.icon}</div>
                        <p className="text-xs font-medium text-gray-700">{category.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
