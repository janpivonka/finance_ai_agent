import { Resend } from 'resend';

// Inicializace Resend klienta s kontrolou API klíče
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Vracíme null nebo házíme chybu až při volání, aby build neselhal
    console.warn("RESEND_API_KEY is missing. Emails will not be sent.");
    return null;
  }
  return new Resend(apiKey);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resend = getResendClient();
  
  if (!resend) {
    return { success: false, error: "E-mailový klient není nakonfigurován" };
  }

  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: 'Finance AI <onboarding@resend.dev>', // Pro produkci je potřeba vlastní doména
      to: email,
      subject: 'Obnova hesla - Finance AI',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 12px;">
          <h1 style="color: #4f46e5; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Obnova hesla</h1>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Dobrý den,</p>
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">Obdrželi jsme žádost o obnovu hesla k vašemu účtu ve Finance AI. Pokud jste tuto žádost nepodali, můžete tento e-mail ignorovat.</p>
          <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Obnovit heslo</a>
          </div>
          <p style="color: #718096; font-size: 14px;">Odkaz je platný po dobu 1 hodiny.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #a0aec0; font-size: 12px; text-align: center;">© 2026 FINANCE AI AGENT</p>
        </div>
      `
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
};
