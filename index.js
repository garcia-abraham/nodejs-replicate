import express from 'express';
import Replicate from 'replicate';

const app = express();
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY,
});

app.use(express.json());

app.post('/generate', async (req, res) => {

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }
    const input = {
        cfg: 3.5,
        steps: 28,
        prompt: prompt,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 90,
        negative_prompt: "",
        prompt_strength: 0.85
    };

    const output = await replicate.run("stability-ai/stable-diffusion-3", { input });
    console.log(output);

    res.json(output);

    res.send('Generando');
});

app.post('/chat', async (req, res) => {

    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }
    const input = {
        top_k: 0,
        top_p: 0.9,
        prompt: prompt,
        max_tokens: 512,
        min_tokens: 0,
        temperature: 0.6,
        length_penalty: 1,
        prompt_template: "{prompt}",
        presence_penalty: 1.15,
        log_performance_metrics: false
    };

    for await (const event of replicate.stream("meta/meta-llama-3-8b", { input })) {
        process.stdout.write(event.toString());

        res.write(event.toString());
    };
    res.end();
});

app.listen(3000, () => {
    console.log("Server running in port 3000");
});