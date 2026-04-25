import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWeeklyReport } from '@/lib/resend'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Nao autorizado.' }, { status: 401 })
  }

  try {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [totalUsers, newUsersThisWeek, weekAttempts] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.loginAttempt.findMany({ where: { attemptedAt: { gte: weekAgo } } }),
    ])

    const successfulLogins = weekAttempts.filter(a => a.success).length
    const failedLogins = weekAttempts.filter(a => !a.success).length

    await sendWeeklyReport({
      totalUsers,
      newUsersThisWeek,
      totalLogins: weekAttempts.length,
      successfulLogins,
      failedLogins,
    })

    return NextResponse.json({
      message: 'Relatorio enviado!',
      data: { totalUsers, newUsersThisWeek, successfulLogins, failedLogins }
    })
  } catch (err) {
    console.error('Erro no cron:', err)
    return NextResponse.json({ error: 'Erro ao gerar relatorio.' }, { status: 500 })
  }
}