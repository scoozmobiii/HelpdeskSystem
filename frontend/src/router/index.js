import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import StaffDashboard from '../views/StaffDashboard.vue'
import CreateTicket from '../views/CreateTicket.vue'
import TicketDetail from '../views/TicketDetail.vue'
import UserManagement from '../views/UserManagement.vue'
import KnowledgeBase from '../views/KnowledgeBase.vue'
import ArticleDetail from '../views/ArticleDetail.vue';
import ArticleEditor from '../views/ArticleEditor.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true, roles: ['user'] }, 
    },
    {
      path: '/staff/dashboard', 
      name: 'staff-dashboard',
      component: StaffDashboard,
      meta: { requiresAuth: true, roles: ['staff', 'admin'] }, 
    },
    {
      path: '/tickets/new',
      name: 'create-ticket',
      component: CreateTicket,
      meta: { requiresAuth: true, roles: ['user'] },
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/tickets/:id',
      name: 'ticket-detail',
      component: TicketDetail,
      meta: { requiresAuth: true, roles: ['user', 'staff', 'admin'] },
    },
    {
      path: '/admin/users',
      name: 'user-management',
      component: UserManagement,
      meta: { requiresAuth: true, roles: ['admin'] }, 
    },
    {
      path: '/kb',
      name: 'knowledge-base',
      component: KnowledgeBase,
      meta: { requiresAuth: true }, 
    },
    {
  path: '/kb/new',
  name: 'kb-create',
  component: ArticleEditor,
  meta: { requiresAuth: true, roles: ['staff', 'admin'] }
},
{
  path: '/kb/:id',
  name: 'kb-detail',
  component: ArticleDetail,
  meta: { requiresAuth: true }
},
{
  path: '/kb/:id/edit',
  name: 'kb-edit',
  component: ArticleEditor,
  meta: { requiresAuth: true, roles: ['staff', 'admin'] }
},
  ],
})

//Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'login' })
    }

    // check role
    const requiredRoles = to.meta.roles
    if (requiredRoles && !requiredRoles.includes(authStore.user.role)) {
      if (authStore.user.role === 'staff' || authStore.user.role === 'admin') {
        return next({ name: 'staff-dashboard' })
      } else {
        return next({ name: 'dashboard' })
      }
    }
  }

  next()
})

export default router
