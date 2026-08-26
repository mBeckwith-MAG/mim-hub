import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import AllInventory from '../views/AllInventory.vue'
import AddVehicle from '../views/AddVehicle.vue'
import Store from '../views/Store.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/inventory', component: AllInventory },
  { path: '/inventory/:storeAbbr', component: Store },
  { path: '/inventory/add-vehicle', component: AddVehicle },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router