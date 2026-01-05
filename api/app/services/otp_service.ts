import { createHash } from 'crypto'
import { redisService } from './redis_service.js'
import { httpsmsService } from './httpsms_service.js'

const OTP_TTL = 300 // 5 minutes
const MAX_ATTEMPTS = 3
const RATE_LIMIT_WINDOW = 60 // 1 minute between OTP requests

export class OtpService {
    /**
     * Generate a 4-digit OTP
     */
    private generateOtp(): string {
        return Math.floor(1000 + Math.random() * 9000).toString()
    }

    /**
     * Hash the OTP for secure storage
     */
    private hashOtp(otp: string): string {
        return createHash('sha256').update(otp).digest('hex')
    }

    /**
     * Send OTP to a phone number for phone change verification
     * Returns: { success, message, expiresIn? }
     */
    async sendOtp(userId: string, currentPhone: string): Promise<{ success: boolean; message: string; expiresIn?: number }> {
        const rateLimitKey = `otp:ratelimit:${userId}`
        const otpDataKey = `otp:phone:${userId}`

        // Check rate limit
        const lastRequest = await redisService.get(rateLimitKey)
        if (lastRequest) {
            const remainingTime = RATE_LIMIT_WINDOW - (Date.now() - parseInt(lastRequest)) / 1000
            if (remainingTime > 0) {
                return {
                    success: false,
                    message: `Veuillez attendre ${Math.ceil(remainingTime)} secondes avant de demander un nouveau code`
                }
            }
        }

        // Generate OTP
        const otp = this.generateOtp()
        const hashedOtp = this.hashOtp(otp)

        // Store OTP data: hash, attempts, expiry
        const otpData = JSON.stringify({
            hash: hashedOtp,
            attempts: 0,
            createdAt: Date.now()
        })
        await redisService.set(otpDataKey, otpData, OTP_TTL)

        // Set rate limit
        await redisService.set(rateLimitKey, Date.now().toString(), RATE_LIMIT_WINDOW)

        // Send SMS to NEW phone (to verify ownership)
        const smsContent = `BIO SANTÉ 🔐\n\nVotre code de vérification est: ${otp}\n\nCe code expire dans 5 minutes.\n\nEntrez ce code pour confirmer ce numéro.`
        const smsSent = await httpsmsService.sendSms(currentPhone, smsContent)

        if (!smsSent) {
            await redisService.del(otpDataKey)
            return {
                success: false,
                message: 'Erreur lors de l\'envoi du SMS. Veuillez réessayer.'
            }
        }

        console.log(`[OTP] Sent OTP to ${currentPhone} for user ${userId}`)
        return {
            success: true,
            message: 'Code envoyé par SMS',
            expiresIn: OTP_TTL
        }
    }

    /**
     * Verify OTP and update phone number if valid
     * Returns: { success, message }
     */
    async verifyOtp(userId: string, otp: string, newPhone: string): Promise<{ success: boolean; message: string }> {
        const otpDataKey = `otp:phone:${userId}`

        // Get stored OTP data
        const storedData = await redisService.get(otpDataKey)
        if (!storedData) {
            return {
                success: false,
                message: 'Code expiré ou invalide. Veuillez demander un nouveau code.'
            }
        }

        const otpData = JSON.parse(storedData)

        // Check max attempts
        if (otpData.attempts >= MAX_ATTEMPTS) {
            await redisService.del(otpDataKey)
            return {
                success: false,
                message: 'Trop de tentatives. Veuillez demander un nouveau code.'
            }
        }

        // Verify OTP
        const hashedInput = this.hashOtp(otp)
        if (hashedInput !== otpData.hash) {
            // Increment attempts
            otpData.attempts += 1
            const remainingAttempts = MAX_ATTEMPTS - otpData.attempts
            await redisService.set(otpDataKey, JSON.stringify(otpData), OTP_TTL)

            return {
                success: false,
                message: `Code incorrect. ${remainingAttempts} tentative(s) restante(s).`
            }
        }

        // OTP is valid - delete it
        await redisService.del(otpDataKey)

        console.log(`[OTP] Verified OTP for user ${userId}, new phone: ${newPhone}`)
        return {
            success: true,
            message: 'Code vérifié avec succès'
        }
    }

    /**
     * Send confirmation SMS to the new phone after successful change
     */
    async sendConfirmationToNewPhone(newPhone: string): Promise<void> {
        const smsContent = `BIO SANTÉ 🌿\n\nVotre numéro de téléphone a été mis à jour avec succès.\n\nSi vous n'êtes pas à l'origine de ce changement, contactez-nous immédiatement.`
        await httpsmsService.sendSms(newPhone, smsContent)
    }
}

export const otpService = new OtpService()
