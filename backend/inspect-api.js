// Test script to see actual Bolna API response structure
const axios = require('axios');

const BOLNA_API_URL = 'https://api.bolna.ai';
const BOLNA_BEARER_TOKEN = 'bn-0397e2192bae4bf1917ab197010ddc1c';
const AGENT_ID = '02e47be0-feda-4e26-9cb8-e7d66f210179';

const api = axios.create({
    baseURL: BOLNA_API_URL,
    headers: {
        'Authorization': `Bearer ${BOLNA_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

async function inspectExecutionData() {
    try {
        console.log('📡 Fetching executions from Bolna API...\n');

        // Get executions
        const response = await api.get(`/v2/agent/${AGENT_ID}/executions`, {
            params: {
                page_number: 1,
                page_size: 2  // Just get 2 to inspect
            }
        });

        console.log('✅ Response received!\n');
        console.log('📊 Pagination Info:');
        console.log(`   Page: ${response.data.page_number}`);
        console.log(`   Total: ${response.data.total}`);
        console.log(`   Has More: ${response.data.has_more}\n`);

        if (response.data.data && response.data.data.length > 0) {
            const firstExecution = response.data.data[0];

            console.log('🔍 FIRST EXECUTION RAW DATA:');
            console.log('='.repeat(60));
            console.log(JSON.stringify(firstExecution, null, 2));
            console.log('='.repeat(60));

            console.log('\n📋 KEY FIELDS TO CHECK:');
            console.log(`   id: ${firstExecution.id}`);
            console.log(`   status: ${firstExecution.status}`);
            console.log(`   total_cost: ${firstExecution.total_cost}`);
            console.log(`   conversation_time: ${firstExecution.conversation_time}`);
            console.log(`   duration: ${firstExecution.duration}`);
            console.log(`   call_duration: ${firstExecution.call_duration}`);
            console.log(`   call_duration_seconds: ${firstExecution.call_duration_seconds}`);
            console.log(`   billable_duration: ${firstExecution.billable_duration}`);

            // Check all keys that contain 'time' or 'duration'
            console.log('\n🔎 ALL TIME/DURATION RELATED FIELDS:');
            Object.keys(firstExecution).forEach(key => {
                if (key.toLowerCase().includes('time') || key.toLowerCase().includes('duration')) {
                    console.log(`   ${key}: ${firstExecution[key]}`);
                }
            });

        } else {
            console.log('⚠️  No executions found');
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

inspectExecutionData();
