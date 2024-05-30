import React from 'react'

const ActivityLog: React.FC<{
   activityLog: string[]; //property activityLog is passed from Home.tsx
   }> = ({activityLog}) => {
  return (
   <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6 ">Activity Log</h1>
      <div className="bg-purple-100 shadow-md rounded-md">
        <table className="min-w-full divide-y divide-purple-200">
          <thead className="bg-purple-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-purple-500 uppercase tracking-wider">Activity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-purple-200">
            {/* Mapping activityLog array of strings and displaying each activity */}
            {activityLog.map((activity, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm text-purple-700">{activity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
);
}

export default ActivityLog
