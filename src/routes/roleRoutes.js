export const dashboardForRole = role => ({ artisan: '/artisan', freelancer: '/freelancer', customer: '/panel' })[role] ?? '/login'

export function canRoleAccessPath(path, role) {
  if (path === '/profile' || path === '/edit_profile.html') return Boolean(role)
  if (role === 'artisan') return ['/artisan', '/artisan_home.html', '/crafts/new', '/add_craft.html', '/edit_craft.html', '/opportunities/new', '/rate-freelancer'].includes(path) || /^\/crafts\/[^/]+\/edit$/.test(path)
  if (role === 'freelancer') return ['/freelancer', '/freelancer_home.html'].includes(path)
  if (role === 'customer') return ['/panel', '/home_user.html', '/user_panel.html'].includes(path)
  return false
}
