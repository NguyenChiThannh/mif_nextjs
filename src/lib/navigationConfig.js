import { BookIcon, BookOpenIcon, CalendarCheckIcon, CircleUserIcon, ClapperboardIcon, FilePenIcon, HouseIcon, InfoIcon, LayoutListIcon, LineChartIcon, MessageCircleIcon, UsersRoundIcon, UserRoundIcon, UsersIcon } from "lucide-react"

export const headerMenuConfig = (t) => [
    {
        title: t('home_link'),
        href: '/home',
        active: function (pathname) {
            return pathname.includes(this.href)
        }
    },
    {
        title: t('movie_link'),
        href: '/movies',
        active: function (pathname) {
            return pathname.includes(this.href)
        }
    },
    {
        title: t('actor_link'),
        href: '/actor',
        active: function (pathname) {
            return pathname.includes(this.href)
        }
    },
    {
        title: t('groups_link'),
        href: '/groups',
        active: function (pathname) {
            return pathname.includes(this.href)
        }
    },
]

export const navDashboardMenuConfig = {
    adminMenu(t) {
        return [
            {
                title: t('home'),
                href: '/admin/dashboard/home',
                icon: HouseIcon,
                active: (pathname) => pathname.includes('/dashboard/home'),
            },
            // {
            //     title: t('news'),
            //     href: '/admin/dashboard/news',
            //     icon: NewspaperIcon,
            //     active: (pathname) => pathname.includes('/dashboard/news'),
            // },
            {
                title: t('user'),
                href: '/admin/dashboard/users',
                icon: CircleUserIcon,
                active: (pathname) => pathname.includes('/dashboard/users'),
            },
            {
                title: t('group'),
                href: '/admin/dashboard/groups',
                icon: UsersIcon,
                active: (pathname) => pathname.includes('/dashboard/groups'),
            },
            {
                title: t('post'),
                href: '/admin/dashboard/posts',
                icon: BookOpenIcon,
                active: (pathname) => pathname.includes('/dashboard/posts'),
            },
            // {
            //     title: t('event'),
            //     href: '/admin/dashboard/events',
            //     icon: CalendarCheckIcon,
            //     active: (pathname) => pathname.includes('/dashboard/events'),
            // },
            // {
            //     title: t('analytics'),
            //     href: '/admin/dashboard/analytics',
            //     icon: LineChartIcon,
            //     active: (pathname) => pathname.includes('/dashboard/analytics'),
            // },
        ];
    },
    contentCreateMenu(t) {
        return [
            {
                title: t('home'),
                href: '/admin/dashboard/home',
                icon: HouseIcon,
                active: (pathname) => pathname.includes('/dashboard/home'),
            },
            {
                title: t('movies'),
                href: '/admin/dashboard/movies',
                icon: ClapperboardIcon,
                active: (pathname) => pathname.includes('/dashboard/movies'),
            },
            {
                title: t('category'),
                href: '/admin/dashboard/categories',
                icon: LayoutListIcon,
                active: (pathname) => pathname.includes('/dashboard/categories'),
            },
            {
                title: t('actor'),
                href: '/admin/dashboard/actors',
                icon: UserRoundIcon,
                active: (pathname) => pathname.includes('/dashboard/actors'),
            },
        ];
    },
}
export const navProfileUserConfig = (t) => [
    {
        title: t('my_posts'),
        href: (id) => `/user/${id}`,
        active: function (pathname, id) {
            return pathname.replace(/^\/[a-z]{2}/, '') == this.href(id)
        }
    },
    {
        title: t('info'),
        href: (id) => `/user/${id}/info`,
        active: function (pathname, id) {
            return pathname.includes(this.href(id))
        }
    },
    {
        title: t('posts_saved'),
        href: (id) => `/user/${id}/posts_saved`,
        active: function (pathname, id) {
            return pathname.includes(this.href(id))
        }
    },
    {
        title: t('movies_saved'),
        href: (id) => `/user/${id}/movies_saved`,
        active: function (pathname, id) {
            return pathname.includes(this.href(id))
        }
    },
    {
        title: t('favorite_actors'),
        href: (id) => `/user/${id}/favorite_actors`,
        active: function (pathname, id) {
            return pathname.includes(this.href(id))
        }
    },
    {
        title: t('event'),
        href: (id) => `/user/${id}/event`,
        active: function (pathname, id) {
            return pathname.includes(this.href(id))
        }
    },
]

export const navGroupConfig = {
    always_visible(t) {
        return [
            {
                title: t('about'),
                href: (id) => `/groups/${id}/about`,
                icon: InfoIcon,
                active: (section) => section === 'about'
            }
        ]
    },
    public_group(t) {
        return [
            {
                title: t('feed'),
                href: (groupId) => `/groups/${groupId}/`,
                icon: FilePenIcon,
                active: function (section) {
                    return (!section || section === 'feed')
                }
            },
            {
                title: t('rules'),
                href: (groupId) => `/groups/${groupId}/rules`,
                icon: BookIcon,
                active: function (section) {
                    return (section === 'rules')
                }
            },
            {
                title: t('about'),
                href: (groupId) => `/groups/${groupId}/about`,
                icon: InfoIcon,
                active: function (section) {
                    return (section === 'about')
                }
            },
        ]
    },
    member(t) {
        return [
            {
                title: t('feed'),
                href: (groupId) => `/groups/${groupId}/`,
                icon: FilePenIcon,
                active: function (section) {
                    return (!section || section === 'feed')
                }
            },
            {
                title: t('message'),
                href: (groupId) => '/chat',
                icon: MessageCircleIcon,
                active: function (section) {
                    return null
                }
            },
            {
                title: t('rules'),
                href: (groupId) => `/groups/${groupId}/rules`,
                icon: BookIcon,
                active: function (section) {
                    return (section === 'rules')
                }
            },
            {
                title: t('about'),
                href: (groupId) => `/groups/${groupId}/about`,
                icon: InfoIcon,
                active: function (section) {
                    return (section === 'about')
                }
            },
            {
                title: t('members_featured'),
                href: (groupId) => `/groups/${groupId}/members-featured`,
                icon: UsersRoundIcon,
                active: function (section) {
                    return (section === 'members-featured')
                }
            },
            {
                title: t('events'),
                href: (groupId) => `/groups/${groupId}/events`,
                icon: CalendarCheckIcon,
                active: function (section) {
                    return (section === 'events')
                }
            },
        ]
    }
}

export const tabSearchConfig = (t) => [
    { title: t('all'), tab: 'all' },
    { title: t('movie'), tab: 'movie' },
    { title: t('group'), tab: 'group' },
    { title: t('director_actor'), tab: 'director_actor' },
];