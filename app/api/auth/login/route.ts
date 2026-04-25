import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    if (!username || !password)
      return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
      await prisma.loginAttempt.create({ data: { username, ipAddress: ip, success: false } })
      return NextResponse.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 })
    }

    const match = await comparePassword(password, user.password)

    if (!match) {
      await prisma.loginAttempt.create({ data: { username, ipAddress: ip, success: false, userId: user.id } })
      return NextResponse.json({ error: 'Usuário ou senha incorretos.' }, { status: 401 })
    }

    const token = generateToken({ id: user.id, username: user.username, email: user.email })
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)

    await prisma.session.create({ data: { userId: user.id, token, expiresAt } })
    await prisma.loginAttempt.create({ data: { username, ipAddress: ip, success: true, userId: user.id } })

    return NextResponse.json({
      message: `Bem-vindo, ${user.username}!`,
      token,
      user: { id: user.id, username: user.username, email: user.email }
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}