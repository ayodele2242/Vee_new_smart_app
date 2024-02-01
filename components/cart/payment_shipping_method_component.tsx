import React, { useState } from 'react';

interface ShippingMethod {
    id: number;
    name: string;
    description: string;
    price: number;
}



const ShippingMethodComponent = () => {
    const [selectedMethod, setSelectedMethod] = useState<ShippingMethod | null>(null);

    
    return (
        <div>
            <h2>Choose a Shipping Method</h2>
            <ul>
               
                    <li>
                        <input
                            type="radio"
                            id=""
                            name="shipping-method"
                            value=""
                            
                        />
                        <label>
                            
                        </label>
                        <p></p>
                    </li>
               
            </ul>
        </div>
    );
};

export default ShippingMethodComponent;
