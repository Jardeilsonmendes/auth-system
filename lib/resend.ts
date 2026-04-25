import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWeeklyReport(data: {
  totalUsers: number
  newUsersThisWeek: number
  totalLogins: number
  successfulLogins: number
  failedLogins: number
}) {
  const successRate = data.totalLogins > 0
    ? ((data.successfulLogins / data.totalLogins) * 100).toFixed(1)
    : '0'

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Segoe UI', sans-serif; background: #0a0d12; color: #e8f4f4; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
      .header { text-align: center; margin-bottom: 40px; }
      .header h1 { font-size: 28px; color: #00c9c8; letter-spacing: 0.1em; margin: 0; }
      .header p { color: rgba(200,230,230,0.5); margin: 8px 0 0; font-size: 14px; }
      .cards { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px; }
      .card { background: #0d1117; border: 1px solid rgba(0,201,200,0.3); border-radius: 8px; padding: 20px; }
      .card .label { font-size: 12px; color: rgba(200,230,230,0.5); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
      .card .value { font-size: 32px; font-weight: 700; color: #00c9c8; }
      .card .sub { font-size: 12px; color: rgba(200,230,230,0.4); margin-top: 4px; }
      .footer { text-align: center; color: rgba(200,230,230,0.3); font-size: 12px; margin-top: 40px; }
      .badge { display: inline-block; background: rgba(0,201,200,0.1); border: 1px solid rgba(0,201,200,0.3); color: #00c9c8; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>⚡ RELATÓRIO SEMANAL</h1>
        <p>Sistema de Autenticação • ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <br>
        <span class="badge">📅 Sexta-feira</span>
      </div>

      <div class="cards">
        <div class="card">
          <div class="label">Total de Usuários</div>
          <div class="value">${data.totalUsers}</div>
          <div class="sub">cadastros acumulados</div>
        </div>
        <div class="card">
          <div class="label">Novos esta semana</div>
          <div class="value">${data.newUsersThisWeek}</div>
          <div class="sub">últimos 7 dias</div>
        </div>
        <div class="card">
          <div class="label">Logins realizados</div>
          <div class="value">${data.totalLogins}</div>
          <div class="sub">esta semana</div>
        </div>
        <div class="card">
          <div class="label">Taxa de sucesso</div>
          <div class="value">${successRate}%</div>
          <div class="sub">${data.failedLogins} falhas registradas</div>
        </div>
      </div>

      <div class="footer">
        <p>Relatório gerado automaticamente todo sábado às 08:00</p>
        <p>Sistema Auth — Next.js + PostgreSQL + Prisma</p>
      </div>
    </div>
  </body>
  </html>
  `

  return resend.emails.send({
    from: 'Relatório Auth <onboarding@resend.dev>',
    to: process.env.REPORT_EMAIL || 'jardeilsonmachado15@gmail.com',
    subject: `📊 Relatório Semanal — ${new Date().toLocaleDateString('pt-BR')}`,
    html,
  })
}