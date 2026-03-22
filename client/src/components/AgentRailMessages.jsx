import { useEffect, useState } from 'react';
import {
    ArrowUpRight,
    Box,
    Check,
    ChevronRight,
    Lightbulb,
    Zap
} from 'lucide-react';

function formatRoundDate(value, locale) {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return locale === 'zh-CN'
        ? new Intl.DateTimeFormat('zh-CN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        }).format(date)
        : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
}

function shouldRenderLogEntry(entry) {
    if (!entry) {
        return false;
    }

    const hiddenEventTypes = new Set([
        'run_started',
        'planning_started',
        'context_compacted',
        'intent_parsed',
        'brief_locked',
        'clarification_requested',
        'presentation_ready'
    ]);

    if (hiddenEventTypes.has(String(entry.eventType || '').trim())) {
        return false;
    }

    return true;
}

function shouldShowStepStatus(entry, kind) {
    if (!entry?.stepStatus) {
        return false;
    }

    const normalized = String(entry.stepStatus).trim().toLowerCase();
    if (!normalized) {
        return false;
    }

    return kind === 'error' || normalized === 'failed' || normalized === 'error';
}

function ArtifactCard({ entry, locale, buildArtifactTags, buildLocalePath, previewLabel, openLabel }) {
    const artifact = entry.artifact;
    if (!artifact) {
        return null;
    }

    const hiddenArtifactTypes = new Set(['brief', 'presentation', 'spec', 'html', 'pptx']);
    if (hiddenArtifactTypes.has(String(artifact.type || '').trim())) {
        return null;
    }

    const tags = buildArtifactTags(artifact, locale);
    const hasPreviewRoute = Boolean(artifact.presentationId);
    const actionHref = hasPreviewRoute
        ? buildLocalePath(`/presentations/${artifact.presentationId}`, locale)
        : artifact.url || '';
    const routeLabel = hasPreviewRoute
        ? actionHref
        : artifact.url || artifact.presentationId || '';

    return (
        <div className="rail-artifact-card">
            <div className="rail-artifact-head">
                <div className="rail-artifact-copy">
                    <strong>{artifact.label || artifact.type || 'artifact'}</strong>
                    {routeLabel ? <span>{routeLabel}</span> : null}
                </div>
                {artifact.status && ['failed', 'error'].includes(String(artifact.status).trim().toLowerCase()) ? (
                    <span className={`rail-artifact-status is-${String(artifact.status).toLowerCase()}`}>
                        {artifact.status}
                    </span>
                ) : null}
            </div>
            {tags.length ? (
                <div className="rail-tag-row rail-tag-row-artifact">
                    {tags.map((tag) => (
                        <span className="rail-tag" key={`${entry.id}_${tag}`}>
                            {tag}
                        </span>
                    ))}
                </div>
            ) : null}
            {actionHref ? (
                <div className="rail-artifact-actions">
                    <a className="rail-inline-action" href={actionHref}>
                        <span>{hasPreviewRoute ? previewLabel : openLabel}</span>
                        <ArrowUpRight size={13} />
                    </a>
                </div>
            ) : null}
        </div>
    );
}

function UserBubble({ entry }) {
    return (
        <article className="rail-message rail-message-user" key={entry.id}>
            <div className="rail-bubble rail-bubble-user">
                <p>{entry.content}</p>
            </div>
        </article>
    );
}

function AssistantBubble({ entry }) {
    return (
        <article className="rail-message rail-message-assistant" key={entry.id}>
            <div className="rail-bubble rail-bubble-assistant rail-bubble-assistant-plain">
                <p>{entry.content}</p>
            </div>
        </article>
    );
}

function StepEntry({
    entry,
    locale,
    kind,
    isLastStep,
    buildArtifactTags,
    buildLocalePath,
    previewLabel,
    openLabel
}) {
    const Icon = kind === 'thinking'
        ? Lightbulb
        : kind === 'result'
            ? Check
            : kind === 'tool'
                ? Box
                : Zap;

    const cardKind = kind === 'error' ? 'error' : kind;
    const showStatusPill = shouldShowStepStatus(entry, cardKind);

    return (
        <article className={`rail-message rail-step-block rail-step-block-${cardKind} ${isLastStep ? 'is-last-step' : ''}`}>
            <div className="rail-step-head">
                <div className="rail-step-title-wrap">
                    <span className={`rail-step-node rail-step-node-${cardKind}`}>
                        <Icon size={12} />
                    </span>
                    <strong>{entry.stepLabel || (locale === 'zh-CN' ? '执行步骤' : 'Step')}</strong>
                    {showStatusPill ? (
                        <span className={`rail-status-pill is-${entry.stepStatus}`}>
                            {entry.stepStatus}
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="rail-step-body">
                <p>{entry.content}</p>
            </div>
            {entry.artifact ? (
                <ArtifactCard
                    entry={entry}
                    locale={locale}
                    buildArtifactTags={buildArtifactTags}
                    buildLocalePath={buildLocalePath}
                    previewLabel={previewLabel}
                    openLabel={openLabel}
                />
            ) : null}
        </article>
    );
}

function ReasoningCard({
    entry,
    locale,
    isLastStep,
    buildArtifactTags,
    buildLocalePath,
    previewLabel,
    openLabel
}) {
    const isStreaming = entry.stepStatus === 'running';
    const [isOpen, setIsOpen] = useState(isStreaming);

    useEffect(() => {
        if (isStreaming) {
            setIsOpen(true);
        }
    }, [isStreaming]);

    return (
        <article className={`rail-message rail-step-block rail-step-block-thinking ${isLastStep ? 'is-last-step' : ''}`}>
            <button
                type="button"
                className="rail-reasoning-toggle"
                onClick={() => setIsOpen((current) => !current)}
                aria-expanded={isOpen}
            >
                <span className="rail-step-title-wrap">
                    <span className="rail-step-node rail-step-node-thinking">
                        <Lightbulb size={12} />
                    </span>
                    <strong>{entry.stepLabel || (locale === 'zh-CN' ? '思考过程' : 'Reasoning')}</strong>
                    {isStreaming ? (
                        <span className="rail-reasoning-live">
                            <i />
                            {locale === 'zh-CN' ? '进行中' : 'Live'}
                        </span>
                    ) : null}
                </span>
                <ChevronRight size={14} className={`rail-reasoning-chevron ${isOpen ? 'is-open' : ''}`} />
            </button>
            <div className={`rail-reasoning-panel ${isOpen ? 'is-open' : ''}`}>
                <div className="rail-step-body">
                    <p>{entry.content}</p>
                </div>
                {entry.artifact ? (
                    <ArtifactCard
                        entry={entry}
                        locale={locale}
                        buildArtifactTags={buildArtifactTags}
                        buildLocalePath={buildLocalePath}
                        previewLabel={previewLabel}
                        openLabel={openLabel}
                    />
                ) : null}
            </div>
        </article>
    );
}

function ToolResultCard({
    entry,
    locale,
    kind,
    isLastStep,
    buildArtifactTags,
    buildLocalePath,
    previewLabel,
    openLabel
}) {
    return (
        <article className={`rail-message rail-step-block rail-step-block-${kind} ${isLastStep ? 'is-last-step' : ''}`}>
            <div className="rail-tool-head">
                <span className={`rail-step-node rail-step-node-${kind}`}>
                    {kind === 'result' ? <Check size={12} /> : <Box size={12} />}
                </span>
                <div className="rail-tool-copy">
                    <strong>{entry.stepLabel || (locale === 'zh-CN' ? '工具结果' : 'Tool result')}</strong>
                    {shouldShowStepStatus(entry, kind) ? (
                        <span className={`rail-status-pill is-${entry.stepStatus}`}>{entry.stepStatus}</span>
                    ) : null}
                </div>
            </div>
            <div className="rail-step-body">
                <p>{entry.content}</p>
            </div>
            {entry.artifact ? (
                <ArtifactCard
                    entry={entry}
                    locale={locale}
                    buildArtifactTags={buildArtifactTags}
                    buildLocalePath={buildLocalePath}
                    previewLabel={previewLabel}
                    openLabel={openLabel}
                />
            ) : null}
        </article>
    );
}

function isStepLike(kind) {
    return kind !== 'user' && kind !== 'assistant';
}

export function AgentRailMessages({
    logs,
    locale,
    getRailMessageKind,
    buildArtifactTags,
    buildLocalePath,
    previewLabel,
    openLabel
}) {
    const visibleLogs = logs.filter(shouldRenderLogEntry);

    return visibleLogs.map((entry, index) => {
        const kind = getRailMessageKind(entry);
        const previousEntry = visibleLogs[index - 1];
        const isLastStep = isStepLike(kind)
            ? !visibleLogs.slice(index + 1).some((next) => isStepLike(getRailMessageKind(next)))
            : false;
        const showRoundDate = index === 0
            || (entry.runId && previousEntry?.runId && entry.runId !== previousEntry.runId)
            || (!entry.runId && previousEntry && formatRoundDate(entry.createdAt, locale) !== formatRoundDate(previousEntry.createdAt, locale));

        let content = null;
        if (kind === 'user') {
            content = <UserBubble key={entry.id} entry={entry} />;
        } else if (kind === 'assistant') {
            content = <AssistantBubble key={entry.id} entry={entry} />;
        } else if (kind === 'tool' || kind === 'result') {
            content = (
                <ToolResultCard
                    key={entry.id}
                    entry={entry}
                    locale={locale}
                    kind={kind}
                    isLastStep={isLastStep}
                    buildArtifactTags={buildArtifactTags}
                    buildLocalePath={buildLocalePath}
                    previewLabel={previewLabel}
                    openLabel={openLabel}
                />
            );
        } else if (kind === 'thinking') {
            content = (
                <ReasoningCard
                    key={entry.id}
                    entry={entry}
                    locale={locale}
                    kind={kind}
                    isLastStep={isLastStep}
                    buildArtifactTags={buildArtifactTags}
                    buildLocalePath={buildLocalePath}
                    previewLabel={previewLabel}
                    openLabel={openLabel}
                />
            );
        } else {
            content = (
                <StepEntry
                    key={entry.id}
                    entry={entry}
                    locale={locale}
                    kind={kind}
                    isLastStep={isLastStep}
                    buildArtifactTags={buildArtifactTags}
                    buildLocalePath={buildLocalePath}
                    previewLabel={previewLabel}
                    openLabel={openLabel}
                />
            );
        }

        return (
            <div className="rail-round-group" key={entry.id}>
                {showRoundDate ? (
                    <div className="rail-round-separator">
                        <span>{formatRoundDate(entry.createdAt, locale)}</span>
                    </div>
                ) : null}
                {content}
            </div>
        );
    });
}
