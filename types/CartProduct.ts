import { VeeProductType } from '@/types/types';



type CartProduct = VeeProductType & {
  quantity: number;
};

export default CartProduct;