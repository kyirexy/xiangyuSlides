import { useMemo, useState } from 'react';
import {
    ArrowUpRight,
    ChevronDown,
    FileCode2,
    FolderKanban,
    GraduationCap,
    HandCoins,
    House,
    MonitorPlay,
    Plus,
    Presentation,
    Sparkles,
    Video
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { buildLocalePath, formatDate, I18N, resolveLocale } from '../lib/locale';
import { readRecentPresentations } from '../lib/storage';

function BrandMark() {
    return (
        <div className="brand-mark">
            <img src="/tubiao.jpg" alt="Xiangyu Slides" />
        </div>
    );
}

export default function HomePage() {
    const navigate = useNavigate();
    const location = useLocation();
    const locale = resolveLocale(location.search);
    const copy = I18N[locale];
    const [prompt, setPrompt] = useState('');
    const recents = useMemo(() => readRecentPresentations().slice(0, 2), []);

    const quickStarts = [
        {
            icon: HandCoins,
            title: copy.homeQuickFinanceTitle,
            body: copy.homeQuickFinanceBody,
            prompt: copy.homeQuickFinancePrompt
        },
        {
            icon: GraduationCap,
            title: copy.homeQuickTeachingTitle,
            body: copy.homeQuickTeachingBody,
            prompt: copy.homeQuickTeachingPrompt
        },
        {
            icon: MonitorPlay,
            title: copy.homeQuickProductTitle,
            body: copy.homeQuickProductBody,
            prompt: copy.homeQuickProductPrompt
        },
        {
            icon: Video,
            title: copy.homeQuickShowcaseTitle,
            body: copy.homeQuickShowcaseBody,
            prompt: copy.homeQuickShowcasePrompt
        }
    ];

    const capabilities = [
        { icon: Sparkles, label: 'AI Planning' },
        { icon: HandCoins, label: 'Pitch' },
        { icon: MonitorPlay, label: 'Product Demo' },
        { icon: GraduationCap, label: 'Teaching' },
        { icon: FileCode2, label: 'HTML Export' },
        { icon: Presentation, label: 'PPTX Export' }
    ];

    function buildWorkspaceHref(item) {
        if (!item) {
            return buildLocalePath('/create', locale);
        }

        if (item.workspaceUrl) {
            return item.workspaceUrl;
        }

        return buildLocalePath('/create', locale, {
            presentationId: item.id,
            threadId: item.threadId || ''
        });
    }

    function openStudio(nextPrompt = prompt) {
        const normalizedPrompt = (nextPrompt || '').trim();
        const href = buildLocalePath('/create', locale, {
            prompt: normalizedPrompt,
            autostart: normalizedPrompt ? '1' : ''
        });

        window.open(href, '_blank', 'noopener,noreferrer');
    }

    return (
        <div className="app-page dashboard-page">
            <header className="dashboard-topbar">
                <div className="dashboard-brand">
                    <BrandMark />
                    <div className="dashboard-brand-copy">
                        <strong>{copy.brand}</strong>
                        <span>{copy.brandEn}</span>
                    </div>
                </div>
                <div className="dashboard-top-actions">
                    <button
                        type="button"
                        className="ghost-action locale-action"
                        onClick={() => navigate(buildLocalePath(location.pathname, locale === 'zh-CN' ? 'en' : 'zh-CN'))}
                    >
                        {locale === 'zh-CN' ? copy.zhLabel : copy.enLabel}
                        <ChevronDown size={16} />
                    </button>
                    <div className="avatar-pill">X</div>
                </div>
            </header>

            <aside className="floating-sidebar">
                <button type="button" className="sidebar-create-btn" onClick={() => openStudio()}>
                    <Plus size={22} />
                </button>
                <div className="sidebar-stack">
                    <button type="button" className="sidebar-icon active">
                        <House size={20} />
                    </button>
                    <button type="button" className="sidebar-icon" onClick={() => openStudio()}>
                        <Sparkles size={20} />
                    </button>
                    <button type="button" className="sidebar-icon">
                        <FolderKanban size={20} />
                    </button>
                    <button type="button" className="sidebar-icon">
                        <Presentation size={20} />
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <section className="dashboard-hero">
                    <div className="dashboard-badge">{copy.createTitle}</div>
                    <h1>{copy.homeHeroTitle}</h1>
                    <p>{copy.homeHeroSubtitle}</p>
                    <div className="dashboard-composer">
                        <textarea
                            value={prompt}
                            onChange={(event) => setPrompt(event.target.value)}
                            placeholder={copy.homePromptPlaceholder}
                        />
                        <div className="dashboard-composer-footer">
                            <span className="dashboard-composer-hint">{copy.homePromptHint}</span>
                            <button
                                type="button"
                                className="dashboard-submit-icon"
                                onClick={() => openStudio(prompt)}
                                disabled={!prompt.trim()}
                                aria-label={copy.homeSubmit}
                                title={copy.homeSubmit}
                            >
                                <ArrowUpRight size={18} />
                            </button>
                        </div>
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-head">
                        <h2>{copy.homeQuickStartTitle}</h2>
                        <p>{copy.homeQuickStartHint}</p>
                    </div>
                    <div className="quickstart-grid">
                        {quickStarts.map(({ icon: Icon, title, body, prompt: nextPrompt }) => (
                            <button
                                type="button"
                                className="quickstart-card"
                                key={title}
                                onClick={() => setPrompt(nextPrompt)}
                            >
                                <span className="quickstart-icon">
                                    <Icon size={16} />
                                </span>
                                <strong>{title}</strong>
                                <p>{body}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section">
                    <div className="section-head">
                        <h2>{copy.homeRecentTitle}</h2>
                        <p>{copy.homeRecentHint}</p>
                    </div>
                    <div className={`recent-grid ${recents.length === 0 ? 'recent-grid-empty' : ''}`}>
                        <button type="button" className="recent-project recent-project-create" onClick={() => openStudio()}>
                            <div className="recent-preview recent-preview-create">
                                <Plus size={28} />
                            </div>
                            <div className="recent-meta">
                                <strong>{copy.homeRecentCreate}</strong>
                                <span>{copy.homeNewProject}</span>
                            </div>
                        </button>
                        {recents.length === 0 ? (
                            <article className="recent-project recent-project-empty">
                                <div className="recent-preview recent-preview-empty" />
                                <div className="recent-meta">
                                    <strong>{copy.homeRecentEmptyTitle}</strong>
                                    <p>{copy.homeRecentEmptyBody}</p>
                                </div>
                            </article>
                        ) : recents.map((item) => (
                            <article className="recent-project" key={item.id}>
                                <button
                                    type="button"
                                    className="recent-project-link"
                                    onClick={() => window.location.href = buildWorkspaceHref(item)}
                                >
                                    <div className="recent-preview recent-cover">
                                        <div className="recent-cover-overlay">
                                            <span>{item.styleName || copy.createResultLabel}</span>
                                        </div>
                                    </div>
                                    <div className="recent-meta">
                                        <strong>{item.title || item.id}</strong>
                                        <span>{formatDate(item.updatedAt, locale)}</span>
                                        <span>{item.threadId ? copy.homeRecentConversation : copy.homeRecentHint}</span>
                                    </div>
                                </button>
                                <div className="recent-actions">
                                    <button
                                        type="button"
                                        className="link-action"
                                        onClick={() => window.location.href = buildWorkspaceHref(item)}
                                    >
                                        {copy.homeRecentOpenStudio}
                                    </button>
                                    <button
                                        type="button"
                                        className="link-action"
                                        onClick={() => window.location.href = buildLocalePath(item.previewUrl || `/presentations/${item.id}`, locale)}
                                    >
                                        {copy.homeRecentOpenPreview}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="dashboard-section dashboard-capability-strip">
                    <div className="section-head">
                        <h2>{copy.homeCapabilitiesTitle}</h2>
                    </div>
                    <div className="capability-grid compact">
                        {capabilities.map(({ icon: Icon, label }) => (
                            <div className="capability-chip" key={label}>
                                <Icon size={15} />
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
