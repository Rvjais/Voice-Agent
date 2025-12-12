const axios = require('axios');
const Agent = require('../models/Agent');
const Execution = require('../models/Execution');

class BolnaService {
    constructor() {
        this.apiUrl = process.env.BOLNA_API_URL || 'https://api.bolna.ai';
        this.bearerToken = process.env.BOLNA_BEARER_TOKEN;
        this.axiosInstance = axios.create({
            baseURL: this.apiUrl,
            headers: {
                'Authorization': `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json',
            },
        });
    }

    // Fetch all agents (GET /agent/all)
    async fetchAllAgents() {
        try {
            const response = await this.axiosInstance.get('/agent/all');
            return response.data;
        } catch (error) {
            console.error('Error fetching all agents:', error.response?.data || error.message);
            throw error;
        }
    }

    // Fetch agent details from Bolna (GET /v2/agent/{agent_id})
    async fetchAgentDetails(bolnaAgentId) {
        try {
            const response = await this.axiosInstance.get(`/v2/agent/${bolnaAgentId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching agent ${bolnaAgentId}:`, error.response?.data || error.message);
            throw error;
        }
    }

    // Fetch all executions for a specific agent with pagination (GET /v2/agent/{agent_id}/executions)
    async fetchExecutionsForAgent(bolnaAgentId, pageNumber = 1, pageSize = 50) {
        try {
            const response = await this.axiosInstance.get(`/v2/agent/${bolnaAgentId}/executions`, {
                params: {
                    page_number: pageNumber,
                    page_size: pageSize,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching executions for agent ${bolnaAgentId}:`, error.response?.data || error.message);
            throw error;
        }
    }

    // Fetch single execution details (GET /agent/{agent_id}/execution/{execution_id})
    async fetchExecutionDetails(bolnaAgentId, bolnaExecutionId) {
        try {
            const response = await this.axiosInstance.get(`/agent/${bolnaAgentId}/execution/${bolnaExecutionId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching execution ${bolnaExecutionId}:`, error.response?.data || error.message);
            throw error;
        }
    }

    // Sync executions for all agents in the database
    async syncAllExecutions() {
        try {
            console.log('🔄 Starting execution sync...');

            const agents = await Agent.find();

            if (agents.length === 0) {
                console.log('⚠️  No agents found in database. Please add agents first.');
                return 0;
            }

            let totalSynced = 0;

            for (const agent of agents) {
                try {
                    console.log(`\n📡 Syncing agent: ${agent.name} (${agent.bolna_agent_id})`);
                    const synced = await this.syncExecutionsForAgent(agent.bolna_agent_id);
                    totalSynced += synced;
                } catch (error) {
                    console.error(`Failed to sync agent ${agent.bolna_agent_id}:`, error.message);
                }
            }

            console.log(`\n✅ Sync complete. Total executions synced: ${totalSynced}`);
            return totalSynced;
        } catch (error) {
            console.error('Error in syncAllExecutions:', error);
            throw error;
        }
    }

    // Sync executions for a specific agent (with pagination support)
    async syncExecutionsForAgent(bolnaAgentId) {
        try {
            const agent = await Agent.findOne({ bolna_agent_id: bolnaAgentId });
            if (!agent) {
                throw new Error(`Agent ${bolnaAgentId} not found in database`);
            }

            let totalSynced = 0;
            let pageNumber = 1;
            let hasMore = true;

            // Fetch all pages
            while (hasMore) {
                const response = await this.fetchExecutionsForAgent(bolnaAgentId, pageNumber, 50);

                const executions = response.data || [];
                hasMore = response.has_more || false;

                console.log(`   📄 Page ${pageNumber}: Found ${executions.length} executions`);

                // Upsert each execution
                for (const executionData of executions) {
                    try {
                        await this.upsertExecution(agent._id, executionData);
                        totalSynced++;
                    } catch (error) {
                        console.error(`Error upserting execution:`, error.message);
                    }
                }

                if (hasMore) {
                    pageNumber++;
                }
            }

            console.log(`   ✓ Synced ${totalSynced} executions across ${pageNumber} page(s)`);
            return totalSynced;
        } catch (error) {
            console.error(`Error syncing agent ${bolnaAgentId}:`, error.message);
            return 0;
        }
    }

    // Upsert execution into database
    async upsertExecution(agentId, executionData) {
        try {
            const executionId = executionData.id || executionData.execution_id;

            if (!executionId) {
                console.warn('Skipping execution without ID');
                return;
            }

            // Bolna returns cost in cents, convert to dollars
            const costInDollars = executionData.total_cost ? executionData.total_cost / 100 : 0;

            // Bolna API uses conversation_duration (in seconds) - this is the correct field!
            const conversationTime = executionData.conversation_duration
                || executionData.conversation_time
                || executionData.duration
                || executionData.call_duration
                || executionData.call_duration_seconds
                || executionData.billable_duration
                || 0;

            const executionDoc = {
                bolna_execution_id: executionId,
                agent_id: agentId,
                conversation_time: conversationTime,
                total_cost: costInDollars,
                status: executionData.status || 'pending',
                telephony_provider: executionData.telephony_data?.provider || executionData.provider,
                from_number: executionData.telephony_data?.from_number || executionData.from_number,
                to_number: executionData.telephony_data?.to_number || executionData.to_number,
                call_sid: executionData.telephony_data?.call_sid || executionData.call_sid,
                extracted_data: executionData.extracted_data || {},
                transcript: executionData.transcript || '',
                metadata: {
                    ...executionData,
                    cost_breakdown: executionData.cost_breakdown,
                    telephony_data: executionData.telephony_data,
                    recording_url: executionData.telephony_data?.recording_url,
                },
                started_at: executionData.created_at ? new Date(executionData.created_at) : null,
                ended_at: executionData.updated_at ? new Date(executionData.updated_at) : null,
            };

            await Execution.findOneAndUpdate(
                { bolna_execution_id: executionId },
                executionDoc,
                { upsert: true, new: true }
            );
        } catch (error) {
            console.error('Error upserting execution:', error.message);
            throw error;
        }
    }

    // Fetch and update single execution with full details
    async fetchAndUpdateExecution(bolnaAgentId, bolnaExecutionId) {
        try {
            const details = await this.fetchExecutionDetails(bolnaAgentId, bolnaExecutionId);

            const execution = await Execution.findOne({ bolna_execution_id: bolnaExecutionId });
            if (execution) {
                execution.extracted_data = details.extracted_data || execution.extracted_data;
                execution.transcript = details.transcript || execution.transcript;
                execution.metadata = {
                    ...execution.metadata,
                    ...details,
                    recording_url: details.telephony_data?.recording_url,
                };
                await execution.save();
            }

            return execution;
        } catch (error) {
            console.error('Error fetching execution details:', error.message);
            throw error;
        }
    }

    // Verify agent exists in Bolna and sync details
    async verifyAndSyncAgent(bolnaAgentId) {
        try {
            const agentDetails = await this.fetchAgentDetails(bolnaAgentId);
            return {
                exists: true,
                details: agentDetails,
                agent_name: agentDetails.agent_name,
                agent_status: agentDetails.agent_status,
                created_at: agentDetails.created_at,
            };
        } catch (error) {
            if (error.response?.status === 404) {
                return { exists: false, error: 'Agent not found in Bolna' };
            }
            throw error;
        }
    }
}

module.exports = new BolnaService();
