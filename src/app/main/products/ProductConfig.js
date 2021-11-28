import ProductList from './ProductList';

const ProductConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/products',
      component: ProductList,
    },
  ],
};

export default ProductConfig;
