import React from "react";


const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      
      <div className="max-w-3xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
        <p className="text-gray-700">
          This is the admin dashboard where you can manage bookings and availability.
        </p>
      </div>
      {children}
    </div>
  );
};

export default layout;