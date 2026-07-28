/**
 * Script para criar o usuário admin no Supabase Auth.
 * Executar UMA VEZ: npx tsx prisma/create-admin.ts
 *
 * Isso cria o user no Supabase Auth com a mesma senha
 * e email do seed. Depois disso, o login em /login com
 * admin@geekfy.com funcionará e redirecionará para /admin.
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Carregar variáveis do .env
config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias no .env')
  process.exit(1)
}

// Admin client (service_role bypassa RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const email = 'admin@geekfy.com'
  const password = 'Admin@Geekfy2026' // Senha para desenvolvimento — trocar em produção!

  console.log(`🔐 Criando usuário admin no Supabase Auth...`)
  console.log(`   Email: ${email}`)
  console.log(`   Senha: ${password}`)

  // Verificar se já existe
  const { data: existingUsers } = await supabase.auth.admin.listUsers()
  const alreadyExists = existingUsers?.users?.find((u) => u.email === email)

  if (alreadyExists) {
    console.log('⚠️  Usuário já existe no Supabase Auth. Atualizando senha...')
    const { error } = await supabase.auth.admin.updateUserById(alreadyExists.id, {
      password,
      user_metadata: { role: 'ADMIN', name: 'Admin Geekfy' },
      email_confirm: true,
    })
    if (error) {
      console.error('❌ Erro ao atualizar:', error.message)
      process.exit(1)
    }
    console.log('✅ Senha e metadata atualizados!')
  } else {
    const { error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { role: 'ADMIN', name: 'Admin Geekfy' },
      email_confirm: true, // pula verificação de email
    })
    if (error) {
      console.error('❌ Erro ao criar:', error.message)
      process.exit(1)
    }
    console.log('✅ Usuário admin criado com sucesso!')
  }

  console.log('\n🎉 Pronto! Agora você pode fazer login em /login com:')
  console.log(`   📧 Email: ${email}`)
  console.log(`   🔑 Senha: ${password}`)
  console.log('   Após o login, será redirecionado para /admin')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
