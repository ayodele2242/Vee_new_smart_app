export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Veemost Smart Store",
	description: "No. 1 online store for anything electronics.",
	navItems: [
		{
			id: 1,
			label: 'Products',
			href: '#',
		  },
		  {
			id: 2,
			label: 'Brands',
			href: '#',
		  },
		  {
		     id: 3,
		     label: "Services",
		     href: "/services",
		   },
		  /*{
			id: 4,
			label: 'Deals',
			href: '#/deals',
		  },*/
		  {
			id: 5,
			label: 'Partners',
			href: '#',
		  },
		  {
			id: 6,
			label: 'About Us',
			href: '#',
		  },
	],
	menu1: [
		{
		  id: 1,
		  label: 'Contact Us',
		  href: "/contact",
		},
		{
		  id: 2,
		  label: 'Track Your Order',
		  href: "/account/my_orders",
		},
		/*{
		  id: 3,
		  label: 'USD',
		  href: "",
		},*/
	  ],
	navMenuItems: [
		{
			id: 1,
			label: 'Products',
			href: '/products',
		  },
		  {
			id: 2,
			label: 'Brands',
			href: '/brands',
		  },
		  {
		     id: 3,
		     label: "Services",
		     href: "/services",
		   },
		  /*{
			id: 4,
			label: 'Deals',
			href: '/deals',
		  },*/
		  {
			id: 5,
			label: 'Partners',
			href: 'partners',
		  },
		  {
			id: 6,
			label: 'About Us',
			href: '/about',
		  },
	],
	links: {
		github: "",
		twitter: "https://twitter.com/veemost",
		facebook: "https://facebook/veemost",
        youtube: "https://youtube.com/veemost"
	},
};
