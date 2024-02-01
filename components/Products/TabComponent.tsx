import React from 'react';

interface TabComponentProps {
  activeTab: string;
  handleTabChange: (tab: string) => void;
}

const TabComponent: React.FC<TabComponentProps> = ({ activeTab, handleTabChange }) => {
  return (
    <div className="tab-container w-[100%]">
        <button onClick={() => handleTabChange('tab1')} className={`tab-button ${activeTab === 'tab1' ? 'active' : ''}`}>Description</button>
        <button onClick={() => handleTabChange('tab2')} className={`tab-button ${activeTab === 'tab2' ? 'active' : ''}`}>Technical specification</button>
        <button onClick={() => handleTabChange('tab3')} className={`tab-button ${activeTab === 'tab3' ? 'active' : ''}`}>From the manufacturer</button>
        <button onClick={() => handleTabChange('tab4')} className={`tab-button ${activeTab === 'tab4' ? 'active' : ''}`}>Warranty & additional information</button>
    </div>

  );
};

export default TabComponent;
