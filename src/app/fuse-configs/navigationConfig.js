import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import Store from 'app/utils/Store'

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

let user = Store.USER
const navigationConfig = [
  {
    id: 'menu',
    title: 'Koi-Media',
    translate: 'KOI',
    type: 'group',
    icon: 'apps',
    children: [
      {
        id: 'home',
        title: 'Home',
        translate: 'Home',
        type: 'item',
        icon: 'apps',
        url: '/home',
      },

      user && !['mailing','opec', 'financeiro', 'comercial'].includes(user.role)?
      {
        id: 'users',
        title: 'Usuários',
        translate: 'Usuários',
        type: 'item',
        icon: 'person',
        url: '/users',
        visible : false
      }
      :{},
      user &&  !['mailing'].includes(user.role) ?
     
      {
        id: 'vehicles',
        title: 'Veículos',
        translate: 'Veículos',
        type: 'item',
        icon: 'directions_car',
        url: '/vehicles',
      }:{},
      user && !['mailing'].includes(user.role) ?
      {
        id: 'clients',
        title: 'Clientes',
        translate: 'Clientes',
        type: 'item',
        icon: 'people',
        url: '/clients',
      }:{},
      user &&  !['mailing'].includes(user.role) ?
     
      {
        id: 'agencies',
        title: 'Agências',
        translate: 'Agências',
        type: 'item',
        icon: 'people',
        url: '/agencies',
      }:{},
      user && !['financeiro'].includes(user.role) ?
      {
        id: 'mailings',
        title: 'Mailings',
        translate: 'Mailings',
        type: 'item',
        icon: 'people',
        url: '/mailings',
      }:{},
      user &&  !['mailing'].includes(user.role) ?

      {
        id: 'products',
        title: 'Produtos',
        translate: 'Produtos',
        type: 'item',
        icon: 'people',
        url: '/products',
      }:{},
      user && !['mailing','opec', 'financeiro'].includes(user.role) ?
      {
        id: 'squares',
        title: 'Praças',
        translate: 'Praças',
        type: 'item',
        icon: 'people',
        url: '/squares',
      }:{},
      user && !['mailing','opec', 'comercial'].includes(user.role)?
     
      {
        id: 'status',
        title: 'Status',
        translate: 'Status',
        type: 'item',
        icon: 'people',
        url: '/status',
      }:{},
      user && !['mailing'].includes(user.role) ?
     
      {
        id: 'proposals',
        title: 'Propostas',
        translate: 'Propostas',
        type: 'item',
        icon: 'people',
        url: '/proposals',
      }:{},
      user &&  !['mailing','subadmin', 'opec', 'financeiro', 'comercial'].includes(user.role)?
     {
        id: 'chekings',
        title: 'Checkings',
        translate: 'Chekings',
        type: 'item',
        icon: 'people',
        url: '/checkings',
      }
      :{},
      user &&  !['mailing','subadmin', 'financeiro', 'comercial'].includes(user.role)?
      {
        id: 'opecs',
        title: 'Opec',
        translate: 'Opec',
        type: 'item',
        icon: 'people',
        url: '/opecs',
      }:{},
    ],
  },
];

export default navigationConfig;
