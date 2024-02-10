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
		     href: "#/services",
		   },
		  {
			id: 4,
			label: 'Deals',
			href: '#/deals',
		  },
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
		  href: "",
		},
		{
		  id: 2,
		  label: 'Track Your Order',
		  href: "",
		},
		{
		  id: 3,
		  label: 'USD',
		  href: "",
		},
	  ],
	navMenuItems: [
		{
			label: "Profile",
			href: "/profile",
		},
		{
			label: "Dashboard",
			href: "/dashboard",
		},
		{
			label: "Projects",
			href: "/projects",
		},
		{
			label: "Team",
			href: "/team",
		},
		{
			label: "Calendar",
			href: "/calendar",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Help & Feedback",
			href: "/help-feedback",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	],
	links: {
		github: "",
		twitter: "https://twitter.com/veemost",
		facebook: "https://facebook/veemost",
        youtube: "https://youtube.com/veemost"
	},
};
