import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

// Next.js 16: arquivo renomeado de middleware.ts para proxy.ts
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export default proxy;

export const config = {
  matcher: [
    // Protege /painel e /admin — requer sessão Supabase Auth
    '/painel/:path*',
    '/admin/:path*',
    // Também atualiza token em todas as rotas (exceto assets estáticos)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
