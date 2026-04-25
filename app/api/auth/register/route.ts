import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json()

    if (!username || !email || !password)
      return NextResponse.json({ error: 'Preencha todos os campos.' }, { status: 400 })

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })

    if (password.length < 6)
      return NextResponse.json({ error: 'Senha deve ter ao menos 6 caracteres.' }, { status: 400 })

    const existing = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    })

    if (existing)
      return NextResponse.json({ error: 'Usuário ou e-mail já cadastrado.' }, { status: 409 })

    const hashed = await hashPassword(password)

    const user = await prisma.user.create({
      data: { username, email, password: hashed },
      select: { id: true, username: true, email: true, createdAt: true }
    })

    return NextResponse.json({ message: 'Cadastro realizado!', user }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 })
  }
}