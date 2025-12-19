import express from 'express';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execPromise = util.promisify(exec);
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// Serve static files from 'public' (e.g. downloads) explicitly if needed, 
// strictly speaking vite build puts public into dist, but dynamic downloads might be outside.
// The Next.js code used `public/downloads`. We should map a volume there.
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// API: Agents List
app.get('/api/agents', (req, res) => {
    try {
        const registryPath = '/root/.claude/config/agent_registry.json';
        if (fs.existsSync(registryPath)) {
            const registryData = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
            // ... (Logic from route.ts - simplified for brevity, assume raw list or implement transformation if critical)
            // For now, returning the raw list or a mocked list to match previous logic's fallback
            return res.json({ total: registryData.agents?.length || 0, agents: registryData.agents || [] });
        }

        // Fallback Agents (copied from route.ts)
        const agents = [
            { id: "orchestrator", name: "Master Orchestrator", status: "available" },
            // ... Add more if needed, but for now minimal fallback to ensure UI doesn't crash
        ];
        res.json({ total: agents.length, agents });
    } catch (error) {
        console.error('Error fetching agents:', error);
        res.status(500).json({ error: 'Failed to fetch agents' });
    }
});

// API: Analise Generate
app.post('/api/analise/generate', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received analysis request', data?.step1_company?.nome);

        // Basic Validation
        if (!data.step1_company || !data.step1_company.nome || !data.step1_company.cnpj) {
            return res.status(400).json({ error: 'Dados da empresa incompletos' });
        }

        const timestamp = Date.now();
        const cnpjNumbers = data.step1_company.cnpj.replace(/\D/g, '') || '00000000000000';
        const id = `report-${cnpjNumbers}-${timestamp}`;
        const inputPath = path.join('/tmp', `temp-${id}.json`);

        // Ensure downloads dir exists
        const publicDownloadDir = path.resolve(__dirname, 'public', 'downloads', id);
        fs.mkdirSync(publicDownloadDir, { recursive: true });

        // Save Input JSON
        fs.writeFileSync(inputPath, JSON.stringify(data, null, 2));

        // CLI Path
        // Check if we are in the container structure
        const cliPath = '/app/libs/dpo2u-mcp/dist/cli.js';

        if (!fs.existsSync(cliPath)) {
            console.error(`CLI not found at ${cliPath}`);
            // Fallback for dev/testing if not mounted
            return res.status(500).json({ error: 'CLI tool not available' });
        }

        const env = { ...process.env };
        if (data.apiKey) env.GEMINI_API_KEY = data.apiKey;

        const command = `node ${cliPath} adequacao --input ${inputPath} --output ${publicDownloadDir} --provider gemini --model gemini-2.0-flash`;
        console.log(`Executing: ${command}`);

        const { stdout, stderr } = await execPromise(command, { env, timeout: 300000 });
        console.log('CLI Output:', stdout);

        // Find ZIP
        let relativeZipPath = '';
        const contents = fs.readdirSync(publicDownloadDir);
        for (const item of contents) {
            if (item.endsWith('.zip')) {
                relativeZipPath = item;
                break;
            }
            // Check subdirs if needed, matching original logic
            const itemPath = path.join(publicDownloadDir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                if (fs.existsSync(path.join(itemPath, 'pacote-final.zip'))) {
                    relativeZipPath = `${item}/pacote-final.zip`;
                    break;
                }
            }
        }

        if (!relativeZipPath) {
            throw new Error('ZIP not found in output');
        }

        const downloadUrl = `/downloads/${id}/${relativeZipPath}`;
        res.json({ success: true, downloadUrl, logs: stdout });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Internal Server Error' });
    }
});

// SPA Fallback
// SPA Fallback - using app.use to match all remaining requests without special syntax
app.use((req, res) => {
    // Only serve index.html for GET requests that aren't API
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        res.status(404).json({ error: 'Not Found' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
