// Script to clear all executions and re-sync with correct cost/time values
const mongoose = require('mongoose');
require('dotenv').config();
const bolnaService = require('./services/bolnaService');

async function clearAndResync() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Load Execution model
        const Execution = require('./models/Execution');

        // Clear all executions
        const deleteResult = await Execution.deleteMany({});
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} old executions`);

        // Re-sync all executions with correct cost/time values
        console.log('\n🔄 Re-syncing executions from Bolna...\n');
        const syncedCount = await bolnaService.syncAllExecutions();

        console.log(`\n✅ Successfully synced ${syncedCount} executions with correct values!`);
        console.log('💡 Costs are now in dollars and conversation times are properly mapped.');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

clearAndResync();
