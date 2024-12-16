import React from "react";
import { jwtDecode } from "jwt-decode";
import MonthlyReportsImage from "../../images/Monthly_Reports.png";
import TaskCompletionIllustration from "../../images/Bug fixing process image.jpg";
import SignupSuccessIllustration from "../../images/SignupSuccessIllustration.jpg";
import ServerUptimeMonitoring from "../../images/Server uptime monitoring.png";
import PushNotification from "../../images/Push notification.jpg";
import BusinessPerformanceTracking from "../../images/Business performance tracking.jpg";
import { checkTokenValidity } from '../../utils/checktoken';
import { useEffect } from "react";

const Dashboard = () => {

    useEffect(() => {
        const handleToken = async () => {
            const token = localStorage.getItem('Access-Token');
            let isValid = false;
            if (token) {
                isValid = await checkTokenValidity(token);
            }
            if (isValid) {
                try {
                    const decodedToken = jwtDecode(token);
                    const role = decodedToken.role;

                    if (role !== "root" && role !== 'admin') {
                        window.location.href = "/admin/login";
                    }
                } catch (error) {
                    window.location.href = "/admin/login";
                }
            } else {
                window.location.href = "/admin/login";
            }
        }
        handleToken();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h2>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Monthly Reports Card */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all">
                    <h3 className="font-bold text-xl mb-2 px-4 mt-2 text-gray-800">Monthly Reports</h3>
                    <img
                        src={MonthlyReportsImage}
                        alt="Monthly Reports"
                        className="w-full h-48 object-cover"
                    />
                    <p className="px-4 mt-2 text-gray-600">
                        View detailed monthly analytics and trends.
                    </p>
                </div>

                {/* Resolved Reports Card */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all">
                    <h3 className="font-bold text-xl mb-2 px-4 mt-2 text-gray-800">Resolved Issues</h3>
                    <img
                        src={TaskCompletionIllustration}
                        alt="Monthly Reports"
                        className="w-full h-48 object-cover"
                    />
                    <p className="px-4 mt-2 text-gray-600">
                        Explore resolved tickets and resolution timelines.
                    </p>
                </div>

                {/* New User Signups Card */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all">
                    <h3 className="font-bold text-xl mb-2 px-4 mt-2 text-gray-800">New Signups</h3>
                    <img
                        src={SignupSuccessIllustration}
                        alt="Monthly Reports"
                        className="w-full h-48 object-cover"
                    />
                    <p className="px-4 mt-2 text-gray-600">
                        Analyze new user signups and conversion rates.
                    </p>
                </div>

                {/* Server Status Card */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all">
                    <h3 className="font-bold text-xl mb-2 px-4 mt-2 text-gray-800">Server Status</h3>
                    <img
                        src={ServerUptimeMonitoring}
                        alt="Monthly Reports"
                        className="w-full h-48 object-cover"
                    />
                    <p className="px-4 mt-2 text-gray-600">
                        Real-time server health and uptime statistics.
                    </p>
                </div>

                {/* Notifications Card */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all">
                    <h3 className="font-bold text-xl mb-2 px-4 mt-2 text-gray-800">Notifications</h3>
                    <img
                        src={PushNotification}
                        alt="Monthly Reports"
                        className="w-full h-48 object-cover"
                    />
                    <p className="px-4 mt-2 text-gray-600">
                        Get instant updates on system alerts and messages.
                    </p>
                </div>

                {/* Performance Analytics Card */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-all">
                    <h3 className="font-bold text-xl mb-2 px-4 mt-2 text-gray-800">Performance Analytics</h3>
                    <img
                        src={BusinessPerformanceTracking}
                        alt="Monthly Reports"
                        className="w-full h-48 object-cover"
                    />
                    <p className="px-4 mt-2 text-gray-600">
                        Dive into detailed performance metrics and KPIs.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
