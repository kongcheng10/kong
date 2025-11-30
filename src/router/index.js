import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/views/layout/LayoutView.vue'
import Home from '@/views/layout/HomeView.vue'
import About from '@/views/layout/about/AboutView.vue'
import AboutME from '@/views/layout/about/TwoMenu/AboutMe.vue'
import AboutWeb from '@/views/layout/about/TwoMenu/AboutWeb.vue'
import Album from '@/views/layout/Album/AlbumView.vue'
import More from '@/views/layout/Album/MoreAlbum.vue'
import Join from '@/views/layout/JoinView.vue'
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'
import user from '@/views/User/UserPage.vue'


import { useUserStore } from '@/stores/user'                //引入用户仓库获得token

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home', // 设置默认路由
      children: [
        {
          path: 'home',
          name: 'Home',
          component: Home,
        },
        {
          path: 'about',
          name: 'About',
          component: About,
          redirect: '/about/AboutME',
          children: [
            {
              path: 'AboutME',
              name: 'AboutME',
              component: AboutME
            },
            {
              path: 'AboutWeb',
              name: 'AboutWeb',
              component: AboutWeb
            }
          ]
        },
        {
          path: 'album',
          name: 'Album',
          component: Album,
        },
        {
          path: 'more',
          name: 'More',
          component: More
        },
        {
          path: 'join',
          name: 'Join',
          component: Join
        },{
      path: '/user',
      name: 'User',
      component: user
    },
      ],
    },
    

    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    }
  ],
})
//导航守卫
router.beforeEach((to) => { 
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login')
    return ('/login')
})
export default router