import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ error: 'Token não fornecido.' }, { status: 401 })

    const decoded = verifyToken(token) as { id: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, email: true, createdAt: true }
    })

    if (!user) return NextResponse.json({ error: 'Usuário não encontrado.' }, { status: 404 })
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Token inválido ou expirado.' }, { status: 403 })
  }
}