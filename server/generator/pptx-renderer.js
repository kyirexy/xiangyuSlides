const PptxGenJS = require('pptxgenjs');

const { normalizeOutline } = require('./normalize-outline');
const { getTheme } = require('./theme-registry');

function fillColorFromTheme(theme) {
    return theme.background.replace('#', '');
}

function accentColorFromTheme(theme) {
    return theme.accent.replace('#', '');
}

function textColorFromTheme(theme) {
    return theme.text.replace('#', '');
}

function mutedColorFromTheme(theme) {
    return theme.muted.replace('#', '');
}

function surfaceColorFromTheme(theme) {
    return theme.surface.replace('#', '');
}

function addBaseSlideChrome(slide, pptx, theme, index, total, deckTitle) {
    slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.333,
        h: 7.5,
        line: { color: fillColorFromTheme(theme), transparency: 100 },
        fill: { color: fillColorFromTheme(theme) }
    });

    slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 13.333,
        h: 0.12,
        line: { color: accentColorFromTheme(theme), transparency: 100 },
        fill: { color: accentColorFromTheme(theme) }
    });

    slide.addText(deckTitle, {
        x: 0.7,
        y: 0.3,
        w: 4.8,
        h: 0.24,
        fontFace: theme.bodyFont.replace(/"/g, ''),
        fontSize: 9,
        color: mutedColorFromTheme(theme),
        bold: true,
        charSpace: 1.2
    });

    slide.addText(`${index + 1} / ${total}`, {
        x: 11.7,
        y: 0.3,
        w: 0.9,
        h: 0.24,
        align: 'right',
        fontFace: theme.bodyFont.replace(/"/g, ''),
        fontSize: 9,
        color: mutedColorFromTheme(theme)
    });
}

function addTitleSlide(slide, pptx, theme, deckTitle, deckSubtitle, items) {
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.8,
        y: 1.0,
        w: 11.7,
        h: 5.4,
        rectRadius: 0.12,
        line: { color: accentColorFromTheme(theme), transparency: 80 },
        fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
    });

    slide.addText(deckTitle, {
        x: 1.2,
        y: 1.45,
        w: 8.9,
        h: 1.7,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 24,
        bold: true,
        color: textColorFromTheme(theme),
        breakLine: false,
        fit: 'shrink'
    });

    const subtitle = deckSubtitle || items[0] || '';
    if (subtitle) {
        slide.addText(subtitle, {
            x: 1.2,
            y: 3.0,
            w: 8.5,
            h: 0.8,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 13,
            color: mutedColorFromTheme(theme),
            breakLine: false,
            fit: 'shrink'
        });
    }

    items.slice(0, 3).forEach((item, itemIndex) => {
        slide.addShape(pptx.ShapeType.roundRect, {
            x: 1.2 + (itemIndex * 2.95),
            y: 4.55,
            w: 2.6,
            h: 0.52,
            rectRadius: 0.08,
            line: { color: accentColorFromTheme(theme), transparency: 85 },
            fill: { color: accentColorFromTheme(theme), transparency: 86 }
        });

        slide.addText(item, {
            x: 1.35 + (itemIndex * 2.95),
            y: 4.7,
            w: 2.25,
            h: 0.2,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 10,
            color: textColorFromTheme(theme),
            bold: true,
            align: 'center',
            fit: 'shrink'
        });
    });
}

function addBulletSlide(slide, pptx, theme, title, subtitle, items) {
    slide.addText(title, {
        x: 0.9,
        y: 1.0,
        w: 5.4,
        h: 0.8,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 21,
        bold: true,
        color: textColorFromTheme(theme),
        fit: 'shrink'
    });

    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.95,
            y: 1.72,
            w: 9.0,
            h: 0.42,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 11,
            color: mutedColorFromTheme(theme),
            fit: 'shrink'
        });
    }

    slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.9,
        y: 2.1,
        w: 11.5,
        h: 4.6,
        rectRadius: 0.08,
        line: { color: accentColorFromTheme(theme), transparency: 88 },
        fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
    });

    const textRuns = items.map((item) => ({
        text: item,
        options: {
            bullet: { indent: 18 },
            breakLine: true
        }
    }));

    slide.addText(textRuns, {
        x: 1.25,
        y: 2.45,
        w: 10.5,
        h: 3.9,
        fontFace: theme.bodyFont.replace(/"/g, ''),
        fontSize: 16,
        color: textColorFromTheme(theme),
        breakLine: false,
        paraSpaceAfterPt: 10,
        valign: 'mid',
        fit: 'shrink'
    });
}

function addFeaturesSlide(slide, pptx, theme, title, subtitle, items) {
    slide.addText(title, {
        x: 0.9,
        y: 0.95,
        w: 6.4,
        h: 0.7,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 21,
        bold: true,
        color: textColorFromTheme(theme),
        fit: 'shrink'
    });

    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.95,
            y: 1.65,
            w: 8.8,
            h: 0.36,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 11,
            color: mutedColorFromTheme(theme),
            fit: 'shrink'
        });
    }

    const positions = [
        { x: 0.95, y: 2.15 },
        { x: 6.75, y: 2.15 },
        { x: 0.95, y: 4.45 },
        { x: 6.75, y: 4.45 }
    ];

    items.slice(0, 4).forEach((item, index) => {
        const position = positions[index];
        slide.addShape(pptx.ShapeType.roundRect, {
            x: position.x,
            y: position.y,
            w: 5.55,
            h: 1.85,
            rectRadius: 0.08,
            line: { color: accentColorFromTheme(theme), transparency: 86 },
            fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
        });

        slide.addText(String(index + 1).padStart(2, '0'), {
            x: position.x + 0.28,
            y: position.y + 0.22,
            w: 0.48,
            h: 0.22,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 9,
            color: accentColorFromTheme(theme),
            bold: true,
            align: 'center'
        });

        slide.addText(item, {
            x: position.x + 0.35,
            y: position.y + 0.62,
            w: 4.85,
            h: 0.95,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 15,
            color: textColorFromTheme(theme),
            valign: 'mid',
            fit: 'shrink'
        });
    });
}

function addQuoteSlide(slide, pptx, theme, title, subtitle, items) {
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.1,
        y: 1.25,
        w: 11.1,
        h: 4.9,
        rectRadius: 0.1,
        line: { color: accentColorFromTheme(theme), transparency: 84 },
        fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
    });

    slide.addText(items[0] || title, {
        x: 1.55,
        y: 2.0,
        w: 9.8,
        h: 1.9,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 24,
        bold: true,
        color: textColorFromTheme(theme),
        align: 'center',
        valign: 'mid',
        fit: 'shrink'
    });

    const attribution = items[1] || subtitle || title;
    if (attribution) {
        slide.addText(attribution, {
            x: 3.6,
            y: 4.55,
            w: 6.0,
            h: 0.32,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 12,
            color: mutedColorFromTheme(theme),
            align: 'center',
            fit: 'shrink'
        });
    }
}

function addCodeSlide(slide, pptx, theme, title, subtitle, items) {
    slide.addText(title, {
        x: 0.9,
        y: 0.95,
        w: 5.2,
        h: 0.7,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 20,
        bold: true,
        color: textColorFromTheme(theme),
        fit: 'shrink'
    });

    if (subtitle) {
        slide.addText(subtitle, {
            x: 0.95,
            y: 1.62,
            w: 7.8,
            h: 0.32,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 11,
            color: mutedColorFromTheme(theme),
            fit: 'shrink'
        });
    }

    slide.addShape(pptx.ShapeType.roundRect, {
        x: 0.95,
        y: 2.0,
        w: 11.45,
        h: 4.9,
        rectRadius: 0.08,
        line: { color: accentColorFromTheme(theme), transparency: 88 },
        fill: { color: '0B1220' }
    });

    slide.addText(items.join('\n'), {
        x: 1.25,
        y: 2.35,
        w: 10.8,
        h: 4.15,
        fontFace: theme.codeFont.replace(/"/g, ''),
        fontSize: 12,
        color: 'E2E8F0',
        valign: 'top',
        margin: 0.04,
        fit: 'shrink'
    });
}

function addEndSlide(slide, pptx, theme, deckTitle, subtitle, items) {
    slide.addShape(pptx.ShapeType.roundRect, {
        x: 1.0,
        y: 1.2,
        w: 11.3,
        h: 5.1,
        rectRadius: 0.12,
        line: { color: accentColorFromTheme(theme), transparency: 80 },
        fill: { color: surfaceColorFromTheme(theme), transparency: 4 }
    });

    slide.addText(slide.title || 'Thank you', {
        x: 1.4,
        y: 2.0,
        w: 10.4,
        h: 1.0,
        fontFace: theme.displayFont.replace(/"/g, ''),
        fontSize: 24,
        bold: true,
        color: textColorFromTheme(theme),
        align: 'center',
        fit: 'shrink'
    });

    const copy = subtitle || deckTitle;
    if (copy) {
        slide.addText(copy, {
            x: 2.2,
            y: 3.05,
            w: 8.8,
            h: 0.4,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 12,
            color: mutedColorFromTheme(theme),
            align: 'center',
            fit: 'shrink'
        });
    }

    items.slice(0, 3).forEach((item, index) => {
        slide.addShape(pptx.ShapeType.roundRect, {
            x: 1.95 + (index * 3.15),
            y: 4.15,
            w: 2.75,
            h: 0.56,
            rectRadius: 0.08,
            line: { color: accentColorFromTheme(theme), transparency: 86 },
            fill: { color: accentColorFromTheme(theme), transparency: 88 }
        });

        slide.addText(item, {
            x: 2.1 + (index * 3.15),
            y: 4.32,
            w: 2.45,
            h: 0.18,
            fontFace: theme.bodyFont.replace(/"/g, ''),
            fontSize: 10,
            color: textColorFromTheme(theme),
            align: 'center',
            fit: 'shrink'
        });
    });
}

function exportPptxFromOutline(outlineInput, styleId) {
    const outline = normalizeOutline(outlineInput);
    const theme = getTheme(styleId);
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_WIDE';
    pptx.author = 'Xiangyu Slides';
    pptx.company = 'Xiangyu Slides';
    pptx.subject = outline.title;
    pptx.title = outline.title;
    pptx.lang = 'zh-CN';
    pptx.theme = {
        headFontFace: theme.displayFont.replace(/"/g, ''),
        bodyFontFace: theme.bodyFont.replace(/"/g, ''),
        lang: 'zh-CN'
    };

    outline.slides.forEach((slideData, index) => {
        const slide = pptx.addSlide();
        addBaseSlideChrome(slide, pptx, theme, index, outline.slides.length, outline.title);

        switch (slideData.type) {
            case 'title':
                addTitleSlide(slide, pptx, theme, slideData.title, slideData.subtitle || outline.subtitle, slideData.content);
                break;
            case 'features':
                addFeaturesSlide(slide, pptx, theme, slideData.title, slideData.subtitle, slideData.content);
                break;
            case 'quote':
                addQuoteSlide(slide, pptx, theme, slideData.title, slideData.subtitle, slideData.content);
                break;
            case 'code':
                addCodeSlide(slide, pptx, theme, slideData.title, slideData.subtitle, slideData.content);
                break;
            case 'end':
                addEndSlide(slide, pptx, theme, outline.title, slideData.subtitle, slideData.content);
                break;
            default:
                addBulletSlide(slide, pptx, theme, slideData.title, slideData.subtitle, slideData.content);
                break;
        }
    });

    return pptx.write({ outputType: 'nodebuffer' });
}

module.exports = {
    exportPptxFromOutline
};
