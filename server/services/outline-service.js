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

        return normalizeOutline(extractJSONObject(outlineResult));
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
