/** Stub until we pick a provider: logs the link instead of sending it. */
export async function sendResetEmail(email, link) {
  console.log(`[mailer] reset link for ${email}: ${link}`)
}
