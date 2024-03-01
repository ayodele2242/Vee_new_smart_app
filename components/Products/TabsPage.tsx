import React, { useEffect, useRef, useState } from 'react';
import TabComponent from './TabComponent';
import IframeResizer from 'iframe-resizer-react';;
import MessageData from './message-data'

interface TabPageProps{
  loading: boolean;
  product: any;
}

interface TechnicalSpecification {
  headerName: string;
  attributeName: string;
  attributeValue: string;
}

const TabsPage: React.FC<TabPageProps> = ({product, loading}) => {

  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<string>('900px');
  const [activeTab, setActiveTab] = useState<string>('tab1');
  const [attributeContent, setAttributeContent] = useState('');
  const [technicalContent, setTechnicalContent] = useState('');
  const [genralInfo,  setGeneralInfo] = useState('');
  const [messageData, setMessageData] = useState(undefined);
  const [url, setUrl] = useState('');
  const groupedSpecifications: Record<string, TechnicalSpecification[]> = {};

 
  const attributeValue = (product?.technicalSpecifications?.[0]?.attributeValue || '') || '';

  const attributeDisplay = (product?.technicalSpecifications?.[0]?.attributeDisplay || '') || '';

  const technicalSpecifications = product?.technicalSpecifications || '';

// Group the attributes by headerName
// Group the attributes by headerName
if (Array.isArray(product?.technicalSpecifications)) {
  product?.technicalSpecifications.forEach((spec: TechnicalSpecification) => {
    if (!groupedSpecifications[spec.headerName]) {
      groupedSpecifications[spec.headerName] = [];
    }
    groupedSpecifications[spec.headerName].push(spec);
  });
} else {
  console.error("technicalSpecifications is not an array.");
}


  const onLoad = () => {
    if (ref.current?.contentWindow) {
      setHeight(`${ref.current.contentWindow.document.body.scrollHeight}px`);
    }
  };
  
 

  const onResized = (data: React.SetStateAction<undefined>) => setMessageData(data)

  const onMessage = (data: React.SetStateAction<undefined>) => {
    setMessageData(data)
    //ref.current.sendMessage('Hello back from parent page')
  }


  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    // Extract URL from attributeDisplay javascript:window.open
    const attributeValue = product?.technicalSpecifications[0]?.attributeValue || '';
    const urlMatch = attributeValue.match(/window.open\('([^']+)'/);
    
    if (urlMatch && urlMatch[1]) {
      const url = urlMatch[1];
      setAttributeContent(url)
      
    }else{
     // const url = attributeValueUrl[1];
      //setAttributeContent(url)
    }

}, []);

useEffect(() => {
  onLoad();

  window.addEventListener('resize', onLoad);
  return () => {
    window.removeEventListener('resize', onLoad);
  };
}, []);


useEffect(() => {
  if (Array.isArray(technicalSpecifications)) {
    technicalSpecifications.forEach((spec) => {
      if (spec.attributeValue.includes('window.open')) {
        const urlMatch = spec.attributeValue.match(/window\.open\('([^']+)'/);
        if (urlMatch && urlMatch[1]) {
          setUrl(urlMatch[1]);
        }
        setGeneralInfo(spec.attributeValue);
      }
    });
  }
}, [technicalSpecifications]);


useEffect(() => {
  const iframeDocument = ref.current?.contentDocument;
  if (iframeDocument) {
    const editableElement = iframeDocument.querySelector('.editable');
    if (editableElement) {
      //setGeneralInfo(editableElement.innerHTML);
    }
  }
}, [url]);

  return (
    <div className="mt-5 mb-8">
      
      <TabComponent 
        activeTab={activeTab} 
        handleTabChange={handleTabChange} 
      />
  
      {activeTab === 'tab1' && 
      <div className="tab-content pt-5">
        <div className="attributeName">
        <span dangerouslySetInnerHTML={{ __html: product?.descr }} />
        </div>
        
        </div>}
      {activeTab === 'tab2' && 
      <div className="tab-content">
       
          
       {Object.entries(groupedSpecifications).map(([headerName, attributes]) => (
    <div key={headerName} className="group informationDetails">
        <div className="bg-gray-200 p-3 ">{headerName}</div>
          {attributes.map((spec, index) => (
              <div className="informationDetail mb-1 p-3 w-full" key={index}>
                  <div className="lg:w-[300px]">{spec.attributeName}</div>  <div><span dangerouslySetInnerHTML={{ __html: spec.attributeValue }} /></div>
              </div>
          ))}
      </div>
  ))}

      

      </div>}
      {activeTab === 'tab3' && 
      <div className="tab-content frameCover h-[100vh] pt-5">
        
         <iframe src={url} width="100%"  id="Iframe"></iframe> 
                
        
      </div>}
      {activeTab === 'tab4' && 
      <div className="tab-content pt-5 additionalDetails">
      <div className="w-full">{product?.warrantyInformation}</div>
      <div className="w-full weightInffo">
        <div className="infoTitle p-2 font-semiBold mt-5 mb-5">Additional Information</div>
        <div className="proInfo w-full"><div className="ispace">Height :</div> {product?.additionalInformation?.height}</div>
        <div className="proInfo w-full"><div className="ispace">Width :</div> {product?.additionalInformation?.width}</div>
        <div className="proInfo w-full"><div className="ispace">Length :</div> {product?.additionalInformation?.length}</div>
        <div className="proInfo w-full"><div className="ispace">Net Weight :</div> {product?.additionalInformation?.netWeight}</div>

        
        
        </div>
      </div>}
    </div>
  );
};

export default TabsPage;
