// Comprehensive test script for all Bolna API endpoints
const axios = require('axios');

const BOLNA_API_URL = 'https://api.bolna.ai';
const BOLNA_BEARER_TOKEN = 'bn-0397e2192bae4bf1917ab197010ddc1c';

const api = axios.create({
    baseURL: BOLNA_API_URL,
    headers: {
        'Authorization': `Bearer ${BOLNA_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

const testAllAPIs = async () => {
    console.log('🧪 TESTING ALL BOLNA API ENDPOINTS');
    console.log('='.repeat(60));

    let agentId = null;

    // TEST 1: Get All Agents
    console.log('\n📋 TEST 1: GET /agent/all (List All Agents)');
    console.log('-'.repeat(60));
    try {
        const response = await api.get('/agent/all');
        const agents = response.data;
        console.log(`✅ SUCCESS - Found ${agents?.length || 0} agent(s)`);

        if (agents && agents.length > 0) {
            agentId = agents[0].id;
            console.log(`\nFirst Agent:`);
            console.log(`  Name: ${agents[0].agent_name}`);
            console.log(`  ID: ${agents[0].id}`);
            console.log(`  Status: ${agents[0].agent_status}`);
        } else {
            console.log('⚠️  No agents found. Please create an agent in Bolna first.');
        }
    } catch (error) {
        console.log(`❌ FAILED: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }

    if (!agentId) {
        console.log('\n⚠️  Cannot continue tests without an agent ID.');
        return;
    }

    // TEST 2: Get Single Agent Details
    console.log(`\n📋 TEST 2: GET /v2/agent/{agent_id} (Get Agent Details)`);
    console.log('-'.repeat(60));
    try {
        const response = await api.get(`/v2/agent/${agentId}`);
        console.log(`✅ SUCCESS - Got agent details`);
        console.log(`  Agent Name: ${response.data.agent_name}`);
        console.log(`  Agent Type: ${response.data.agent_type}`);
        console.log(`  Created: ${response.data.created_at}`);
    } catch (error) {
        console.log(`❌ FAILED: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }

    // TEST 3: Get All Executions for Agent (Pagination - Page 1)
    console.log(`\n📞 TEST 3: GET /v2/agent/{agent_id}/executions (Get All Executions)`);
    console.log('-'.repeat(60));
    try {
        const response = await api.get(`/v2/agent/${agentId}/executions`, {
            params: {
                page_number: 1,
                page_size: 10
            }
        });

        console.log(`✅ SUCCESS - Executions data received`);
        console.log(`  Page: ${response.data.page_number}`);
        console.log(`  Page Size: ${response.data.page_size}`);
        console.log(`  Total: ${response.data.total}`);
        console.log(`  Has More: ${response.data.has_more}`);
        console.log(`  Executions Found: ${response.data.data?.length || 0}`);

        if (response.data.data && response.data.data.length > 0) {
            const firstExec = response.data.data[0];
            console.log(`\n  First Execution:`);
            console.log(`    ID: ${firstExec.id}`);
            console.log(`    Status: ${firstExec.status}`);
            console.log(`    Duration: ${firstExec.conversation_time}s`);
            console.log(`    Cost: $${firstExec.total_cost || 0}`);
            console.log(`    Created: ${firstExec.created_at}`);

            // TEST 4: Get Single Execution Details
            console.log(`\n📞 TEST 4: GET /agent/{agent_id}/execution/{execution_id} (Get Execution Details)`);
            console.log('-'.repeat(60));
            try {
                const execResponse = await api.get(`/agent/${agentId}/execution/${firstExec.id}`);
                console.log(`✅ SUCCESS - Execution details received`);
                console.log(`  ID: ${execResponse.data.id}`);
                console.log(`  Status: ${execResponse.data.status}`);
                console.log(`  Conversation Time: ${execResponse.data.conversation_time}s`);
                console.log(`  Total Cost: $${execResponse.data.total_cost || 0}`);
                console.log(`  Has Transcript: ${execResponse.data.transcript ? 'Yes' : 'No'}`);
                console.log(`  Has Recording: ${execResponse.data.telephony_data?.recording_url ? 'Yes' : 'No'}`);

                if (execResponse.data.telephony_data) {
                    console.log(`  Telephony Provider: ${execResponse.data.telephony_data.provider}`);
                    console.log(`  From: ${execResponse.data.telephony_data.from_number}`);
                    console.log(`  To: ${execResponse.data.telephony_data.to_number}`);
                }
            } catch (error) {
                console.log(`❌ FAILED: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
            }
        } else {
            console.log('⚠️  No executions found for this agent.');
        }
    } catch (error) {
        console.log(`❌ FAILED: ${error.response?.status} - ${JSON.stringify(error.response?.data)}`);
    }

    // SUMMARY
    console.log('\n' + '='.repeat(60));
    console.log('✨ TEST SUMMARY');
    console.log('='.repeat(60));
    console.log('✅ If all tests passed, your Bolna API integration is working!');
    console.log('✅ Your dashboard should now be able to fetch and display data.');
    console.log('\n📝 NEXT STEPS:');
    console.log('1. Add your agent in the dashboard using ID:', agentId);
    console.log('2. Click "Sync from Bolna" to fetch all call data');
    console.log('3. Check the Call History section for transcripts and recordings');
    console.log('');
};

testAllAPIs();
