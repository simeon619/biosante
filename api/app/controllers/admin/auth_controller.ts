import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import hash from '@adonisjs/core/services/hash'
import { DateTime } from 'luxon'
import { httpsmsService } from '#services/httpsms_service'

export default class AdminAuthController {
    /**
     * Generate 6-character alphanumeric OTP (uppercase letters and digits)
     */
    private generateOtp(): string {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluded similar chars: 0O1I
        let otp = ''
        for (let i = 0; i < 6; i++) {
            otp += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return otp
    }

    /**
     * Send OTP to admin phone number
     */
    async sendOtp({ request, response }: HttpContext) {
        const { phone } = request.only(['phone'])

        if (!phone) {
            return response.badRequest({ error: 'Numéro de téléphone requis' })
        }

        // Normalize phone number to +225XXXXXXXXXX format
        let normalizedPhone = phone.replace(/[^\d+]/g, '')
        if (!normalizedPhone.startsWith('+')) {
            if (normalizedPhone.startsWith('225')) {
                normalizedPhone = '+' + normalizedPhone
            } else if (normalizedPhone.startsWith('0')) {
                // Keep the 0: +2250XXXXXXXXX format
                normalizedPhone = '+225' + normalizedPhone
            } else {
                normalizedPhone = '+225' + normalizedPhone
            }
        }

        console.log('[AdminAuth] sendOtp - Input:', phone, '-> Normalized:', normalizedPhone)

        // Find admin with this phone
        const admin = await db.from('admin_users')
            .where('phone', normalizedPhone)
            .where('is_active', true)
            .first()

        console.log('[AdminAuth] Admin found:', admin ? `ID ${admin.id}, phone: ${admin.phone}` : 'NOT FOUND')

        if (!admin) {
            // For security, don't reveal if phone exists or not
            return response.ok({ success: true, message: 'Si ce numéro est enregistré, vous recevrez un code.' })
        }

        // Generate OTP
        const otp = this.generateOtp()
        const expiresAt = DateTime.now().plus({ minutes: 5 })

        // Store OTP in database
        await db.from('admin_users')
            .where('id', admin.id)
            .update({
                otp_code: otp,
                otp_expires_at: expiresAt.toSQL()
            })

        // Send SMS
        const smsContent = `BIO SANTÉ Admin\n\nVotre code de connexion: ${otp}\n\nExpire dans 5 minutes.`
        const smsSent = await httpsmsService.sendSms(normalizedPhone, smsContent)

        if (!smsSent) {
            console.error('[AdminAuth] Failed to send OTP SMS to', normalizedPhone)
            return response.internalServerError({ error: 'Erreur lors de l\'envoi du SMS' })
        }

        console.log(`[AdminAuth] OTP ${otp} sent to ${normalizedPhone}`)

        return response.ok({
            success: true,
            message: 'Code envoyé par SMS',
            expiresIn: 300 // 5 minutes in seconds
        })
    }

    /**
     * Verify OTP and login
     */
    async verifyOtp({ request, response }: HttpContext) {
        const { phone, otp } = request.only(['phone', 'otp'])

        if (!phone || !otp) {
            return response.badRequest({ error: 'Numéro et code requis' })
        }

        // Normalize phone number to +225XXXXXXXXXX format
        let normalizedPhone = phone.replace(/[^\d+]/g, '')
        if (!normalizedPhone.startsWith('+')) {
            if (normalizedPhone.startsWith('225')) {
                normalizedPhone = '+' + normalizedPhone
            } else if (normalizedPhone.startsWith('0')) {
                // Keep the 0: +2250XXXXXXXXX format
                normalizedPhone = '+225' + normalizedPhone
            } else {
                normalizedPhone = '+225' + normalizedPhone
            }
        }

        // Find admin
        const admin = await db.from('admin_users')
            .where('phone', normalizedPhone)
            .where('is_active', true)
            .first()

        if (!admin) {
            return response.unauthorized({ error: 'Code invalide' })
        }

        // Check OTP
        if (!admin.otp_code || admin.otp_code.toUpperCase() !== otp.toUpperCase()) {
            return response.unauthorized({ error: 'Code invalide' })
        }

        // Check expiration
        if (admin.otp_expires_at && DateTime.fromSQL(admin.otp_expires_at) < DateTime.now()) {
            return response.unauthorized({ error: 'Code expiré. Demandez un nouveau code.' })
        }

        // Clear OTP and update last login
        await db.from('admin_users')
            .where('id', admin.id)
            .update({
                otp_code: null,
                otp_expires_at: null,
                last_login_at: DateTime.now().toSQL()
            })

        // Generate token
        const token = Buffer.from(`${admin.id}:${Date.now()}`).toString('base64')

        console.log(`[AdminAuth] Admin ${admin.name} logged in via OTP`)

        return response.ok({
            success: true,
            admin: {
                id: admin.id,
                phone: admin.phone,
                name: admin.name,
                role: admin.role
            },
            token
        })
    }

    /**
     * Legacy email/password login (kept for backward compatibility)
     */
    async login({ request, response }: HttpContext) {
        const { email, password } = request.only(['email', 'password'])

        if (!email || !password) {
            return response.badRequest({ error: 'Email et mot de passe requis' })
        }

        const admin = await db.from('admin_users')
            .where('email', email)
            .where('is_active', true)
            .first()

        if (!admin) {
            return response.unauthorized({ error: 'Identifiants invalides' })
        }

        const passwordValid = await hash.verify(admin.password, password)
        if (!passwordValid) {
            return response.unauthorized({ error: 'Identifiants invalides' })
        }

        // Update last login
        await db.from('admin_users')
            .where('id', admin.id)
            .update({ last_login_at: DateTime.now().toSQL() })

        // Generate simple token (in production, use proper JWT)
        const token = Buffer.from(`${admin.id}:${Date.now()}`).toString('base64')

        return response.ok({
            success: true,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role
            },
            token
        })
    }

    /**
     * Get current admin info
     */
    async me({ request, response }: HttpContext) {
        const adminId = request.header('X-Admin-Id')

        if (!adminId) {
            return response.unauthorized({ error: 'Non authentifié' })
        }

        const admin = await db.from('admin_users')
            .where('id', adminId)
            .where('is_active', true)
            .select('id', 'email', 'phone', 'name', 'role', 'last_login_at')
            .first()

        if (!admin) {
            return response.unauthorized({ error: 'Admin non trouvé' })
        }

        return response.ok({ admin })
    }

    /**
     * Create admin user (super_admin only)
     */
    async create({ request, response }: HttpContext) {
        const { phone, name, role } = request.only(['phone', 'name', 'role'])

        if (!phone || !name) {
            return response.badRequest({ error: 'Téléphone et nom requis' })
        }

        // Normalize phone
        let normalizedPhone = phone.replace(/[^\d+]/g, '')
        if (!normalizedPhone.startsWith('+')) {
            normalizedPhone = '+225' + normalizedPhone.replace(/^0/, '')
        }

        // Check if phone already exists
        const existing = await db.from('admin_users').where('phone', normalizedPhone).first()
        if (existing) {
            return response.conflict({ error: 'Ce numéro est déjà utilisé' })
        }

        const [admin] = await db.table('admin_users').insert({
            phone: normalizedPhone,
            name,
            role: role || 'admin',
            is_active: true,
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        }).returning(['id', 'phone', 'name', 'role'])

        return response.created({
            success: true,
            admin
        })
    }

    /**
     * Seed initial admin with phone (for first setup)
     */
    async seedAdmin({ response }: HttpContext) {
        // Check if admin with this phone exists
        const existingAdmin = await db.from('admin_users').where('phone', '+2250759091098').first()
        if (existingAdmin) {
            return response.ok({ message: 'Admin avec ce numéro existe déjà', admin: existingAdmin })
        }

        // Update existing admin or create new one
        const anyAdmin = await db.from('admin_users').first()
        if (anyAdmin) {
            await db.from('admin_users')
                .where('id', anyAdmin.id)
                .update({ phone: '+2250759091098' })

            return response.ok({
                success: true,
                message: 'Numéro de téléphone ajouté à l\'admin existant',
                adminId: anyAdmin.id
            })
        }

        // Create new admin
        const [admin] = await db.table('admin_users').insert({
            phone: '+2250759091098',
            name: 'Administrateur',
            role: 'super_admin',
            is_active: true,
            created_at: DateTime.now().toSQL(),
            updated_at: DateTime.now().toSQL()
        }).returning(['id', 'phone', 'name', 'role'])

        return response.created({
            success: true,
            message: 'Admin créé avec succès',
            admin
        })
    }
}
