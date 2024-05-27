import React, { useState } from 'react'
interface TabsProps {
   onSelectTab: (tab: string) => void;
 }
 

const Tabs: React.FC<TabsProps> = ({ onSelectTab }) => {
      const [activeTab, setActiveTab] = useState("Kanban");
    
      const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        onSelectTab(tab);
      };
  return (
    <>
      <div className="w-full max-w-md mx-auto my-6 border border-purple-200">
  <div className="flex">
    <button  className={`w-full py-2 px-4 text-sm font-medium ${
              activeTab === "Kanban"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-500 border-b-2 border-transparent"
            } focus:outline-none hover:text-purple-500`}
            onClick={() => handleTabClick("Kanban")}>
      Kanban View
    </button>
    <button className={`w-full py-2 px-4 text-sm font-medium ${
              activeTab === "List"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-500 border-b-2 border-transparent"
            } focus:outline-none hover:text-purple-500`}
            onClick={() => handleTabClick("List")}>
      List View
    </button>
    <button className={`w-full py-2 px-4 text-sm font-medium ${
              activeTab === "Grid"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-500 border-b-2 border-transparent"
            } focus:outline-none hover:text-purple-500`}
            onClick={() => handleTabClick("Grid")}>
      Grid View
    </button>
  </div>
</div>

    </>
  )
}

export default Tabs;
