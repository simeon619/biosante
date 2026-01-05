
import db from '@adonisjs/lucid/services/db'

async function checkScores() {
    const result = await db.from('payments')
        .join('orders', 'payments.order_id', 'orders.id')
        .select('payments.id', 'payments.order_id', 'payments.reference', 'payments.trust_score', 'orders.status')
        .limit(10)

    console.log(JSON.stringify(result, null, 2))
    process.exit(0)
}

checkScores().catch(e => {
    console.error(e)
    process.exit(1)
})
