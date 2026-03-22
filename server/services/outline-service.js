const { normalizeOutline } = require('../generator/normalize-outline');

function extractJSONObject(text) {
    const jsonMatch = String(text || '').match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
        throw new Error('No JSON found in response');
    }

    const jsonStr = jsonMatch[0];

    try {
        return JSON.parse(jsonStr);
    } catch (parseError) {
        const fixedJson = jsonStr
            .replace(/'/g, '"')
            .replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, '$1"$2":');

        return JSON.parse(fixedJson);
    }
}

function getPurposeDescription(purpose) {
    const purposeDescriptions = {
        teaching: 'Teaching deck with goals, concepts, examples, and summary.',
        pitch: 'Fundraising deck with problem, market, product, moat, team, and ask.',
        product: 'Product deck with context, features, user value, launch plan, and roadmap.',
        meeting: 'Meeting deck with progress, outcomes, blockers, and next steps.',
        company: 'Company deck with overview, business, team, traction, and vision.',
        tech: 'Technical deck with background, architecture, implementation, and lessons.',
        personal: 'Personal deck with intro, background, experience, and strengths.',
        story: 'Narrative deck with setup, progression, turning point, and takeaway.',
        marketing: 'Marketing deck with audience, offer, channels, proof, and CTA.',
        event: 'Event deck with positioning, schedule, highlights, logistics, and CTA.'
    };

    return purposeDescriptions[purpose] || purposeDescriptions.teaching;
}

function buildOutlinePrompt({ topic, purpose, length, content }) {
    return `You are a presentation outline planner.

Goal: Produce a stable, presentation-ready slide outline.
Purpose: ${getPurposeDescription(purpose)}
Length: ${length || 'medium'}
Topic: ${topic}
Context: ${content || ''}

Return JSON only:
{
  "title": "Presentation title",
  "subtitle": "Presentation subtitle",
  "slides": [
    {
      "type": "title|content|features|quote|code|end",
      "title": "Slide title",
      "subtitle": "Optional short subtitle",
      "content": ["Point 1", "Point 2", "Point 3"]
    }
  ]
}

Rules:
- Keep each bullet concise.
- Prefer 6-10 slides for medium, 4-6 for short, 10-14 for long.
- Use "features" only when a grid layout makes sense.
- Use "quote" for a single key statement.
- Use "code" only for technical topics.
- Ensure the flow is coherent from opening to closing.`;
}

function buildRegenerateSlidePrompt({ slide, outline, prompt }) {
    return `You are rewriting a single presentation slide.

Deck title: ${outline?.title || 'Untitled presentation'}
Current slide: ${JSON.stringify(slide || {})}
Other slides: ${JSON.stringify(Array.isArray(outline?.slides) ? outline.slides : [])}
User request: ${prompt}

Return JSON only:
{
  "type": "title|content|features|quote|code|end",
  "title": "Slide title",
  "subtitle": "Optional subtitle",
  "content": ["Point 1", "Point 2", "Point 3"]
}

Rules:
- Keep the slide aligned with the rest of the deck.
- Keep bullets concise.
- Preserve the existing slide type unless the user clearly asks to change it.
- Return valid JSON only.`;
}

function resolveSlideCount(length) {
    if (length === 'short') {
        return 5;
    }
    if (length === 'long') {
        return 11;
    }
    return 8;
}

function buildPurposeFlow(purpose) {
    const flows = {
        teaching: ['Opening', 'Goal', 'Core concept', 'How it works', 'Example', 'Practice', 'Summary', 'Next step'],
        pitch: ['Opening', 'Problem', 'Opportunity', 'Solution', 'Product', 'Traction', 'Why now', 'Ask'],
        product: ['Opening', 'Context', 'Problem', 'Core feature', 'Feature detail', 'User value', 'Roadmap', 'Next step'],
        meeting: ['Opening', 'Agenda', 'Progress', 'Key update', 'Risk', 'Decision', 'Next step', 'Close'],
        company: ['Opening', 'Company snapshot', 'Product', 'Business', 'Team', 'Traction', 'Vision', 'Close'],
        tech: ['Opening', 'Background', 'Architecture', 'System flow', 'Implementation', 'Trade-offs', 'Lessons', 'Close'],
        personal: ['Opening', 'Background', 'Experience', 'Strengths', 'Projects', 'Values', 'Future', 'Close'],
        story: ['Opening', 'Setup', 'Tension', 'Shift', 'Proof', 'Takeaway', 'Resolution', 'Close'],
        marketing: ['Opening', 'Audience', 'Message', 'Offer', 'Channel mix', 'Proof', 'CTA', 'Close'],
        event: ['Opening', 'Overview', 'Highlights', 'Schedule', 'Experience', 'Logistics', 'CTA', 'Close']
    };

    return flows[purpose] || flows.product;
}

function buildFallbackBullets(topic, content, sectionTitle) {
    const source = `${topic} ${content || ''}`
        .split(/[，。、“”‘’：:；;,.!?！？\s]+/)
        .map((item) => item.trim())
        .filter(Boolean);
    const keywords = Array.from(new Set(source)).slice(0, 6);

    if (!keywords.length) {
        return [
            `${sectionTitle} overview`,
            'Core point to highlight',
            'Audience takeaway'
        ];
    }

    return [
        `${sectionTitle}: ${keywords[0]}`,
        `${keywords[1] || keywords[0]} as supporting proof`,
        `${keywords[2] || keywords[0]} as the next takeaway`
    ];
}

function buildFallbackOutline({ topic, purpose = 'teaching', length = 'medium', content = '' }) {
    const count = resolveSlideCount(length);
    const flow = buildPurposeFlow(purpose);
    const sections = flow.slice(0, count);

    const slides = sections.map((sectionTitle, index) => {
        if (index === 0) {
            return {
                type: 'title',
                title: topic,
                subtitle: getPurposeDescription(purpose),
                content: []
            };
        }

        if (index === sections.length - 1) {
            return {
                type: 'end',
                title: sectionTitle,
                subtitle: 'Closing',
                content: buildFallbackBullets(topic, content, sectionTitle).slice(0, 2)
            };
        }

        return {
            type: index % 3 === 0 ? 'features' : 'content',
            title: sectionTitle,
            subtitle: `${topic} · ${sectionTitle}`,
            content: buildFallbackBullets(topic, content, sectionTitle)
        };
    });

    return normalizeOutline({
        title: topic,
        subtitle: getPurposeDescription(purpose),
        slides
    });
}

function normalizeRegeneratedSlide(rawSlide, fallbackOutlineTitle) {
    const normalizedDeck = normalizeOutline({
        title: fallbackOutlineTitle || rawSlide?.title || 'Untitled presentation',
        slides: [
            {
                type: 'title',
                title: fallbackOutlineTitle || 'Untitled presentation',
                content: []
            },
            rawSlide
        ]
    });

    return normalizedDeck.slides[1] || normalizedDeck.slides[0];
}

function createOutlineService({ miniMaxClient }) {
    async function generateStableOutline({ topic, purpose = 'teaching', length = 'medium', content = '' }) {
        const outlineResult = await miniMaxClient.chat([
            {
                role: 'user',
                content: buildOutlinePrompt({ topic, purpose, length, content })
            }
        ], {
            temperature: 0.25,
            maxTokens: 4000
        });

        try {
            return normalizeOutline(extractJSONObject(outlineResult));
        } catch (error) {
            return buildFallbackOutline({ topic, purpose, length, content });
        }
    }

    async function regenerateSlide({ slide, outline, prompt }) {
        const result = await miniMaxClient.chat([
            {
                role: 'user',
                content: buildRegenerateSlidePrompt({ slide, outline, prompt })
            }
        ], {
            temperature: 0.35,
            maxTokens: 1500
        });

        const slideData = extractJSONObject(result);
        return normalizeRegeneratedSlide({
            type: slideData.type || slide?.type || 'content',
            title: slideData.title || slide?.title || 'Slide',
            subtitle: slideData.subtitle || slide?.subtitle || '',
            content: slideData.content || slide?.content || []
        }, outline?.title || slide?.title || 'Untitled presentation');
    }

    return {
        generateStableOutline,
        regenerateSlide
    };
}

module.exports = {
    createOutlineService
};
