import type { HttpContext } from '@adonisjs/core/http'
import { otpService } from '../services/otp_service.js'
import db from '@adonisjs/lucid/services/db'

export default class OtpController {
    /**
     * Request OTP for phone number change
     * POST /api/otp/request-phone-change
     */
    async requestPhoneChange({ request, response }: HttpContext) {
        const { userId, newPhone } = request.only(['userId', 'newPhone'])

        if (!userId || !newPhone) {
            return response.badRequest({ error: 'userId et newPhone sont requis' })
        }

        // Get user's current phone
        const user = await db.from('users').where('id', userId).first()
        if (!user) {
            return response.notFound({ error: 'Utilisateur non trouvé' })
        }

        // Check if new phone is same as current
        if (user.phone === newPhone) {
            return response.badRequest({ error: 'Le nouveau numéro est identique à l\'ancien' })
        }

        // Check if new phone is already used
        const existingUser = await db.from('users').where('phone', newPhone).whereNot('id', userId).first()
        if (existingUser) {
            return response.badRequest({ error: 'Ce numéro est déjà utilisé par un autre compte' })
        }

        // Send OTP to NEW phone (to verify ownership)
        const result = await otpService.sendOtp(userId, newPhone)

        return response.status(result.success ? 200 : 429).json(result)
    }

    /**
     * Verify OTP and update phone number
     * POST /api/otp/verify-phone-change
     */
    async verifyPhoneChange({ request, response }: HttpContext) {
        const { userId, otp, newPhone } = request.only(['userId', 'otp', 'newPhone'])

        if (!userId || !otp || !newPhone) {
            return response.badRequest({ error: 'userId, otp et newPhone sont requis' })
        }

        // Verify OTP
        const result = await otpService.verifyOtp(userId, otp, newPhone)

        if (!result.success) {
            return response.status(400).json(result)
        }

        // Get old phone for logging
        const user = await db.from('users').where('id', userId).first()
        const oldPhone = user?.phone

        // Update user's phone number
        await db.from('users').where('id', userId).update({
            phone: newPhone,
            updated_at: new Date()
        })

        // Send confirmation SMS to new phone
        await otpService.sendConfirmationToNewPhone(newPhone)

        console.log(`[OTP] Phone changed for user ${userId}: ${oldPhone} -> ${newPhone}`)

        return response.ok({
            success: true,
            message: 'Numéro de téléphone mis à jour avec succès'
        })
    }
}
