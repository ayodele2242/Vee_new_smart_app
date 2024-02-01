export type MenusConfig = typeof menusConfig;


export const menusConfig = {

   
    accessories: [
        'switches & hub',
        'routers & components',
        'wireless networking',
        'content networking',
      ],
      cables: ['cables '],
      communications: ['communications '],
      collaboration: ['collaboration '],
      'computer system': ['computer system '],
      'network devices': ['network devices '],
      'physical security': ['"physical security" '],
      'printer & office equipment': ['printer & office equipment '],
      software: ['software '],
      'storage device': ['storage device'],


      productsLinks : [

        {
            id: 1,
            title: 'Firewalls',
          },
          {
            id: 2,
            title: 'Routers',
          },
          {
            id: 3,
            title: 'Switch',
          },
          {
            id: 4,
            title: 'Servers',
          },
          {
            id: 5,
            title: 'Storage',
          },
          {
            id: 6,
            title: 'Wireless',
          },

      ],

      accountSideBarMenus: [
        {
            link: '/account/my_orders',
            name: 'my orders',
          },
          // {
          //   link: '/account/messages',
          //   name: 'messages',
          // },
          {
            link: '/account/wishlist',
            name: 'wishlist',
          },
          {
            link: '/account/profile_settings',
            name: 'profile settings',
          },
      ]


}