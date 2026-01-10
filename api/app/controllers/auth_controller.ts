
import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { redisService } from '#services/redis_service'
import { httpsmsService } from '#services/httpsms_service'

export default class CustomerAuthController {
    /**
     * POST /api/auth/register
     */
    async register({ request, response }: HttpContext) {
        const { phone, email, password, name } = request.only(['phone', 'email', 'password', 'name'])

        if (!phone || !password || !name) {
            return response.badRequest({ message: 'Le numéro de téléphone, le mot de passe et le nom sont requis' })
        }

        // Check if user already exists
        const existing = await db.from('users').where('phone', phone).first()
        if (existing) {
            return response.conflict({ message: 'Ce numéro de téléphone est déjà utilisé' })
        }

        const hashedPassword = await hash.make(password)
        const apiKey = await hash.make(`${phone}:${Date.now()}`) // Simple unique key generation, or use crypto

        try {
            const [user] = await db.table('users').insert({
                phone,
                email: email || null,
                password: hashedPassword,
                name,
                api_key: apiKey,
                created_at: DateTime.now().toSQL(),
                updated_at: DateTime.now().toSQL()
            }).returning(['id', 'phone', 'name', 'email'])

            // Auto-link old orders with this phone number
            await db.from('orders')
                .where('customer_phone', phone)
                .whereNull('user_id')
                .update({ user_id: user.id })

            const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

            return response.created({
                success: true,
                user,
                token
            })
        } catch (error) {
            console.error('Registration error:', error)
            return response.internalServerError({
                message: 'Erreur lors de la création du compte',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            })
        }
    }

    /**
     * POST /api/auth/login
     */
    async login({ request, response }: HttpContext) {
        const { phone, password } = request.only(['phone', 'password'])

        if (!phone || !password) {
            return response.badRequest({ message: 'Téléphone et mot de passe requis' })
        }

        const user = await db.from('users').where('phone', phone).first()
        if (!user) {
            return response.unauthorized({ message: 'Identifiants invalides' })
        }

        const isPasswordValid = await hash.verify(user.password, password)
        if (!isPasswordValid) {
            return response.unauthorized({ message: 'Identifiants invalides' })
        }

        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

        return response.ok({
            success: true,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                email: user.email
            },
            token
        })
    }

    /**
     * GET /api/auth/me
     */
    async me({ request, response }: HttpContext) {
        const userId = request.header('X-User-Id')
        if (!userId) {
            return response.unauthorized({ message: 'Non connecté' })
        }

        const user = await db.from('users').where('id', userId).first()
        if (!user) {
            return response.unauthorized({ message: 'Utilisateur non trouvé' })
        }

        const addresses = await db.from('user_addresses').where('user_id', userId).orderBy('is_default', 'desc')

        return response.ok({
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                email: user.email
            },
            addresses
        })
    }

    /**
     * GET /api/auth/orders
     */
    async orders({ request, response }: HttpContext) {
        const userId = request.header('X-User-Id')
        if (!userId) {
            return response.unauthorized({ message: 'Non connecté' })
        }

        const orders = await db.from('orders')
            .where('user_id', userId)
            .orderBy('created_at', 'desc')

        return response.ok({ orders })
    }

    /**
     * PATCH /api/auth/profile
     */
    async updateProfile({ request, response }: HttpContext) {
        const userId = request.header('X-User-Id')
        if (!userId) return response.unauthorized()

        const { name, email, phone } = request.only(['name', 'email', 'phone'])

        if (phone) {
            const existing = await db.from('users').where('phone', phone).whereNot('id', userId).first()
            if (existing) {
                return response.conflict({ message: 'Ce numéro de téléphone est déjà utilisé par un autre compte' })
            }
        }

        await db.from('users')
            .where('id', userId)
            .update({
                name,
                email: email || null,
                phone,
                updated_at: DateTime.now().toSQL()
            })

        return response.ok({ success: true })
    }

    /**
     * POST /api/auth/addresses
     */
    async addAddress({ request, response }: HttpContext) {
        const userId = request.header('X-User-Id')
        if (!userId) return response.unauthorized()

        const { label, address_full, lat, lon, is_default } = request.all()

        if (is_default) {
            await db.from('user_addresses').where('user_id', userId).update({ is_default: false })
        }

        const [address] = await db.table('user_addresses').insert({
            user_id: userId,
            label,
            address_full,
            lat,
            lon,
            is_default: !!is_default,
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        }).returning('*')

        return response.created({ address })
    }

    /**
     * DELETE /api/auth/addresses/:id
     */
    async deleteAddress({ request, response, params }: HttpContext) {
        const userId = request.header('X-User-Id')
        if (!userId) return response.unauthorized()

        await db.from('user_addresses')
            .where('id', params.id)
            .where('user_id', userId)
            .delete()

        return response.ok({ success: true })
    }

    /**
     * PATCH /api/auth/addresses/:id
     */
    async updateAddress({ request, response, params }: HttpContext) {
        const userId = request.header('X-User-Id')
        if (!userId) return response.unauthorized()

        const data = request.only(['label', 'address_full', 'lat', 'lon', 'is_default'])

        await db.from('user_addresses')
            .where('id', params.id)
            .where('user_id', userId)
            .update({
                ...data,
                updated_at: DateTime.now().toSQL()
            })

        return response.ok({ success: true })
    }

    /**
     * PATCH /api/auth/addresses/:id/default
     */
    async setDefaultAddress({ request, response, params }: HttpContext) {
        const userId = request.header('X-User-Id')
        if (!userId) return response.unauthorized()

        await db.from('user_addresses').where('id', params.id).where('user_id', userId).update({ is_default: true })

        return response.ok({ success: true })
    }
    /**
     * POST /api/auth/send-otp
     */
    async sendOtp({ request, response }: HttpContext) {
        const { phone } = request.only(['phone'])
        if (!phone) return response.badRequest({ message: 'Numéro de téléphone requis' })

        try {
            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString()

            console.log(`[Auth] Generating OTP for ${phone}`)

            // Store in Redis
            await redisService.storeOtp(phone, otp)
            console.log(`[Auth] OTP stored in Redis for ${phone}`)

            // Send SMS
            console.log(`[Auth] Sending SMS via httpSMS to ${phone}...`)
            const sent = await httpsmsService.sendSms(phone, `Votre code de vérification BIO SANTÉ est : ${otp}. Valable 5 minutes.`)

            if (!sent) {
                console.error(`[Auth] SMS sending failed for ${phone}`)
                return response.internalServerError({ message: 'Erreur lors de l\'envoi du SMS. Veuillez réessayer.' })
            }

            console.log(`[Auth] OTP sequence complete for ${phone}`)
            return response.ok({ success: true, message: 'Code envoyé' })
        } catch (error) {
            console.error('[Auth] sendOtp critical error:', error)
            return response.internalServerError({
                message: 'Erreur technique lors de l\'envoi du code.',
                debug_error: error instanceof Error ? error.message : String(error)
            })
        }
    }

    /**
     * POST /api/auth/verify-otp
     */
    async verifyOtp({ request, response }: HttpContext) {
        const { phone, otp } = request.only(['phone', 'otp'])
        if (!phone || !otp) return response.badRequest({ message: 'Téléphone et code requis' })

        const isValid = await redisService.verifyOtp(phone, otp)
        if (!isValid) {
            return response.unauthorized({ message: 'Code invalide ou expiré' })
        }

        // Check if user exists
        let user = await db.from('users').where('phone', phone).first()

        if (!user) {
            // New user - they need to finish registration (provide name)
            return response.ok({
                success: true,
                isNewUser: true,
                message: 'Code vérifié. Veuillez compléter votre profil.'
            })
        }

        // Existing user - Log them in
        const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')

        return response.ok({
            success: true,
            isNewUser: false,
            user: {
                id: user.id,
                phone: user.phone,
                name: user.name,
                email: user.email
            },
            token
        })
    }
}
