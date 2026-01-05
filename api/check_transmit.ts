import transmit from '@adonisjs/transmit/services/main'

async function check() {
    console.log('Transmit service:', transmit ? 'Defined' : 'Undefined')
    if (transmit) {
        console.log('Transmit routes registered:', typeof (transmit as any).registerRoutes === 'function' ? 'Yes' : 'No')
    }
}

check()
